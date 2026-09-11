# TUPKLN Activity 360 — Shared Database Edition

เวอร์ชันนี้ใช้ React + Vite + Supabase และออกแบบให้หลายอุปกรณ์เห็นข้อมูลกิจกรรมชุดเดียวกัน

## สิ่งที่เปลี่ยนจาก Preview
- กิจกรรม กลุ่มงาน และการตั้งค่าระบบเก็บใน Supabase
- ผู้ใช้ทั่วไปเปิดลิงก์แล้วอ่านปฏิทินได้โดยไม่ต้อง Login
- รายชื่อผู้ไม่เข้าร่วมและข้อมูลผู้ประสานงานเป็นข้อมูลส่วนผู้ดูแล
- ผู้ดูแลเข้าสู่ระบบด้วย Email Magic Link แทน PIN 1234
- เปิด Realtime สำหรับปฏิทิน/กิจกรรม เพื่อให้หน้าจอที่เปิดอยู่รับการเปลี่ยนแปลงจากฐานข้อมูล
- `กลุ่มของคุณครู` ยังเก็บใน localStorage เพราะเป็นค่าความชอบเฉพาะอุปกรณ์ ไม่ใช่ข้อมูลส่วนกลาง

## Environment Variables บน Vercel
เวอร์ชันที่จัดให้เชื่อมโปรเจกต์ Supabase ของโรงเรียนไว้แล้ว จึง Deploy ได้ทันทีโดยไม่ต้องกรอก Environment Variables เพิ่ม หากภายหลังต้องการเปลี่ยน Supabase project สามารถกำหนด `VITE_SUPABASE_URL` และ `VITE_SUPABASE_PUBLISHABLE_KEY` ใน Vercel เพื่อ override ค่าเดิมได้

## Supabase Auth Redirect URL
ใน Supabase > Authentication > URL Configuration ให้ใส่ Production URL ของ Vercel เช่น
`https://tupkln-activity-360.vercel.app`
ทั้ง Site URL และ Redirect URLs ที่อนุญาต

## ทดสอบในเครื่อง
```bash
npm install
npm run dev
```


## การเข้าสู่ระบบผู้ดูแล
เวอร์ชันนี้ใช้ Email + Password ผ่าน Supabase Auth (`signInWithPassword`) แทน Magic Link เพื่อหลีกเลี่ยงข้อจำกัด email rate limit.
บัญชีต้องได้รับสิทธิ์ผู้ดูแลในฐานข้อมูลก่อนจึงจะแก้ไขข้อมูลได้.
