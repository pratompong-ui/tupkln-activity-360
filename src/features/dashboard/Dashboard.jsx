import React, { useMemo } from "react";
import { buildDashboardModel, daysOverdue } from "./dashboardModel.js";

const Empty = ({ children }) => <div className="dash-empty">{children}</div>;

function ActivityRow({ activity, unitName, formatDate, onOpen }) {
  return (
    <button className="dash-row" onClick={() => onOpen(activity.id)}>
      <span className="dash-date">{activity.time || formatDate(activity.date)}</span>
      <span className="dash-row-main">
        <strong>{activity.name || "ยังไม่ตั้งชื่อกิจกรรม"}</strong>
        <small>{unitName(activity.unitId) || "ยังไม่มอบหมาย"}{activity.place ? ` · ${activity.place}` : ""}</small>
      </span>
      <span aria-hidden="true">›</span>
    </button>
  );
}

function Section({ title, count, action, children, tone = "" }) {
  return (
    <section className={`dash-panel ${tone}`}>
      <div className="dash-panel-head">
        <div><h2>{title}</h2><span>{count} รายการ</span></div>
        {action}
      </div>
      <div className="dash-list">{children}</div>
    </section>
  );
}

export default function Dashboard({ data, myUnit, today, unitName, formatDate, onOpenActivity, onNavigate, onPickUnit }) {
  const model = useMemo(() => buildDashboardModel(data, myUnit, today), [data, myUnit, today]);

  return (
    <div className="dashboard">
      <div className="dash-welcome">
        <div>
          <span className="eyebrow">TUPKLN ACTIVITY 360 V2</span>
          <h1>ภาพรวมงานกิจกรรม</h1>
          <p>เห็นงานวันนี้ งานใกล้ถึงกำหนด และเรื่องที่ต้องติดตามได้จากจุดเดียว</p>
        </div>
        <label className="dash-scope">
          <span>ขอบเขตงานของฉัน</span>
          <select value={myUnit} onChange={(event) => onPickUnit(event.target.value)}>
            <option value="">ทุกกลุ่มงาน</option>
            {(data.units || []).map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
          </select>
        </label>
      </div>

      <div className="dash-kpis">
        <button onClick={() => onNavigate("cal")}><span>วันนี้</span><strong>{model.summary.today}</strong><small>กิจกรรม</small></button>
        <button onClick={() => onNavigate("cal")}><span>7 วันข้างหน้า</span><strong>{model.summary.nextSevenDays}</strong><small>กิจกรรม</small></button>
        <button onClick={() => onNavigate("my-work")}><span>งานของฉัน</span><strong>{model.summary.myWork}</strong><small>{myUnit ? "รายการ" : "เลือกกลุ่มก่อน"}</small></button>
        <button className={model.summary.attention ? "attention" : ""} onClick={() => onNavigate("my-work")}><span>ต้องติดตาม</span><strong>{model.summary.attention}</strong><small>รายการ</small></button>
      </div>

      <div className="dash-grid">
        <Section title="กิจกรรมวันนี้" count={model.todayActivities.length}>
          {model.todayActivities.length
            ? model.todayActivities.map((item) => <ActivityRow key={item.id} activity={item} {...{ unitName, formatDate }} onOpen={onOpenActivity} />)
            : <Empty>วันนี้ไม่มีกิจกรรมตามขอบเขตที่เลือก</Empty>}
        </Section>

        <Section title="7 วันข้างหน้า" count={model.upcomingActivities.length}>
          {model.upcomingActivities.length
            ? model.upcomingActivities.map((item) => <ActivityRow key={item.id} activity={item} {...{ unitName, formatDate }} onOpen={onOpenActivity} />)
            : <Empty>ยังไม่มีกิจกรรมใน 7 วันข้างหน้า</Empty>}
        </Section>

        <Section title="รายการที่ต้องติดตาม" count={model.followUps.length} tone={model.followUps.length ? "warn" : ""}>
          {model.followUps.length
            ? model.followUps.map((item) => <ActivityRow key={item.id} activity={item} {...{ unitName, formatDate }} onOpen={onOpenActivity} />)
            : <Empty>ไม่มีกิจกรรมที่ผ่านวันจัดและยังรอสรุปผล</Empty>}
        </Section>

        <Section title="งานเตรียมที่เลยกำหนด" count={model.overdueTasks.length} tone={model.overdueTasks.length ? "danger" : ""}
          action={<button className="text-action" onClick={() => onNavigate("tasks")}>ดูทั้งหมด</button>}>
          {model.overdueTasks.length
            ? model.overdueTasks.slice(0, 6).map((task) => (
              <button className="dash-row" key={`${task.activity.id}-${task.id}`} onClick={() => onOpenActivity(task.activity.id)}>
                <span className="dash-overdue">{daysOverdue(task.due, today)} วัน</span>
                <span className="dash-row-main"><strong>{task.title}</strong><small>{task.activity.name} · กำหนด {formatDate(task.due)}</small></span>
                <span aria-hidden="true">›</span>
              </button>
            )) : <Empty>ไม่มีงานเตรียมที่เลยกำหนด</Empty>}
        </Section>

        <Section title="หนังสือ / งานมอบหมายที่เลยกำหนด" count={model.overdueDocs.length} tone={model.overdueDocs.length ? "danger" : ""}
          action={<button className="text-action" onClick={() => onNavigate("docs")}>ดูทั้งหมด</button>}>
          {model.overdueDocs.length
            ? model.overdueDocs.slice(0, 6).map((doc) => (
              <button className="dash-row" key={doc.id} onClick={() => onNavigate("docs")}>
                <span className="dash-overdue">{daysOverdue(doc.due, today)} วัน</span>
                <span className="dash-row-main"><strong>{doc.subject || "หนังสือ / งานมอบหมาย"}</strong><small>{unitName(doc.unitId) || "ยังไม่มอบหมาย"} · กำหนด {formatDate(doc.due)}</small></span>
                <span aria-hidden="true">›</span>
              </button>
            )) : <Empty>ไม่มีหนังสือหรืองานมอบหมายที่เลยกำหนด</Empty>}
        </Section>
      </div>
    </div>
  );
}
