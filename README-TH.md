# TUPKLN School Portal v0.5

เวอร์ชันนี้พัฒนาต่อจาก v0.4 โดยเพิ่ม **Executive Dashboard** สำหรับผู้บริหาร ซึ่งรวมข้อมูลสรุปจาก Activity 360, CARE 360 และ PA 360 ไว้ในหน้าเดียว โดยไม่ส่งข้อมูลรายบุคคลจาก CARE/PA มายัง Browser

## เพิ่มใน v0.5

- Dashboard ผู้บริหาร แสดง Activity 360 + CARE 360 + PA 360 ในหน้าเดียว
- KPI ระดับโรงเรียน: นักเรียนใช้งาน, รายการติดตาม CARE, รายการเกินกำหนด, เคสเปิด, รายการ PA
- CARE 360 แสดงสัดส่วนสถานะนักเรียน `normal / watch / help / urgent`
- CARE 360 แสดงรายการติดตามที่ยังเปิด แยก `watch / help / urgent`
- แสดงจำนวน CARE ที่ครบกำหนดวันนี้, ภายใน 7 วัน และเกินกำหนด
- PA 360 แสดงสถานะ `draft / review / returned / approved`, ค่าเฉลี่ย completion และกำหนดปิดระบบ
- Action Center สร้างรายการที่ผู้บริหารควรติดตามจากข้อมูลสรุปอัตโนมัติ เช่น CARE เกินกำหนด, CARE เร่งด่วน, เคสเปิด และ PA ใกล้กำหนด
- Activity 360 แสดงจำนวนกิจกรรมวันนี้/7 วัน พร้อมรายการกำหนดการล่าสุด
- Dashboard ใช้ `/api/executive-summary` และอนุญาตเฉพาะ Role `admin`
- Cache ข้อมูล Dashboard ล่าสุดในเครื่อง ใช้เป็น fallback เมื่อสัญญาณขาดช่วง
- PWA cache เปลี่ยนเป็น v5

## โครงสร้างความปลอดภัย

Browser Login ด้วย Supabase ของ **TUPKLN Activity 360** เท่านั้น จากนั้น Access Token จะถูกส่งไปที่ Vercel Serverless Function

`/api/care-summary`
- ใช้ได้กับ `admin` และ `teacher`
- ส่งกลับเฉพาะจำนวนรวม CARE

`/api/executive-summary`
- ใช้ได้กับ `admin` เท่านั้น
- ฝั่ง Server ใช้ `CARE_SUPABASE_SERVICE_ROLE_KEY`
- อ่านข้อมูลรวมของ CARE 360 และ PA 360
- ส่งกลับเฉพาะ Count, Status Aggregate, ค่าเฉลี่ย และกำหนดเวลา
- **ไม่ส่งชื่อ รหัสนักเรียน คะแนน รายละเอียดเคส หรือข้อมูลระบุตัวบุคคล**

ห้ามนำ `CARE_SUPABASE_SERVICE_ROLE_KEY` ใส่ใน `src/`, GitHub หรือไฟล์ที่ Browser ดาวน์โหลดได้

## ขั้นตอนติดตั้ง

### 1) Supabase: TUPKLN Activity 360

ถ้าเคยรัน `supabase/activity-portal-v0.4.sql` แล้ว **v0.5 ไม่ต้องรัน SQL เพิ่ม** เพราะเวอร์ชันนี้ไม่ได้เพิ่มตารางใหม่

ถ้ายังไม่เคยรัน ให้รันไฟล์:

`supabase/activity-portal-v0.4.sql`

### 2) Vercel Environment Variables

ตั้งค่าที่ Vercel > Project > Settings > Environment Variables

```text
VITE_SUPABASE_URL=https://bkrhnxnqdesyugvxuuys.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable key ของ Activity 360>
CARE_SUPABASE_URL=https://xqjfwrkqpdptnofviyyk.supabase.co
CARE_SUPABASE_SERVICE_ROLE_KEY=<service_role key ของ CARE 360>
```

`CARE_SUPABASE_SERVICE_ROLE_KEY` ต้องอยู่ฝั่ง Vercel Server เท่านั้น

### 3) GitHub / Vercel

อัปโหลดไฟล์ทั้งโฟลเดอร์ไปยัง repo `tupkln-school-portal` แล้ว Deploy ด้วย Vercel

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

### 4) ทดสอบ v0.5

1. Login ด้วยบัญชีผู้บริหาร
2. หน้าแรกควรมีปุ่ม **Dashboard ผู้บริหาร**
3. เปิด Dashboard แล้วตรวจว่าเห็นข้อมูล CARE 360 และ PA 360
4. ตรวจว่า CARE แสดงเฉพาะข้อมูลรวม ไม่มีรายชื่อนักเรียน
5. ตรวจ Action Center ว่ามีรายการตามข้อมูลจริง
6. ตรวจ Activity 360 วันนี้และ 7 วันข้างหน้า
7. ปิดอินเทอร์เน็ตหลังเคยเปิด Dashboard แล้วลองเปิดอีกครั้ง ควรเห็นข้อมูล Cache ล่าสุดพร้อมคำว่า `OFFLINE CACHE`
8. Login ด้วย Role ครู ตรวจว่าไม่สามารถเข้าหน้า Executive Dashboard ได้

## ระบบเดิมที่ยังคงอยู่

- Login จริงด้วย Supabase Auth
- Role: ผู้บริหาร / ครู / นักเรียน / ผู้ปกครอง
- Activity 360 Realtime
- CARE summary สำหรับผู้บริหารและครู
- ประกาศกลางตาม Role
- จัดการผู้ใช้ Portal
- PWA สำหรับ iPhone / Android

## ระยะถัดไป

เหมาะที่จะพัฒนา v0.6 ต่อในหัวข้อ:
- Attendance / School Buddy summary
- Dashboard ห้องเรียนสำหรับครูที่ปรึกษา
- Notification Center รวมรายการจาก Activity + CARE
- Deep Link เปิดจาก Portal ไปยังหน้าที่เกี่ยวข้องใน CARE/Activity โดยตรง
