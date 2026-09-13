/* ============================================================================
 * TUPKLN CARE 360 — src/storage-shim.js
 *
 * หน้าที่เดียว: แปลง window.storage.get/set ให้ไปอ่านเขียน Supabase จริง
 * App.jsx จึงเรียกใช้ window.storage และ window.auth เท่านั้น ไม่รู้จัก Supabase
 *
 * import ไฟล์นี้ใน src/main.jsx ก่อน render App เสมอ:
 *   import './storage-shim.js'
 *
 * ต้องมี .env (และตั้งค่าเดียวกันใน Vercel → Environment Variables):
 *   VITE_SUPABASE_URL=...
 *   VITE_SUPABASE_ANON_KEY=...
 * ========================================================================== */

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn('[care360] ไม่พบ VITE_SUPABASE_URL หรือ VITE_SUPABASE_ANON_KEY — ระบบจะทำงานในโหมดข้อมูลจำลอง')
}

export const sb = url && key
  ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } })
  : null

const YEAR = Number(import.meta.env.VITE_CARE360_YEAR || 2569)
const TERM = Number(import.meta.env.VITE_CARE360_TERM || 1)

/* --------------------------------------------------------------------------
 * AUTH — ห่อ Supabase Auth ไว้ ไม่ให้ App.jsx ต้องรู้จัก supabase-js
 * ------------------------------------------------------------------------ */
const auth = {
  async signIn(loginId, password) {
    const raw = String(loginId || '').trim().toLowerCase()
    const email = raw.includes('@') ? raw : `${raw}@care360.local`
    const { data, error } = await sb.auth.signInWithPassword({ email, password })
    if (error) throw new Error(translateAuthError(error.message))
    return data.user
  },
  async signOut() {
    await sb.auth.signOut()
  },
  async session() {
    if (!sb) return null
    const { data } = await sb.auth.getSession()
    return data.session
  },
  onChange(cb) {
    if (!sb) return () => {}
    const { data } = sb.auth.onAuthStateChange((_e, session) => cb(session))
    return () => data.subscription.unsubscribe()
  },
  async resetPassword(email) {
    const { error } = await sb.auth.resetPasswordForEmail(email)
    if (error) throw new Error(error.message)
  },
}

function translateAuthError(m = '') {
  if (/invalid login credentials/i.test(m)) return 'เลขประจำตัวประชาชน / Passport หรือรหัสผ่านไม่ถูกต้อง'
  if (/email not confirmed/i.test(m)) return 'ยังไม่ได้ยืนยันอีเมล กรุณาตรวจกล่องจดหมาย'
  if (/rate limit/i.test(m)) return 'พยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอสักครู่'
  return 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่'
}

/* --------------------------------------------------------------------------
 * MAPPERS — แปลงแถวจากฐานข้อมูลให้เป็นรูปแบบที่หน้าจอใช้
 * ------------------------------------------------------------------------ */
const toStudent = (r) => ({
  id: r.id,
  no: r.number_in_class,
  code: r.student_code,
  first: r.first_name,
  last: r.last_name,
  nickname: r.nickname,
  level: r.level,
  room: r.room,
  classroomId: r.classroom_id,
  teacher: r.advisor_names || 'ยังไม่ระบุครูที่ปรึกษา',
  status: r.status,
  score: r.conduct_score,
  visited: !!r.visited,
})

const toAttention = (r) => ({
  id: r.id,
  sid: r.student_id,
  level: r.level,
  reason: r.reason,
  action: r.action_label,
  resolved: !!r.resolved_at,
})

const toCase = (r) => ({
  id: r.id,
  sid: r.student_id,
  title: r.title,
  type: r.case_type,
  stage: r.stage,
  prio: r.priority,
  owner: r.owner_name || '',
  note: r.summary || '',
  updated: relTime(r.updated_at),
})

function relTime(ts) {
  if (!ts) return ''
  const d = Math.floor((Date.now() - new Date(ts)) / 86400000)
  if (d <= 0) return 'วันนี้'
  if (d === 1) return 'เมื่อวาน'
  if (d < 7) return `${d} วันก่อน`
  if (d < 30) return `${Math.floor(d / 7)} สัปดาห์ก่อน`
  return new Date(ts).toLocaleDateString('th-TH')
}

/* --------------------------------------------------------------------------
 * ROUTES — คีย์ไหนไปตารางไหน
 * คีย์ที่ไม่อยู่ในตารางนี้จะตกไปที่ care360_kv (ค่าตั้งค่า/ร่างฟอร์ม)
 * ------------------------------------------------------------------------ */
const ROUTES = {
  /* ---- ผู้ใช้ปัจจุบันและขอบเขตสิทธิ์ ---- */
  me: {
    async get() {
      const { data: s } = await sb.auth.getUser()
      if (!s?.user) return null
      const { data, error } = await sb
        .from('care360_profiles')
        .select('id, full_name, title, role')
        .eq('id', s.user.id)
        .single()
      if (error) throw error

      const scope = {
        student_affairs: 'เห็นข้อมูลนักเรียนทั้งโรงเรียน',
        executive: 'เห็นข้อมูลนักเรียนทั้งโรงเรียน',
        counselor: 'เห็นข้อมูลนักเรียนทั้งโรงเรียน (อ่านอย่างเดียว)',
      }[data.role]

      let scopeText = scope
      if (!scopeText) {
        const { data: rooms } = await sb
          .from('care360_advisors')
          .select('care360_classrooms(name)')
          .eq('profile_id', s.user.id)
        const { data: lv } = await sb
          .from('care360_level_heads')
          .select('level')
          .eq('profile_id', s.user.id)
          .eq('academic_year', YEAR)
        const names = (rooms || []).map((r) => r.care360_classrooms?.name).filter(Boolean)
        scopeText = lv?.length
          ? `เห็นนักเรียนทั้งระดับชั้น ${lv.map((x) => x.level).join(', ')}`
          : names.length
            ? `เห็นเฉพาะนักเรียน ${names.join(', ')} ที่รับผิดชอบ`
            : 'ยังไม่ได้รับมอบหมายห้องเรียน'
      }

      return {
        id: data.id,
        key: data.role,
        name: data.full_name,
        title: data.title || 'ครู',
        role: data.role,
        scope: scopeText,
        canEdit: data.role !== 'counselor',
      }
    },
  },

  /* ---- รายชื่อนักเรียนตามสิทธิ์ (RLS กรองให้แล้วที่ฐานข้อมูล) ---- */
  students: {
    async get() {
      // ผู้ปกครองอ่านจาก view ที่คุมฟิลด์ไว้แล้ว ไม่แตะตารางนักเรียนโดยตรง
      const { data: u } = await sb.auth.getUser()
      const { data: me } = await sb.from('care360_profiles').select('role').eq('id', u.user.id).single()
      if (me?.role === 'parent') {
        const { data, error } = await sb.from('care360_parent_view_v').select('*')
        if (error) throw error
        return (data || []).map((r) => ({
          id: r.id, no: r.number_in_class, first: r.first_name, last: r.last_name,
          level: r.level, room: r.room, teacher: '', status: 'normal',
          score: r.conduct_score, visited: false,
          absent90: r.absent_90d, late90: r.late_90d, gpa: r.gpa,
        }))
      }
      const { data, error } = await sb
        .from('care360_students_v')
        .select('*')
        .eq('academic_year', YEAR)
        .order('level')
        .order('room')
        .order('number_in_class')
      if (error) throw error
      return (data || []).map(toStudent)
    },
  },

  /* ---- วันนี้ควรดูแลใคร ---- */
  attention: {
    async get() {
      const { data, error } = await sb
        .from('care360_attention_v')
        .select('*')
        .is('resolved_at', null)
        .lte('due_on', new Date().toISOString().slice(0, 10))
        .order('level', { ascending: false })
      if (error) throw error
      return (data || []).map(toAttention)
    },
    // set('attention', { id, note }) = บันทึกว่าติดตามแล้ว
    async set(value) {
      const { data: u } = await sb.auth.getUser()
      const { error } = await sb
        .from('care360_attention')
        .update({
          resolved_at: new Date().toISOString(),
          resolved_by: u.user.id,
          resolve_note: value.note || null,
        })
        .eq('id', value.id)
      if (error) throw error
      return value
    },
  },

  /* ---- Case ช่วยเหลือ ---- */
  cases: {
    async get() {
      const { data, error } = await sb
        .from('care360_cases_v')
        .select('*')
        .order('updated_at', { ascending: false })
      if (error) throw error
      return (data || []).map(toCase)
    },
    // set('cases', {...}) สร้างใหม่ถ้าไม่มี id, ถ้ามี id ถือเป็นการอัปเดตสถานะ
    async set(v) {
      const { data: u } = await sb.auth.getUser()
      if (v.id) {
        const { data: before } = await sb
          .from('care360_cases').select('stage').eq('id', v.id).single()
        const { error } = await sb
          .from('care360_cases')
          .update({
            stage: v.stage,
            summary: v.note ?? undefined,
            closed_on: v.stage === 'closed' ? new Date().toISOString().slice(0, 10) : null,
          })
          .eq('id', v.id)
        if (error) throw error
        await sb.from('care360_case_logs').insert({
          case_id: v.id,
          note: v.log || 'อัปเดตสถานะ',
          stage_from: before?.stage,
          stage_to: v.stage,
          created_by: u.user.id,
        })
        return v
      }
      const { data, error } = await sb
        .from('care360_cases')
        .insert({
          student_id: v.sid,
          title: v.title,
          case_type: v.type,
          priority: v.prio || 'watch',
          summary: v.note || null,
          owner_id: u.user.id,
        })
        .select().single()
      if (error) throw error
      return toCase({ ...data, owner_name: '' })
    },
  },

  /* ---- ระเบียบคะแนนความประพฤติ ---- */
  conductrules: {
    async get() {
      const [{ data: g, error: e1 }, { data: r, error: e2 }] = await Promise.all([
        sb.from('care360_conduct_rule_groups').select('*').order('is_merit').order('sort_no'),
        sb.from('care360_conduct_rules').select('*').eq('is_active', true).order('sort_no'),
      ])
      if (e1) throw e1
      if (e2) throw e2
      const byGroup = (m) => (g || []).filter((x) => x.is_merit === m).map((x) => ({
        key: x.key, emoji: x.emoji, label: x.label,
        items: (r || []).filter((i) => i.group_key === x.key).map((i) => ({
          code: i.code, label: i.label, action: i.action_text,
          min: i.points_min, max: i.points_max, severe: i.is_severe,
        })),
      })).filter((x) => x.items.length)
      return { deduct: byGroup(false), merit: byGroup(true) }
    },
  },

  /* ---- คะแนนความประพฤติ: set เท่านั้น แก้ย้อนหลังไม่ได้ตามนโยบาย ---- */
  conduct: {
    async set(v) {
      const { data: u } = await sb.auth.getUser()
      const { data: st, error: e1 } = await sb
        .from('care360_students').select('conduct_score').eq('id', v.sid).single()
      if (e1) throw e1
      const before = st.conduct_score
      const after = Math.max(0, Math.min(100, before + v.points))
      const { error } = await sb.from('care360_conduct_logs').insert({
        student_id: v.sid,
        category: v.category,
        rule_code: v.rule_code || null,
        term: v.term || TERM,
        item_label: v.label,
        points: v.points,
        score_before: before,
        score_after: after,
        note: v.note || null,
        created_by: u.user.id,
      })
      if (error) throw error
      return { sid: v.sid, before, after }
    },
  },

  /* ---- การเยี่ยมบ้าน ---- */
  homevisit: {
    async set(v) {
      const { data: u } = await sb.auth.getUser()
      const { data, error } = await sb
        .from('care360_home_visits')
        .insert({
          student_id: v.sid,
          academic_year: YEAR,
          term: v.term || 1,
          informant: v.informant || null,
          live_with: v.live || null,
          income_level: v.income || null,
          house_type: v.house || null,
          house_own: v.own || null,
          utilities: v.utilities || null,
          travel_mode: v.travel || null,
          travel_minutes: v.minutes || null,
          travel_cost: v.cost ? Number(v.cost) : null,
          findings: v.found || null,
          follow_up_topic: v.note || null,
          risk_group: v.risk || null,
          status: v.submit ? 'submitted' : 'draft',
          created_by: u.user.id,
        })
        .select().single()
      if (error) throw error

      // อัปเดตกลุ่มของนักเรียนตามผลการเยี่ยม
      if (v.submit && v.risk) {
        await sb.from('care360_students').update({ status: v.risk }).eq('id', v.sid)
      }
      return { id: data.id }
    },
  },

  /* ---- บันทึกการใช้งาน เห็นเฉพาะผู้บริหารและกิจการนักเรียน ---- */
  audit: {
    async get() {
      const { data, error } = await sb
        .from('care360_audit_log')
        .select('id, actor_id, table_name, row_id, action, created_at')
        .order('created_at', { ascending: false })
        .limit(200)
      if (error) throw error
      const ids = [...new Set((data || []).map((r) => r.actor_id).filter(Boolean))]
      const names = new Map()
      if (ids.length) {
        const { data: ps } = await sb.from('care360_profiles').select('id, full_name').in('id', ids)
        ;(ps || []).forEach((p) => names.set(p.id, p.full_name))
      }
      return (data || []).map((r) => ({
        id: r.id,
        who: names.get(r.actor_id) || 'ระบบ',
        what: r.table_name,
        action: r.action,
        rowId: r.row_id,
        when: new Date(r.created_at).toLocaleString('th-TH'),
      }))
    },
  },

  /* ---- เช็คชื่อ ---- */
  attendance: {
    // set('attendance', { date, rows:[{sid, state, note}] })
    async set(v) {
      const { data: u } = await sb.auth.getUser()
      const rows = (v.rows || []).map((r) => ({
        student_id: r.sid, on_date: v.date, state: r.state,
        note: r.note || null, created_by: u.user.id,
      }))
      if (!rows.length) return { saved: 0 }
      const { error } = await sb.from('care360_attendance')
        .upsert(rows, { onConflict: 'student_id,on_date' })
      if (error) throw error
      return { saved: rows.length }
    },
  },

  /* ---- การส่งต่อ ---- */
  referral: {
    async set(v) {
      const { data: u } = await sb.auth.getUser()
      const { data: k } = await sb.from('care360_cases')
        .select('id').eq('student_id', v.sid).neq('stage', 'closed')
        .order('updated_at', { ascending: false }).limit(1).maybeSingle()

      let caseId = k?.id
      if (!caseId) {
        // ยังไม่มี Case ที่เปิดอยู่ ให้เปิดให้อัตโนมัติ การส่งต่อต้องผูกกับเคสเสมอ
        const { data: nk, error: ek } = await sb.from('care360_cases').insert({
          student_id: v.sid,
          title: v.track === 'discipline' ? 'ส่งต่อสายวินัย' : 'ส่งต่อสายดูแลจิตใจ',
          case_type: v.track === 'discipline' ? 'พฤติกรรม' : 'สุขภาพจิต',
          priority: v.to_step >= 4 ? 'urgent' : 'help',
          summary: v.reason, owner_id: u.user.id, stage: 'referred',
        }).select('id').single()
        if (ek) throw ek
        caseId = nk.id
      } else {
        await sb.from('care360_cases').update({ stage: 'referred' }).eq('id', caseId)
      }

      const { data, error } = await sb.from('care360_referrals').insert({
        case_id: caseId, student_id: v.sid, track: v.track,
        from_step: v.from_step || null, to_step: v.to_step,
        to_person: v.to_person || null, to_person_id: v.to_person_id || null,
        reason: v.reason, actions_taken: v.actions_taken || null,
        request_to: v.request_to || null, priority: v.priority || 'normal',
        is_skip: !!v.is_skip, skip_reason: v.skip_reason || null,
        consent: !!v.consent, created_by: u.user.id,
      }).select().single()
      if (error) throw error
      return data
    },
  },

  /* ---- การติดต่อผู้ปกครอง ---- */
  parentcontact: {
    async set(v) {
      const { data: u } = await sb.auth.getUser()
      const { data, error } = await sb.from('care360_parent_contacts').insert({
        student_id: v.sid, channel: v.channel, contacted: v.contacted,
        topic: v.topic, outcome: v.outcome, note: v.note || null,
        next_action: v.next_action || null, next_on: v.next_on || null,
        created_by: u.user.id,
      }).select().single()
      if (error) throw error
      return data
    },
  },

  /* ---- ขั้นตอนการดูแลช่วยเหลือ 5 ขั้น ---- */
  carestep: {
    // set('carestep', { sid, step, evidence })
    async set(v) {
      const { data: u } = await sb.auth.getUser()
      const { data: st } = await sb
        .from('care360_students')
        .select('classroom_id, care360_classrooms(academic_year)')
        .eq('id', v.sid).single()
      const yr = st?.care360_classrooms?.academic_year || YEAR
      const { error } = await sb.from('care360_care_steps').upsert({
        student_id: v.sid, academic_year: yr, step: v.step,
        evidence: v.evidence || null, created_by: u.user.id,
      }, { onConflict: 'student_id,academic_year,step' })
      if (error) throw error
      return v
    },
  },

  /* ---- แบบคัดกรอง ---- */
  instruments: {
    async get() {
      const { data, error } = await sb
        .from('care360_screen_instruments')
        .select('code, name, rater, item_count, scale_max')
        .eq('is_active', true)
      if (error) throw error
      return data || []
    },
    // set('instruments', {...}) บันทึกผลคัดกรอง
    // ปกติคือคัดลอกผลกลุ่มมาจาก HERO OBEC CARE (source: 'hero')
    // ส่วน answers ใช้เฉพาะกรณีทำแบบประเมินในระบบนี้เป็นตัวสำรอง
    async set(v) {
      const { data: u } = await sb.auth.getUser()
      const row = {
        student_id: v.sid,
        instrument: v.instrument,
        academic_year: YEAR,
        term: v.term || 1,
        note: v.note || null,
        created_by: u.user.id,
      }
      if (v.source === 'hero') {
        Object.assign(row, {
          source: 'hero',
          band: v.band,
          hero_round: v.hero_round || null,
          assessor: v.assessor || null,
          screened_on: v.screened_on || new Date().toISOString().slice(0, 10),
        })
      } else {
        Object.assign(row, { source: 'internal', answers: v.answers })
      }
      const { data, error } = await sb
        .from('care360_screenings')
        .upsert(row, { onConflict: 'student_id,instrument,academic_year,term' })
        .select('scores, band').single()
      if (error) throw error
      return data
    },
  },
}

/* --------------------------------------------------------------------------
 * คีย์แบบมีพารามิเตอร์: 'student:<id>:details' | 'student:<id>:conduct' | 'student:<id>:visits'
 * ------------------------------------------------------------------------ */
async function dynamicGet(key) {
  const m = key.match(/^student:([0-9a-f-]+):(\w+)$/i)
  if (!m) return undefined
  const [, sid, what] = m

  if (what === 'details') {
    const { data } = await sb.from('care360_student_details').select('*').eq('student_id', sid).maybeSingle()
    return data || null
  }
  if (what === 'conduct') {
    const { data, error } = await sb
      .from('care360_conduct_logs')
      .select('*, care360_profiles(full_name)')
      .eq('student_id', sid)
      .order('created_at', { ascending: false })
      .limit(30)
    if (error) throw error
    return (data || []).map((r) => ({
      date: new Date(r.occurred_on).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
      title: r.item_label,
      body: r.note || '',
      delta: r.points,
      by: r.care360_profiles?.full_name || '',
    }))
  }
  if (what === 'screen') {
    const { data, error } = await sb
      .from('care360_screenings')
      .select('instrument, scores, band, screened_on, term, source, hero_round')
      .eq('student_id', sid)
      .order('screened_on', { ascending: false })
    if (error) throw error
    return data || []
  }
  if (what === 'referrals') {
    const { data, error } = await sb
      .from('care360_referral_current_v')
      .select('track, step, status, created_at, step_label, to_person, to_person_name, reason, case_id')
      .eq('student_id', sid)
    if (error) throw error
    return data || []
  }
  if (what === 'referral-log') {
    const { data, error } = await sb
      .from('care360_referral_log_v')
      .select('*')
      .eq('student_id', sid)
    if (error) throw error
    return data || []
  }
  if (what === 'contacts') {
    const { data, error } = await sb
      .from('care360_parent_contacts')
      .select('channel, contacted, topic, outcome, note, next_action, next_on, contacted_at')
      .eq('student_id', sid)
      .order('contacted_at', { ascending: false })
    if (error) throw error
    return (data || []).map((r) => ({ ...r, when: new Date(r.contacted_at).toLocaleString('th-TH') }))
  }
  if (what === 'grades') {
    const { data, error } = await sb
      .from('care360_grades_v')
      .select('subject_code, subject_name, term, credit, result, is_risk')
      .eq('student_id', sid)
      .order('term')
    if (error) throw error
    return data || []
  }
  if (what === 'steps') {
    const { data } = await sb.from('care360_care_steps')
      .select('step, done_on, evidence').eq('student_id', sid)
    return data || []
  }
  if (what === 'visits') {
    const { data, error } = await sb
      .from('care360_home_visits')
      .select('*, care360_home_visit_photos(kind, storage_path)')
      .eq('student_id', sid)
      .order('visited_on', { ascending: false })
    if (error) throw error
    return data || []
  }
  return undefined
}

async function dynamicAttendance(key) {
  const m = key.match(/^attendance:(\d{4}-\d{2}-\d{2})$/)
  if (!m) return undefined
  const { data, error } = await sb
    .from('care360_attendance')
    .select('student_id, state, note')
    .eq('on_date', m[1])
  if (error) throw error
  return data || []
}

// รายชื่อผู้รับเรื่องที่เป็นไปได้ในแต่ละขั้น
async function dynamicRecipients(key) {
  const m = key.match(/^recipients:(\w+):(\d+):(.*)$/)
  if (!m) return undefined
  const { data, error } = await sb.rpc('care360_referral_candidates', {
    p_track: m[1], p_step: Number(m[2]), p_level: m[3] || null,
  })
  if (error) throw error
  return data || []
}

async function dynamicAttReport(key) {
  const m = key.match(/^attendance-report:(\d+)$/)
  if (!m) return undefined
  const n = Number(m[1])
  const from = new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)

  const { data: daily, error } = await sb
    .from('care360_attendance_daily_v')
    .select('on_date, present_n, late_n, leave_n, absent_n, total_n')
    .gte('on_date', from)
  if (error) throw error

  const byDate = new Map()
  ;(daily || []).forEach((r) => {
    const cur = byDate.get(r.on_date) || { date: r.on_date, total: 0, absent: 0, late: 0 }
    cur.total += r.total_n; cur.absent += r.absent_n; cur.late += r.late_n
    byDate.set(r.on_date, cur)
  })

  const { data: stu } = await sb
    .from('care360_attendance_student_v')
    .select('student_id, first_name, last_name, room, absent_30d, late_30d')
    .order('absent_30d', { ascending: false })
    .limit(10)

  return {
    days: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)),
    students: (stu || []).filter((x) => x.absent_30d > 0 || x.late_30d > 2).map((x) => ({
      id: x.student_id, name: `${x.first_name} ${x.last_name}`, room: x.room,
      absent_30d: x.absent_30d, late_30d: x.late_30d,
    })),
  }
}

async function dynamicItems(key) {
  const m = key.match(/^items:([\w-]+)$/)
  if (!m) return undefined
  const { data, error } = await sb
    .from('care360_screen_items')
    .select('item_no, subscale, is_reverse, text')
    .eq('instrument', m[1])
    .order('item_no')
  if (error) throw error
  return data || []
}

async function dynamicSet(key, value) {
  const m = key.match(/^student:([0-9a-f-]+):details$/i)
  if (!m) return undefined
  const { data: u } = await sb.auth.getUser()
  const { error } = await sb
    .from('care360_student_details')
    .upsert({ student_id: m[1], ...value, updated_by: u.user.id, updated_at: new Date().toISOString() })
  if (error) throw error
  return value
}

/* --------------------------------------------------------------------------
 * window.storage — สัญญาเดียวกับที่ App.jsx ใช้อยู่
 * ------------------------------------------------------------------------ */
const storage = {
  async get(key, shared = false) {
    if (!sb) return null
    try {
      if (ROUTES[key]?.get) {
        const value = await ROUTES[key].get()
        return value === null ? null : { key, value, shared }
      }
      const dyn = await dynamicGet(key)
      if (dyn !== undefined) return dyn === null ? null : { key, value: dyn, shared }
      const items = await dynamicItems(key)
      if (items !== undefined) return { key, value: items, shared }
      const att = await dynamicAttendance(key)
      if (att !== undefined) return { key, value: att, shared }
      const rep = await dynamicAttReport(key)
      if (rep !== undefined) return { key, value: rep, shared }
      const rc = await dynamicRecipients(key)
      if (rc !== undefined) return { key, value: rc, shared }

      const { data: u } = await sb.auth.getUser()
      const q = sb.from('care360_kv').select('value, is_shared').eq('key', key)
      const { data, error } = shared
        ? await q.eq('is_shared', true).limit(1).maybeSingle()
        : await q.eq('owner_id', u.user.id).maybeSingle()
      if (error) throw error
      return data ? { key, value: data.value, shared: data.is_shared } : null
    } catch (e) {
      console.error('[care360] storage.get', key, e)
      throw e
    }
  },

  async set(key, value, shared = false) {
    if (!sb) return null
    try {
      if (ROUTES[key]?.set) return { key, value: await ROUTES[key].set(value), shared }
      const dyn = await dynamicSet(key, value)
      if (dyn !== undefined) return { key, value: dyn, shared }

      const { data: u } = await sb.auth.getUser()
      const { error } = await sb.from('care360_kv').upsert({
        owner_id: u.user.id, key, value, is_shared: shared, updated_at: new Date().toISOString(),
      })
      if (error) throw error
      return { key, value, shared }
    } catch (e) {
      console.error('[care360] storage.set', key, e)
      throw e
    }
  },

  async delete(key, shared = false) {
    if (!sb) return null
    const { data: u } = await sb.auth.getUser()
    const { error } = await sb.from('care360_kv').delete().eq('key', key).eq('owner_id', u.user.id)
    if (error) throw error
    return { key, deleted: true, shared }
  },

  async list(prefix = '', shared = false) {
    if (!sb) return { keys: [], prefix, shared }
    const { data: u } = await sb.auth.getUser()
    const { data, error } = await sb
      .from('care360_kv').select('key')
      .eq('owner_id', u.user.id).like('key', `${prefix}%`)
    if (error) throw error
    return { keys: (data || []).map((r) => r.key), prefix, shared }
  },

  /* อัปโหลดภาพเยี่ยมบ้านเข้า bucket แบบ private แล้วผูกกับ visit */
  async uploadVisitPhoto(visitId, kind, file) {
    const path = `${visitId}/${kind}-${crypto.randomUUID()}.jpg`
    const { error } = await sb.storage.from('care360-visit-photos').upload(path, file, { upsert: false })
    if (error) throw error
    const { data: u } = await sb.auth.getUser()
    await sb.from('care360_home_visit_photos')
      .insert({ visit_id: visitId, kind, storage_path: path, created_by: u.user.id })
    return path
  },

  /* รูปนักเรียน เก็บใน bucket แบบ private เช่นเดียวกับภาพเยี่ยมบ้าน */
  async uploadStudentPhoto(studentId, file) {
    const path = `${studentId}/profile.jpg`
    const { error } = await sb.storage
      .from('care360-student-photos').upload(path, file, { upsert: true })
    if (error) throw error
    await sb.from('care360_students').update({ photo_path: path }).eq('id', studentId)
    return path
  },

  async studentPhotoUrl(path, seconds = 900) {
    if (!path) return null
    const { data, error } = await sb.storage
      .from('care360-student-photos').createSignedUrl(path, seconds)
    if (error) return null
    return data.signedUrl
  },

  /* ภาพเป็น private ต้องขอ signed URL อายุสั้นทุกครั้ง */
  async signedPhotoUrl(path, seconds = 300) {
    const { data, error } = await sb.storage.from('care360-visit-photos').createSignedUrl(path, seconds)
    if (error) throw error
    return data.signedUrl
  },
}

if (typeof window !== 'undefined') {
  window.storage = storage
  window.auth = auth
  window.__care360_ready = !!sb
}

export { storage, auth }
