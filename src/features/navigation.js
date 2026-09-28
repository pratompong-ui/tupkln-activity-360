export const MAIN_NAV_ITEMS = [
  { id: "home", icon: "⌂", label: "หน้าแรก" },
  { id: "cal", icon: "📅", label: "ปฏิทิน" },
  { id: "my-work", icon: "✓", label: "งานของฉัน" },
  { id: "report", icon: "📊", label: "สรุป–รายงาน", adminOnly: true },
];

export const MANAGEMENT_NAV_ITEMS = [
  { id: "docs", icon: "📨", label: "หนังสือ / งานมอบหมาย" },
  { id: "acts", icon: "📋", label: "กิจกรรมทั้งหมด", adminOnly: true },
];

export const ADMIN_TOOL_ITEMS = [
  { modal: "bulk", icon: "📥", label: "เพิ่มหลายงาน" },
  { modal: "units", icon: "👥", label: "จัดการกลุ่ม" },
  { modal: "settings", icon: "⚙", label: "ตั้งค่าระบบ" },
];
