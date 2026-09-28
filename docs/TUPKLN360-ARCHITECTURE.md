# TUPKLN ACTIVITY 360 V2 — Architecture Direction

เอกสารนี้กำหนดทิศทางของ Activity 360 ในฐานะโมดูลหนึ่งของ **TUPKLN 360 Integrated School Management Platform** โดย V2 เป็น incremental refactor ที่รักษา schema, ข้อมูล production และ behavior เดิมไว้ก่อน

## หลักการของ V2

- หน้าแรกเป็น operational dashboard สำหรับผู้บริหารและครู ไม่ใช่หน้าจัดการข้อมูล
- แยกขอบเขตเป็น `Dashboard`, `Calendar`, `My Work`, `Reports` และ `Admin Tools`
- Supabase Realtime เป็นช่องทาง sync หลัก; polling ทุก 5 นาทีเป็น fallback พร้อม refresh เมื่อกลับเข้า tab
- ความสามารถเดิมยังอยู่ครบ ได้แก่ Google Calendar/ICS, checklist, เอกสารแนบ, รายงาน, Auth, Realtime และการสรุปผล
- สิทธิ์แก้ไขยังตรวจจาก Supabase RPC เดิม ไม่ย้าย logic ไปไว้ใน UI และไม่แก้ schema ในงาน V2 นี้

## โครงโมดูลเป้าหมาย

```text
TUPKLN 360 Shell
├─ Shared Identity & Role
├─ Shared Notification
├─ Shared Master Data (บุคลากร/กลุ่มงาน/ปีการศึกษา)
├─ CARE 360
└─ ACTIVITY 360
   ├─ Dashboard
   ├─ Calendar
   ├─ My Work
   ├─ Reports
   └─ Admin Tools
```

โค้ด V2 เริ่มแยก `src/features/dashboard`, `src/features/my-work` และ navigation config ออกจาก `App.jsx` แล้ว ขั้นถัดไปควรทยอยย้าย Calendar, Reports และ Admin Tools โดยรักษา adapter ของข้อมูลเดิมไว้จนกว่าจะมี integration contract กลาง

## ขอบเขตข้อมูลและ API

Activity 360 ควรเป็นเจ้าของข้อมูลเฉพาะโดเมนกิจกรรม เช่น กิจกรรม งานเตรียม หนังสือที่เชื่อมกับกิจกรรม ผลสรุป และผู้ไม่เข้าร่วม ส่วนข้อมูลบุคลากร หน่วยงาน identity และ notification ควรอ้างอิง shared identifier จาก TUPKLN 360

แนวทางเชื่อมต่อในอนาคต:

1. เพิ่ม facade/interface ฝั่ง client เช่น `IdentityProvider`, `RoleProvider`, `NotificationProvider` และ `SchoolDirectoryProvider`
2. ให้ adapter ปัจจุบันอ่าน Supabase Auth/RPC เดิมไปก่อน
3. เมื่อ Shared Services พร้อม เปลี่ยนเฉพาะ adapter โดยไม่ผูกหน้า Dashboard หรือ My Work กับระบบ login เฉพาะโมดูล
4. ใช้ stable IDs สำหรับ user, unit, student และ academic term หลีกเลี่ยงการ join ด้วยชื่อ
5. ใช้ event contract แบบ versioned เช่น `activity.created.v1`, `activity.assigned.v1`, `activity.completed.v1`

## การเชื่อมกับ CARE 360

CARE 360 และ Activity 360 ควรแลกเปลี่ยนเฉพาะข้อมูลที่จำเป็นผ่าน service/API หรือ event ที่มีสิทธิ์กำกับ ไม่อ่านตารางภายในของกันและกันโดยตรง

- Activity 360 ส่งบริบทกิจกรรม: รหัสกิจกรรม วันเวลา กลุ่มเป้าหมาย และสถานะสรุปผล
- CARE 360 อาจส่งข้อมูล participation/attendance แบบ aggregate หรือ reference ที่ได้รับอนุญาต
- ข้อมูลรายบุคคลต้องใช้ shared person/student ID และตรวจ role/consent ตามนโยบายโรงเรียน
- หน้า dashboard ผู้บริหารควรรับ aggregate ที่ลดการเปิดเผยข้อมูลส่วนบุคคล
- การลบหรือแก้ข้อมูลต้นทางต้องมี audit trail และส่ง correction event ได้

## Identity, Role และ Notification

V2 ไม่สร้าง Profile หรือ Notification model ใหม่ที่ผูกตายกับ Activity 360 ปุ่มเข้าสู่โหมดผู้ดูแลยังเป็น compatibility layer ของระบบเดิมเท่านั้น

เป้าหมายระยะถัดไป:

- Shared Login ออก session/token กลาง
- Shared Role ส่ง capability เช่น `activity.read`, `activity.manage`, `activity.report`
- Shared Notification รับ event แล้วตัดสิน channel และ preference นอกโมดูล
- UI ตรวจ capability เพื่อแสดง action แต่ฐานข้อมูล/API ต้อง enforce สิทธิ์ซ้ำเสมอ

## Realtime และต้นทุน Egress

- subscribe เฉพาะตารางที่ UI ใช้ และโหลดใหม่เมื่อได้รับ change event
- ใช้ polling 5 นาทีเป็น safety net ไม่ใช่ primary sync
- งด refresh ระหว่างเปิด modal เพื่อไม่ทำข้อมูลที่กำลังกรอกหาย
- ขั้นถัดไปควรเปลี่ยนจากการ reload ชุดข้อมูลทั้งหมดเป็น query ตาม page/ช่วงวันที่ และใช้ incremental cache
- ติดตามจำนวน realtime events, payload bytes, query bytes และ cache hit rate ก่อนปรับ architecture รอบต่อไป

## แผน incremental refactor

1. V2: dashboard/navigation/responsive/realtime fallback โดยไม่เปลี่ยน schema
2. แยก Calendar, Reports, Admin Tools และ data selectors ออกจาก `App.jsx`
3. เพิ่ม repository/service layer ครอบ `window.storage` และ Supabase adapter
4. เพิ่ม capability-based authorization และ shared identity adapter
5. เพิ่ม event/outbox integration กับ CARE 360 และ Shared Notification
6. ย้าย reporting ไป read model/aggregate ที่เหมาะสมเมื่อข้อมูลมีปริมาณมากขึ้น

ทุกขั้นต้องมี migration/rollback plan, ทดสอบกับ staging และห้ามใช้ production เป็นพื้นที่ทดลอง schema
