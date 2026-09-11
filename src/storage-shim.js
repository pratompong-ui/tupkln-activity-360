import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bkrhnxnqdesyugvxuuys.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_3yTgGn4-TrF1E0ksKJVF_Q_ToTEvMVL';
const SHARED_KEY = 'tupkln_activity_v4';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY');
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

async function isAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  const { data, error } = await supabase.rpc('activity360_is_admin');
  return !error && data === true;
}

async function loadSharedData() {
  const [settingsRes, unitsRes, actsRes] = await Promise.all([
    supabase.from('activity360_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('activity360_units').select('*').order('sort_order'),
    supabase.from('activity360_activities').select('*').order('no'),
  ]);
  if (settingsRes.error) throw settingsRes.error;
  if (unitsRes.error) throw unitsRes.error;
  if (actsRes.error) throw actsRes.error;

  const admin = await isAdmin();
  let privateByActivity = new Map();
  let absentByActivity = new Map();

  if (admin) {
    const [privateRes, absentRes] = await Promise.all([
      supabase.from('activity360_activity_private').select('*'),
      supabase.from('activity360_absentees').select('*').order('created_at'),
    ]);
    if (privateRes.error) throw privateRes.error;
    if (absentRes.error) throw absentRes.error;
    privateByActivity = new Map((privateRes.data || []).map((x) => [x.activity_id, x]));
    for (const p of absentRes.data || []) {
      const list = absentByActivity.get(p.activity_id) || [];
      list.push({ id: p.id, name: p.name, unit: p.unit || '', reason: p.reason || '' });
      absentByActivity.set(p.activity_id, list);
    }
  }

  const s = settingsRes.data || {};
  const units = (unitsRes.data || []).map((u) => ({ id: u.id, name: u.name, short: u.short, type: u.type }));
  const activities = (actsRes.data || []).map((a) => {
    const priv = privateByActivity.get(a.id) || {};
    const absentees = admin
      ? (absentByActivity.get(a.id) || [])
      : Array.from({ length: a.absent_count || 0 }, (_, i) => ({ id: `hidden-${a.id}-${i}`, name: '', unit: '', reason: '' }));
    return {
      id: a.id,
      no: a.no,
      name: a.name || '',
      unitId: a.unit_id || '',
      date: a.activity_date || '',
      dateEnd: a.activity_end_date || '',
      time: a.activity_time || '',
      place: a.place || '',
      dress: a.dress || '',
      target: a.target_group || '',
      contact: admin ? (priv.contact || '') : '',
      docUrl: a.doc_url || (admin ? (priv.doc_url || '') : ''),
      result: a.result || '',
      closed: !!a.closed,
      absentees,
      updatedAt: a.updated_at,
    };
  });

  return {
    meta: {
      school: s.school || 'โรงเรียนเตรียมอุดมศึกษาพัฒนาการเขลางค์นคร',
      year: s.academic_year || '',
    },
    units,
    activities,
  };
}

async function persistSharedData(next) {
  if (!(await isAdmin())) throw new Error('Admin authorization required');
  const { data: { user } } = await supabase.auth.getUser();
  const uid = user?.id || null;

  const { error: settingsError } = await supabase.from('activity360_settings').upsert({
    id: 1,
    school: next.meta?.school || 'โรงเรียนเตรียมอุดมศึกษาพัฒนาการเขลางค์นคร',
    academic_year: next.meta?.year || '',
    updated_by: uid,
  });
  if (settingsError) throw settingsError;

  const units = (next.units || []).map((u, i) => ({
    id: u.id, name: u.name, short: u.short || '', type: u.type || '', sort_order: i + 1, updated_by: uid,
  }));
  if (units.length) {
    const { error } = await supabase.from('activity360_units').upsert(units);
    if (error) throw error;
  }

  const activities = (next.activities || []).map((a) => ({
    id: a.id,
    no: Number(a.no),
    name: a.name || '',
    unit_id: a.unitId || null,
    activity_date: a.date || null,
    activity_end_date: a.dateEnd || null,
    activity_time: a.time || '',
    place: a.place || '',
    dress: a.dress || '',
    target_group: a.target || '',
    doc_url: a.docUrl || '',
    result: a.result || '',
    closed: !!a.closed,
    updated_by: uid,
  }));

  const { data: existingActs, error: existingError } = await supabase.from('activity360_activities').select('id');
  if (existingError) throw existingError;
  const nextIds = new Set(activities.map((a) => a.id));
  const removeIds = (existingActs || []).map((x) => x.id).filter((id) => !nextIds.has(id));
  if (removeIds.length) {
    const { error } = await supabase.from('activity360_activities').delete().in('id', removeIds);
    if (error) throw error;
  }
  if (activities.length) {
    let { error } = await supabase.from('activity360_activities').upsert(activities);
    // ฐานข้อมูลที่ยังไม่ได้เพิ่มคอลัมน์ใหม่ ให้ลองบันทึกใหม่โดยตัดคอลัมน์นั้นออก
    if (error && /activity_end_date|doc_url|column|schema cache/i.test(error.message || '')) {
      const trimmed = activities.map((r) => {
        const c = { ...r };
        delete c.activity_end_date;
        delete c.doc_url;
        return c;
      });
      const retry = await supabase.from('activity360_activities').upsert(trimmed);
      error = retry.error;
      if (!error) console.warn('บันทึกสำเร็จแบบตัดคอลัมน์ใหม่ออก กรุณารันสคริปต์ SQL เพิ่มคอลัมน์');
    }
    if (error) throw error;
  }

  const privateRows = (next.activities || []).map((a) => ({
    activity_id: a.id,
    contact: a.contact || '',
    doc_url: a.docUrl || '',
    updated_by: uid,
  }));
  if (privateRows.length) {
    const { error } = await supabase.from('activity360_activity_private').upsert(privateRows);
    if (error) throw error;
  }

  // Replace absentee rows from the current admin view. This keeps edits/deletes consistent.
  const activityIds = (next.activities || []).map((a) => a.id);
  if (activityIds.length) {
    const { error } = await supabase.from('activity360_absentees').delete().in('activity_id', activityIds);
    if (error) throw error;
  }
  const absenteeRows = [];
  for (const a of next.activities || []) {
    for (const p of a.absentees || []) {
      if (!p.name) continue;
      absenteeRows.push({
        id: p.id,
        activity_id: a.id,
        name: p.name,
        unit: p.unit || '',
        reason: p.reason || '',
        created_by: uid,
      });
    }
  }
  if (absenteeRows.length) {
    const { error } = await supabase.from('activity360_absentees').insert(absenteeRows);
    if (error) throw error;
  }
}

window.activityAuth = {
  async isAdmin() { return isAdmin(); },
  async signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  },
  async signOut() { return supabase.auth.signOut(); },
  onChange(callback) {
    const { data } = supabase.auth.onAuthStateChange(async () => callback(await isAdmin()));
    return () => data.subscription.unsubscribe();
  },
};

window.activityRealtime = {
  subscribe(callback) {
    const channel = supabase.channel('activity360-web')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity360_settings' }, callback)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity360_units' }, callback)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity360_activities' }, callback)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  },
};

window.storage = {
  async get(key, shared = false) {
    if (shared && key === SHARED_KEY) {
      const value = JSON.stringify(await loadSharedData());
      return { value };
    }
    const value = window.localStorage.getItem(key);
    return value === null ? null : { value };
  },
  async set(key, value, shared = false) {
    if (shared && key === SHARED_KEY) {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      await persistSharedData(parsed);
      return { value: JSON.stringify(parsed) };
    }
    window.localStorage.setItem(key, value);
    return { value };
  },
  async delete(key, shared = false) {
    if (shared && key === SHARED_KEY) throw new Error('Shared database cannot be deleted from browser');
    window.localStorage.removeItem(key);
    return { ok: true };
  },
};
