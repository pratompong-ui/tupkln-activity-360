/* TUPKLN ACTIVITY 360 — service worker
   หลักการ: หน้าเว็บและไฟล์โปรแกรมใช้ "เครือข่ายก่อน" เสมอ เพื่อไม่ให้ครูติดอยู่กับเวอร์ชันเก่า
   ถ้าออฟไลน์จึงค่อยดึงจากแคชที่เก็บไว้ ส่วนข้อมูลจาก Supabase ไม่แคชเด็ดขาด */
const CACHE = 'tupkln-activity-v1';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // ข้อมูลผู้ใช้และการเข้าสู่ระบบ ต้องสดเสมอ
  if (url.hostname.endsWith('supabase.co') || url.hostname.endsWith('supabase.in')) return;
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match('/index.html')))
  );
});
