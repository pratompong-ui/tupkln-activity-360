import React, { useMemo } from "react";
import { buildDashboardModel, daysOverdue } from "../dashboard/dashboardModel.js";

export default function MyWork({ data, myUnit, today, unitName, formatDate, onPickUnit, onOpenActivity, onNavigate }) {
  const model = useMemo(() => buildDashboardModel(data, myUnit, today), [data, myUnit, today]);
  const work = model.myWork;

  if (!myUnit) {
    return (
      <div className="card my-work-empty">
        <span className="eyebrow">MY WORK</span>
        <h1>เลือกกลุ่มงานของคุณครู</h1>
        <p>ระบบจะรวมกิจกรรม งานเตรียม และหนังสือที่เกี่ยวข้องไว้ในหน้านี้ โดยบันทึกตัวเลือกไว้เฉพาะอุปกรณ์นี้</p>
        <select className="inp" value="" onChange={(event) => onPickUnit(event.target.value)}>
          <option value="">เลือกกลุ่มงาน</option>
          {(data.units || []).map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
        </select>
      </div>
    );
  }

  const unit = unitName(myUnit);
  return (
    <div className="my-work">
      <div className="work-head">
        <div><span className="eyebrow">MY WORK</span><h1>งานของฉัน</h1><p>{unit}</p></div>
        <select value={myUnit} onChange={(event) => onPickUnit(event.target.value)}>
          {(data.units || []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </div>
      <div className="work-summary">
        <div><strong>{work.activities.length}</strong><span>กิจกรรมที่เปิดอยู่</span></div>
        <div><strong>{work.tasks.length}</strong><span>งานเตรียม</span></div>
        <div><strong>{work.docs.length}</strong><span>หนังสือ / งานมอบหมาย</span></div>
      </div>
      <div className="dash-grid">
        <section className="dash-panel"><div className="dash-panel-head"><div><h2>กิจกรรมของกลุ่ม</h2><span>{work.activities.length} รายการ</span></div></div>
          <div className="dash-list">{work.activities.length ? work.activities.map((item) => (
            <button className="dash-row" key={item.id} onClick={() => onOpenActivity(item.id)}><span className="dash-date">{item.date ? formatDate(item.date) : "รอกำหนด"}</span><span className="dash-row-main"><strong>{item.name}</strong><small>{item.place || "ยังไม่ระบุสถานที่"}</small></span><span>›</span></button>
          )) : <div className="dash-empty">ไม่มีกิจกรรมที่เปิดอยู่</div>}</div>
        </section>
        <section className="dash-panel"><div className="dash-panel-head"><div><h2>งานเตรียม</h2><span>{work.tasks.length} รายการ</span></div><button className="text-action" onClick={() => onNavigate("tasks")}>ดูทั้งหมด</button></div>
          <div className="dash-list">{work.tasks.length ? work.tasks.slice(0, 8).map((task) => (
            <button className="dash-row" key={`${task.activity.id}-${task.id}`} onClick={() => onOpenActivity(task.activity.id)}><span className={task.due && task.due < today ? "dash-overdue" : "dash-date"}>{task.due ? (task.due < today ? `${daysOverdue(task.due, today)} วัน` : formatDate(task.due)) : "ไม่มีกำหนด"}</span><span className="dash-row-main"><strong>{task.title}</strong><small>{task.activity.name}</small></span><span>›</span></button>
          )) : <div className="dash-empty">ไม่มีงานเตรียมค้างอยู่</div>}</div>
        </section>
        <section className="dash-panel"><div className="dash-panel-head"><div><h2>หนังสือ / งานมอบหมาย</h2><span>{work.docs.length} รายการ</span></div><button className="text-action" onClick={() => onNavigate("docs")}>ดูทั้งหมด</button></div>
          <div className="dash-list">{work.docs.length ? work.docs.slice(0, 8).map((doc) => (
            <button className="dash-row" key={doc.id} onClick={() => onNavigate("docs")}><span className={doc.due && doc.due < today ? "dash-overdue" : "dash-date"}>{doc.due ? formatDate(doc.due) : "ไม่มีกำหนด"}</span><span className="dash-row-main"><strong>{doc.subject || "หนังสือ / งานมอบหมาย"}</strong><small>{doc.owner || unit}</small></span><span>›</span></button>
          )) : <div className="dash-empty">ไม่มีหนังสือหรืองานมอบหมายที่เปิดอยู่</div>}</div>
        </section>
      </div>
    </div>
  );
}
