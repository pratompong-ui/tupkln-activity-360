/* TUPKLN ACTIVITY 360 — Service Worker
   แนวทาง:
   - หน้าเว็บและไฟล์โปรแกรม: Network First
   - ถ้าเครือข่ายใช้งานไม่ได้: ใช้ไฟล์ที่เคย Cache
   - การเปิดหน้า/Route ขณะ Offline: fallback ไป index.html
   - ข้อมูล Supabase และ API: ไม่ Cache
*/

const CACHE = "tupkln-activity-v2";

const SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("tupkln-activity-") &&
                key !== CACHE
            )
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // จัดการเฉพาะ GET
  if (request.method !== "GET") return;

  // ข้อมูลจาก Supabase ต้องสดเสมอ และไม่เก็บลง Cache
  if (
    url.hostname.endsWith("supabase.co") ||
    url.hostname.endsWith("supabase.in")
  ) {
    return;
  }

  // เผื่ออนาคตมี API ของระบบเอง ก็ไม่ Cache เช่นกัน
  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    return;
  }

  // ไม่ยุ่งกับทรัพยากรจากเว็บไซต์ภายนอก
  if (url.origin !== self.location.origin) return;

  // การเปิดหน้าเว็บหรือ Route ของแอป
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();

            caches
              .open(CACHE)
              .then((cache) => cache.put(request, copy))
              .catch(() => {});
          }

          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);

          if (cachedPage) {
            return cachedPage;
          }

          return caches.match("/index.html");
        })
    );

    return;
  }

  // JS / CSS / รูปภาพ / Font และไฟล์ภายในแอป
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();

          caches
            .open(CACHE)
            .then((cache) => cache.put(request, copy))
            .catch(() => {});
        }

        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);

        if (cached) {
          return cached;
        }

        return Response.error();
      })
  );
});
