import test from "node:test";
import assert from "node:assert/strict";
import { addDays, buildDashboardModel, daysOverdue } from "../src/features/dashboard/dashboardModel.js";

const data = {
  units: [{ id: "u1", name: "วิชาการ" }, { id: "u2", name: "กิจการนักเรียน" }],
  activities: [
    { id: "today", name: "ประชุม", unitId: "u1", date: "2026-09-28", tasks: [], closed: false },
    { id: "week", name: "ค่าย", unitId: "u1", date: "2026-10-03", tasks: [], closed: false },
    { id: "past", name: "งานเก่า", unitId: "u1", date: "2026-09-20", tasks: [{ id: "t1", title: "สรุปเอกสาร", due: "2026-09-25", done: false }], closed: false },
    { id: "other", name: "งานอีกกลุ่ม", unitId: "u2", date: "2026-09-28", tasks: [], closed: false },
  ],
  docs: [
    { id: "d1", subject: "แบบตอบรับ", unitId: "u1", due: "2026-09-26", status: "doing" },
    { id: "d2", subject: "ปิดแล้ว", unitId: "u1", due: "2026-09-20", status: "done" },
  ],
};

test("dashboard scopes operational work to the selected unit", () => {
  const result = buildDashboardModel(data, "u1", "2026-09-28");
  assert.deepEqual(result.todayActivities.map((item) => item.id), ["today"]);
  assert.deepEqual(result.upcomingActivities.map((item) => item.id), ["week"]);
  assert.deepEqual(result.followUps.map((item) => item.id), ["past"]);
  assert.equal(result.overdueTasks.length, 1);
  assert.equal(result.overdueDocs.length, 1);
  assert.equal(result.summary.attention, 3);
});

test("completed documents are excluded from overdue and my work", () => {
  const result = buildDashboardModel(data, "u1", "2026-09-28");
  assert.deepEqual(result.myWork.docs.map((item) => item.id), ["d1"]);
  assert.deepEqual(result.overdueDocs.map((item) => item.id), ["d1"]);
});

test("date helpers handle month boundaries", () => {
  assert.equal(addDays("2026-09-28", 7), "2026-10-05");
  assert.equal(daysOverdue("2026-09-25", "2026-09-28"), 3);
});
