# TUPKLN Activity 360 — Vercel Preview

แพ็กเกจนี้ทำให้ไฟล์ JSX เดิมเปิดเป็น React/Vite และ Deploy บน Vercel ได้

## สำคัญ
เวอร์ชันนี้เป็น **Preview / Demo** เท่านั้น ข้อมูลถูกเก็บใน `localStorage` ของ browser แต่ละเครื่อง จึงไม่แชร์ข้อมูลระหว่างครูและไม่ควรใช้เก็บข้อมูลผู้ไม่เข้าร่วมกิจกรรมจริง

## ทดสอบในเครื่อง
1. ติดตั้ง Node.js
2. เปิด Terminal ในโฟลเดอร์นี้
3. รัน `npm install`
4. รัน `npm run dev`
5. เปิด URL ที่ Vite แสดง

## Deploy บน Vercel
### วิธีแนะนำ: GitHub
1. สร้าง GitHub repository ใหม่ เช่น `tupkln-activity-360`
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้
3. เข้า Vercel > Add New > Project
4. Import repository
5. Framework Preset เลือก Vite (ส่วนใหญ่ระบบตรวจให้อัตโนมัติ)
6. กด Deploy

### ใช้ Vercel CLI
ติดตั้ง CLI: `npm i -g vercel`
จากนั้นรัน `vercel` และเมื่อพร้อมใช้งานจริงรัน `vercel --prod`

## ก่อนเปิดใช้จริงกับครู
ควรเปลี่ยนระบบข้อมูลกลางเป็น Supabase/Postgres และเพิ่มระบบ Login/Auth โดยอย่างน้อยต้องแยกสิทธิ์:
- ผู้บริหาร / Admin: เพิ่ม แก้ไข ลบ และดูรายชื่อผู้ไม่เข้าร่วม
- ครู: อ่านปฏิทินและข้อมูลกิจกรรมตามสิทธิ์
- ผู้ใช้งานทั่วไป: ไม่ควรเห็นข้อมูลรายบุคคล

ควรเปิด Row Level Security (RLS) และไม่เก็บ service-role/secret key ใน frontend

## ไฟล์สำคัญ
- `src/App.jsx` — โค้ดเดิมของ TUPKLN Activity 360
- `src/storage-shim.js` — ทำให้ `window.storage` เดิมทำงานบน browser ผ่าน localStorage
- `src/main.jsx` — จุดเริ่มต้น React
- `vercel.json` — รองรับการ Deploy แบบ SPA บน Vercel
