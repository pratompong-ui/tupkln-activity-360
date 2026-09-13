import React, { useState, useMemo, useEffect, useRef } from "react";

/* ==========================================================================
   TUPKLN CARE 360 — ระบบดูแลช่วยเหลือนักเรียน
   โรงเรียนเตรียมอุดมศึกษาพัฒนาการเขลางค์นคร
   ขั้นที่ 1: UI Prototype (mock data, clickable ทุกหน้า)
   ไฟล์เดียวจบ — CSS inject ผ่าน <style>, ไม่ใช้ Tailwind, ไม่มี dependency
   ========================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap');

:root{
  --pink:#E01B6E;
  --pink-deep:#B3114F;
  --pink-soft:#FFD9E8;
  --pink-mist:#FFF0F6;
  --navy:#16205C;
  --navy-soft:#EAEDF7;
  --navy-mid:#4A5590;
  --cream:#FBF6F2;
  --white:#FFFFFF;
  --ink:#1B1F33;
  --ink-mid:#5B6076;
  --ink-soft:#8C90A3;
  --line:#EFE7E1;

  --green:#2E9E6B;  --green-bg:#E6F5EE;
  --yellow:#D99A2B; --yellow-bg:#FCF3E0;
  --orange:#E0692F; --orange-bg:#FDEDE4;
  --red:#D5384A;    --red-bg:#FCE9EB;
  --blue:#3A6FD9;   --blue-bg:#E8EFFC;

  --r-card:22px;
  --r-sm:14px;
  --r-pill:999px;
  --sh-1:0 1px 2px rgba(22,32,92,.04), 0 6px 18px rgba(22,32,92,.06);
  --sh-2:0 2px 6px rgba(22,32,92,.06), 0 18px 40px rgba(22,32,92,.10);
  --sh-pink:0 10px 28px rgba(224,27,110,.24);
  --ease:cubic-bezier(.22,.68,.36,1);
}

*,*::before,*::after{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0}

.c360{
  font-family:'IBM Plex Sans Thai','Noto Sans Thai',system-ui,-apple-system,sans-serif;
  background:var(--cream);
  color:var(--ink);
  min-height:100vh;
  -webkit-font-smoothing:antialiased;
  font-size:15px;
  line-height:1.6;
}
.c360 button{font-family:inherit}
.c360 input,.c360 select,.c360 textarea{font-family:inherit;font-size:15px}
.c360 :focus-visible{outline:3px solid rgba(224,27,110,.45);outline-offset:2px;border-radius:8px}

/* ---------- decorative background ---------- */
.bg-deco{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:0}
.blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.5}
.blob-a{width:420px;height:420px;background:var(--pink-soft);top:-170px;right:-90px}
.blob-b{width:360px;height:360px;background:#DDE4F7;bottom:-160px;left:180px}

/* ---------- shell ---------- */
.shell{display:flex;min-height:100vh;position:relative;z-index:1}
.side{
  width:256px;flex:0 0 256px;padding:22px 16px;
  display:flex;flex-direction:column;gap:6px;
  position:sticky;top:0;height:100vh;
}
.brand{display:flex;align-items:center;gap:11px;padding:4px 8px 20px}
.brand-mark{width:44px;height:44px;flex:0 0 44px}
.brand-t1{font-weight:700;font-size:15.5px;letter-spacing:.2px;color:var(--navy);line-height:1.15}
.brand-t2{font-size:11.5px;color:var(--ink-soft);line-height:1.3;margin-top:2px}

.nav-group-label{font-size:11px;color:var(--ink-soft);padding:14px 12px 5px;font-weight:600}
.nav-item{
  display:flex;align-items:center;gap:11px;width:100%;
  padding:10px 12px;border:0;background:transparent;cursor:pointer;
  border-radius:14px;color:var(--ink-mid);font-size:14.5px;font-weight:500;
  text-align:left;transition:background .18s var(--ease),color .18s var(--ease);
  position:relative;
}
.nav-item:hover{background:rgba(224,27,110,.07);color:var(--navy)}
.nav-item.on{background:var(--pink);color:#fff;font-weight:600;box-shadow:var(--sh-pink)}
.nav-item.on .nav-ic{opacity:1}
.nav-ic{width:20px;height:20px;flex:0 0 20px;opacity:.75}
.nav-badge{
  margin-left:auto;background:var(--pink);color:#fff;font-size:11px;font-weight:700;
  min-width:21px;height:21px;border-radius:999px;display:grid;place-items:center;padding:0 6px;
}
.nav-item.on .nav-badge{background:rgba(255,255,255,.26)}

.side-foot{margin-top:auto;padding-top:14px}
.me-card{
  display:flex;align-items:center;gap:10px;padding:11px 12px;
  background:var(--white);border-radius:18px;box-shadow:var(--sh-1);width:100%;
  border:0;cursor:pointer;text-align:left;transition:transform .18s var(--ease)
}
.me-card:hover{transform:translateY(-2px)}
.avatar{
  width:36px;height:36px;flex:0 0 36px;border-radius:50%;
  background:linear-gradient(145deg,var(--pink),var(--navy));
  color:#fff;display:grid;place-items:center;font-weight:700;font-size:14px
}
.me-name{font-size:13.5px;font-weight:600;color:var(--navy);line-height:1.2}
.me-role{font-size:11.5px;color:var(--ink-soft)}

/* ---------- main ---------- */
.main{flex:1;min-width:0;padding:26px 34px 60px}
.page-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:20px;flex-wrap:wrap}
.page-title{font-size:25px;font-weight:700;color:var(--navy);margin:0;letter-spacing:-.2px}
.page-sub{font-size:14px;color:var(--ink-mid);margin:3px 0 0}

/* ---------- cards ---------- */
.card{background:var(--white);border-radius:var(--r-card);box-shadow:var(--sh-1);padding:20px}
.card-lift{transition:transform .2s var(--ease),box-shadow .2s var(--ease)}
.card-lift:hover{transform:translateY(-3px);box-shadow:var(--sh-2)}

.welcome{
  background:linear-gradient(118deg,var(--navy) 0%,#28306E 46%,var(--pink-deep) 118%);
  border-radius:26px;padding:28px 30px;color:#fff;position:relative;overflow:hidden;
  display:flex;align-items:center;gap:20px;margin-bottom:18px
}
.welcome::after{
  content:'';position:absolute;width:300px;height:300px;border-radius:50%;
  background:rgba(255,255,255,.06);right:-70px;top:-110px
}
.welcome-text{flex:1;min-width:0;position:relative;z-index:1}
.welcome h2{margin:0;font-size:22px;font-weight:700}
.welcome p{margin:6px 0 0;font-size:14.5px;color:rgba(255,255,255,.82);max-width:52ch}
.welcome-mascot{position:relative;z-index:1;flex:0 0 auto}
.welcome-cta{
  margin-top:15px;display:inline-flex;align-items:center;gap:8px;
  background:#fff;color:var(--pink);border:0;border-radius:var(--r-pill);
  padding:10px 20px;font-weight:600;font-size:14.5px;cursor:pointer;
  transition:transform .16s var(--ease),box-shadow .16s var(--ease)
}
.welcome-cta:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.18)}
.welcome-cta:active{transform:translateY(0) scale(.98)}

.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
.stat{
  background:var(--white);border-radius:var(--r-card);padding:18px 18px 16px;
  box-shadow:var(--sh-1);position:relative;overflow:hidden;cursor:pointer;border:0;
  text-align:left;width:100%;transition:transform .2s var(--ease),box-shadow .2s var(--ease)
}
.stat:hover{transform:translateY(-3px);box-shadow:var(--sh-2)}
.stat-ic{width:40px;height:40px;border-radius:13px;display:grid;place-items:center;margin-bottom:12px}
.stat-num{font-size:31px;font-weight:700;color:var(--navy);line-height:1.05;letter-spacing:-.6px}
.stat-num small{font-size:15px;font-weight:600;color:var(--ink-soft);margin-left:3px}
.stat-lab{font-size:13.5px;color:var(--ink-mid);margin-top:3px}
.stat-trend{font-size:12px;margin-top:8px;display:flex;align-items:center;gap:5px;color:var(--ink-soft)}

/* ---------- attention cards ---------- */
.att-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px}
.att{
  background:var(--white);border-radius:var(--r-card);padding:18px;box-shadow:var(--sh-1);
  position:relative;overflow:hidden;transition:transform .2s var(--ease),box-shadow .2s var(--ease),opacity .3s
}
.att:hover{transform:translateY(-3px);box-shadow:var(--sh-2)}
.att::before{content:'';position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--c,var(--pink))}
.att-top{display:flex;gap:12px;align-items:flex-start}
.att-ava{
  width:46px;height:46px;flex:0 0 46px;border-radius:16px;display:grid;place-items:center;
  font-weight:700;font-size:16px;color:#fff;background:linear-gradient(145deg,var(--pink),var(--navy))
}
.att-name{font-weight:600;font-size:16px;color:var(--navy);line-height:1.25}
.att-meta{font-size:12.5px;color:var(--ink-soft)}
.att-reason{font-size:13.5px;color:var(--ink-mid);margin:12px 0 0;line-height:1.55}
.att-teacher{font-size:12.5px;color:var(--ink-soft);margin-top:10px;display:flex;align-items:center;gap:6px}
.att-acts{display:flex;gap:8px;margin-top:14px}
.att.done{background:var(--green-bg)}
.att.done::before{background:var(--green)}
.att-done-msg{
  display:flex;align-items:center;gap:9px;margin-top:14px;font-weight:600;
  color:var(--green);font-size:14px;animation:pop .34s var(--ease)
}
@keyframes pop{0%{opacity:0;transform:scale(.86)}60%{transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}

/* ---------- pills / badges ---------- */
.badge{
  display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:var(--r-pill);
  font-size:12.5px;font-weight:600;white-space:nowrap
}
.dot{width:7px;height:7px;border-radius:50%;background:currentColor;flex:0 0 7px}
.b-green{background:var(--green-bg);color:var(--green)}
.b-yellow{background:var(--yellow-bg);color:var(--yellow)}
.b-orange{background:var(--orange-bg);color:var(--orange)}
.b-red{background:var(--red-bg);color:var(--red)}
.b-blue{background:var(--blue-bg);color:var(--blue)}
.b-navy{background:var(--navy-soft);color:var(--navy)}
.b-pink{background:var(--pink-mist);color:var(--pink)}

/* ---------- buttons ---------- */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:7px;
  border:0;border-radius:var(--r-pill);padding:9px 17px;font-size:14px;font-weight:600;
  cursor:pointer;transition:transform .14s var(--ease),background .18s,box-shadow .18s var(--ease);
  background:var(--navy-soft);color:var(--navy)
}
.btn:hover{background:#DFE4F3}
.btn:active{transform:scale(.96)}
.btn-primary{background:var(--pink);color:#fff;box-shadow:var(--sh-pink)}
.btn-primary:hover{background:var(--pink-deep)}
.btn-ghost{background:transparent;color:var(--ink-mid);box-shadow:none}
.btn-ghost:hover{background:rgba(22,32,92,.06)}
.btn-sm{padding:7px 13px;font-size:13px}
.btn-lg{padding:12px 24px;font-size:15.5px}
.btn-block{width:100%}
.btn[disabled]{opacity:.45;cursor:not-allowed}

/* ---------- section head ---------- */
.sec-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:26px 0 13px}
.sec-title{font-size:17.5px;font-weight:700;color:var(--navy);margin:0;display:flex;align-items:center;gap:9px}
.sec-count{background:var(--pink-mist);color:var(--pink);font-size:12.5px;font-weight:700;padding:2px 10px;border-radius:var(--r-pill)}

/* ---------- chips ---------- */
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{
  border:1.5px solid var(--line);background:var(--white);color:var(--ink-mid);
  padding:7px 14px;border-radius:var(--r-pill);font-size:13.5px;font-weight:500;cursor:pointer;
  transition:all .16s var(--ease)
}
.chip:hover{border-color:var(--pink-soft);color:var(--pink)}
.chip.on{background:var(--navy);border-color:var(--navy);color:#fff;font-weight:600}

/* ---------- student list ---------- */
.stu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(252px,1fr));gap:13px}
.stu{
  background:var(--white);border-radius:var(--r-card);padding:16px;box-shadow:var(--sh-1);
  cursor:pointer;border:0;text-align:left;width:100%;
  transition:transform .2s var(--ease),box-shadow .2s var(--ease);
  display:flex;gap:12px;align-items:center
}
.stu:hover{transform:translateY(-3px);box-shadow:var(--sh-2)}
.stu-ava{
  width:44px;height:44px;flex:0 0 44px;border-radius:15px;display:grid;place-items:center;
  color:#fff;font-weight:700;font-size:15px
}
.stu-name{font-weight:600;font-size:14.8px;color:var(--navy);line-height:1.25}
.stu-meta{font-size:12px;color:var(--ink-soft);margin-top:1px}

/* ---------- search ---------- */
.search{
  display:flex;align-items:center;gap:10px;background:var(--white);
  border-radius:var(--r-pill);padding:11px 18px;box-shadow:var(--sh-1);flex:1;min-width:220px
}
.search input{border:0;outline:0;background:transparent;flex:1;color:var(--ink);min-width:0}
.search input::placeholder{color:var(--ink-soft)}

/* ---------- hero profile ---------- */
.hero{
  background:linear-gradient(125deg,var(--navy),#2B3474 58%,var(--pink-deep) 140%);
  border-radius:26px;padding:26px;color:#fff;position:relative;overflow:hidden;margin-bottom:16px
}
.hero::after{content:'';position:absolute;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,.05);right:-60px;bottom:-130px}
.hero-row{display:flex;gap:20px;align-items:center;position:relative;z-index:1;flex-wrap:wrap}
.hero-ava{
  width:88px;height:88px;flex:0 0 88px;border-radius:28px;background:rgba(255,255,255,.16);
  display:grid;place-items:center;font-size:30px;font-weight:700;border:2px solid rgba(255,255,255,.28)
}
.hero-name{font-size:24px;font-weight:700;margin:0;letter-spacing:-.2px}
.hero-meta{font-size:13.5px;color:rgba(255,255,255,.76);margin:4px 0 10px}
.hero-score{margin-left:auto;display:flex;align-items:center;gap:16px}
.hero-kv{font-size:12.5px;color:rgba(255,255,255,.72)}
.hero-kv b{display:block;font-size:14.5px;color:#fff;font-weight:600}

.face-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:13px}
.face{
  background:var(--white);border-radius:var(--r-card);padding:18px;box-shadow:var(--sh-1);
  cursor:pointer;border:0;text-align:left;width:100%;
  transition:transform .2s var(--ease),box-shadow .2s var(--ease)
}
.face:hover{transform:translateY(-4px);box-shadow:var(--sh-2)}
.face-ic{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;font-size:20px;margin-bottom:11px}
.face-t{font-weight:600;font-size:15px;color:var(--navy)}
.face-d{font-size:12.5px;color:var(--ink-soft);margin-top:2px;line-height:1.45}

/* ---------- detail rows ---------- */
.kv{display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid var(--line)}
.kv:last-child{border-bottom:0}
.kv-k{font-size:13.5px;color:var(--ink-soft);flex:0 0 auto}
.kv-v{font-size:14px;color:var(--ink);font-weight:500;text-align:right}

.timeline{position:relative;padding-left:26px}
.timeline::before{content:'';position:absolute;left:7px;top:6px;bottom:6px;width:2px;background:var(--line)}
.tl-item{position:relative;padding-bottom:18px}
.tl-item:last-child{padding-bottom:0}
.tl-dot{position:absolute;left:-24px;top:4px;width:14px;height:14px;border-radius:50%;border:3px solid var(--white);box-shadow:0 0 0 2px currentColor}
.tl-date{font-size:12px;color:var(--ink-soft)}
.tl-title{font-weight:600;font-size:14.5px;color:var(--navy);margin-top:1px}
.tl-body{font-size:13.5px;color:var(--ink-mid);margin-top:3px;line-height:1.55}

/* ---------- progress ---------- */
.pbar{height:9px;border-radius:var(--r-pill);background:var(--navy-soft);overflow:hidden}
.pbar>i{display:block;height:100%;border-radius:var(--r-pill);background:var(--pink);transition:width .9s var(--ease)}

/* ---------- step form ---------- */
.steps{display:flex;align-items:center;gap:0;margin:0 0 22px;overflow-x:auto;padding-bottom:4px}
.step-node{display:flex;flex-direction:column;align-items:center;gap:7px;flex:0 0 auto;width:86px;text-align:center}
.step-ball{
  width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:700;
  background:var(--white);color:var(--ink-soft);border:2px solid var(--line);
  transition:all .3s var(--ease)
}
.step-node.on .step-ball{background:var(--pink);border-color:var(--pink);color:#fff;transform:scale(1.1);box-shadow:var(--sh-pink)}
.step-node.done .step-ball{background:var(--green);border-color:var(--green);color:#fff}
.step-lab{font-size:11.5px;color:var(--ink-soft);line-height:1.3}
.step-node.on .step-lab{color:var(--pink);font-weight:600}
.step-line{height:2px;background:var(--line);flex:1;min-width:14px;margin-top:-24px}
.step-line.done{background:var(--green)}

.field{margin-bottom:16px}
.field label{display:block;font-size:13.5px;font-weight:600;color:var(--navy);margin-bottom:6px}
.field .hint{font-size:12.5px;color:var(--ink-soft);font-weight:400;margin-left:6px}
.inp{
  width:100%;padding:11px 15px;border-radius:var(--r-sm);border:1.5px solid var(--line);
  background:var(--white);color:var(--ink);outline:0;transition:border-color .16s
}
.inp:focus{border-color:var(--pink)}
textarea.inp{min-height:92px;resize:vertical;line-height:1.6}

.opt-row{display:flex;gap:9px;flex-wrap:wrap}
.opt{
  border:1.5px solid var(--line);background:var(--white);border-radius:var(--r-sm);
  padding:10px 15px;font-size:14px;cursor:pointer;color:var(--ink-mid);
  transition:all .16s var(--ease)
}
.opt:hover{border-color:var(--pink-soft)}
.opt.on{background:var(--pink-mist);border-color:var(--pink);color:var(--pink);font-weight:600}

.photo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
.photo-slot{
  border:2px dashed var(--line);border-radius:18px;background:var(--white);
  padding:20px 14px;text-align:center;cursor:pointer;transition:all .18s var(--ease)
}
.photo-slot:hover{border-color:var(--pink);background:var(--pink-mist)}
.photo-slot.filled{border-style:solid;border-color:var(--green);background:var(--green-bg)}
.photo-emoji{font-size:26px}
.photo-t{font-size:13.5px;font-weight:600;color:var(--navy);margin-top:6px}
.photo-a{font-size:12px;color:var(--ink-soft);margin-top:2px}
.photo-thumb{
  height:96px;border-radius:14px;margin-bottom:9px;
  background:linear-gradient(135deg,#D7DEF2,#F2DCE6);display:grid;place-items:center;font-size:28px
}

/* ---------- conduct ---------- */
.ring-wrap{display:flex;align-items:center;gap:26px;flex-wrap:wrap}
.ring-num{font-size:38px;font-weight:700;color:var(--navy);line-height:1}
.cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:11px}
.cat{
  border:1.5px solid var(--line);background:var(--white);border-radius:18px;padding:16px 12px;
  cursor:pointer;text-align:center;transition:all .18s var(--ease)
}
.cat:hover{transform:translateY(-3px);border-color:var(--pink);box-shadow:var(--sh-1)}
.cat-e{font-size:26px}
.cat-t{font-size:13.5px;font-weight:600;color:var(--navy);margin-top:7px}

/* ---------- sheet / modal ---------- */
.scrim{
  position:fixed;inset:0;background:rgba(22,32,92,.42);backdrop-filter:blur(3px);
  z-index:60;display:flex;align-items:flex-end;justify-content:center;animation:fade .2s var(--ease)
}
@keyframes fade{from{opacity:0}to{opacity:1}}
.sheet{
  background:var(--white);width:100%;max-width:560px;border-radius:26px 26px 0 0;
  padding:0 22px 26px;max-height:86dvh;overflow-y:auto;overflow-x:hidden;
  overscroll-behavior:contain;-webkit-overflow-scrolling:touch;
  animation:rise .3s var(--ease);position:relative
}
/* หัวของ sheet ติดอยู่กับที่ เนื้อหาข้างล่างเลื่อนได้ */
.sheet-head{
  position:sticky;top:0;z-index:2;background:var(--white);
  padding:10px 0 12px;margin:0 -22px 4px;padding-left:22px;padding-right:22px
}
.sheet-head::after{
  content:'';position:absolute;left:0;right:0;bottom:-14px;height:14px;
  background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(255,255,255,0));pointer-events:none
}
.sheet-body{padding-bottom:6px}
@keyframes rise{from{transform:translateY(30px);opacity:.4}to{transform:translateY(0);opacity:1}}
.sheet-grip{width:42px;height:4px;border-radius:9px;background:var(--line);margin:6px auto 16px}
.sheet-title{font-size:18px;font-weight:700;color:var(--navy);margin:0 0 4px}
.sheet-sub{font-size:13.5px;color:var(--ink-soft);margin:0 0 18px}
@media(min-width:760px){
  .scrim{align-items:center;padding:24px}
  .sheet{border-radius:26px;max-height:84dvh;padding:0 26px 26px}
  .sheet-head{margin:0 -26px 4px;padding:20px 26px 12px}
  .sheet-grip{display:none}
}

.success-wrap{text-align:center;padding:14px 0 6px}
.check-ring{
  width:74px;height:74px;border-radius:50%;background:var(--green-bg);margin:0 auto 14px;
  display:grid;place-items:center;animation:pop .4s var(--ease)
}
.score-move{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:10px;font-size:22px;font-weight:700;color:var(--navy)}
.score-move .old{color:var(--ink-soft);text-decoration:line-through;font-size:18px}

/* ---------- charts ---------- */
.chart-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:14px}
.legend{display:flex;flex-direction:column;gap:10px}
.leg{display:flex;align-items:center;gap:9px;font-size:13.5px;color:var(--ink-mid)}
.leg b{margin-left:auto;color:var(--navy);font-weight:600}
.leg-sw{width:11px;height:11px;border-radius:4px;flex:0 0 11px}

.hbar-row{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.hbar-lab{font-size:13px;color:var(--ink-mid);flex:0 0 66px}
.hbar-track{flex:1;height:10px;border-radius:var(--r-pill);background:var(--navy-soft);overflow:hidden}
.hbar-fill{height:100%;border-radius:var(--r-pill);transition:width .8s var(--ease)}
.hbar-val{font-size:13px;font-weight:600;color:var(--navy);flex:0 0 42px;text-align:right}

.drill{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--ink-soft);margin-bottom:14px;flex-wrap:wrap}
.drill button{border:0;background:transparent;color:var(--pink);font-weight:600;cursor:pointer;padding:2px 4px;font-size:13px;border-radius:6px}
.drill button:hover{background:var(--pink-mist)}

/* ---------- case board ---------- */
.board{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;align-items:start}
.col-head{display:flex;align-items:center;gap:8px;margin-bottom:11px;padding:0 3px}
.col-head h4{margin:0;font-size:14.5px;font-weight:700;color:var(--navy)}
.col-n{font-size:12px;font-weight:700;color:var(--ink-soft);background:var(--white);padding:1px 8px;border-radius:var(--r-pill)}
.case{
  background:var(--white);border-radius:18px;padding:15px;box-shadow:var(--sh-1);margin-bottom:11px;
  cursor:pointer;border:0;text-align:left;width:100%;
  transition:transform .18s var(--ease),box-shadow .18s var(--ease)
}
.case:hover{transform:translateY(-3px);box-shadow:var(--sh-2)}
.case-t{font-weight:600;font-size:14.5px;color:var(--navy);line-height:1.3}
.case-m{font-size:12px;color:var(--ink-soft);margin-top:2px}
.case-d{font-size:13px;color:var(--ink-mid);margin-top:9px;line-height:1.5}
.case-f{display:flex;align-items:center;gap:8px;margin-top:11px;font-size:12px;color:var(--ink-soft)}

/* ---------- empty ---------- */
.empty{text-align:center;padding:44px 20px}
.empty-t{font-size:16.5px;font-weight:600;color:var(--navy);margin:14px 0 4px}
.empty-d{font-size:13.5px;color:var(--ink-soft);max-width:34ch;margin:0 auto}

/* ---------- skeleton ---------- */
.sk{background:linear-gradient(90deg,#EFE9E4 25%,#F7F2EE 50%,#EFE9E4 75%);background-size:200% 100%;animation:sh 1.3s infinite;border-radius:12px}
@keyframes sh{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* ---------- toast ---------- */
.toast{
  position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:90;
  background:var(--navy);color:#fff;padding:13px 22px;border-radius:var(--r-pill);
  font-size:14px;font-weight:500;box-shadow:var(--sh-2);display:flex;align-items:center;gap:10px;
  animation:toastin .3s var(--ease)
}
@keyframes toastin{from{opacity:0;transform:translate(-50%,16px)}to{opacity:1;transform:translate(-50%,0)}}

/* ---------- login ---------- */
.login-wrap{min-height:100vh;display:grid;place-items:center;padding:24px;position:relative;z-index:1}
.login{
  background:var(--white);border-radius:30px;box-shadow:var(--sh-2);
  width:100%;max-width:880px;display:grid;grid-template-columns:1fr 1fr;overflow:hidden
}
.login-art{
  background:linear-gradient(135deg,var(--navy),#2C3576 55%,var(--pink-deep));
  padding:38px 34px;color:#fff;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden
}
.login-art::after{content:'';position:absolute;width:280px;height:280px;border-radius:50%;background:rgba(255,255,255,.07);left:-90px;bottom:-120px}
.login-form{padding:38px 34px}
.login h1{font-size:23px;margin:0 0 4px;color:var(--navy);font-weight:700}
.login .lead{font-size:14px;color:var(--ink-mid);margin:0 0 22px}
.role-pick{display:grid;gap:9px;margin-bottom:18px}
.role{
  display:flex;align-items:center;gap:11px;border:1.5px solid var(--line);background:var(--white);
  border-radius:16px;padding:12px 14px;cursor:pointer;text-align:left;width:100%;transition:all .16s var(--ease)
}
.role:hover{border-color:var(--pink-soft)}
.role.on{border-color:var(--pink);background:var(--pink-mist)}
.role-t{font-size:14px;font-weight:600;color:var(--navy)}
.role-d{font-size:12px;color:var(--ink-soft);line-height:1.4}
.privacy{
  display:flex;gap:10px;background:var(--navy-soft);border-radius:16px;padding:13px 15px;
  font-size:12.5px;color:var(--navy);line-height:1.55;margin-top:16px
}

/* ---------- แถบสถานะสัญญาณ ---------- */
.netbar{
  display:flex;align-items:center;gap:10px;border-radius:16px;padding:11px 16px;
  font-size:13.5px;font-weight:500;margin-bottom:16px;line-height:1.5;
  animation:rise .3s var(--ease)
}
.netbar svg{flex:0 0 20px}

/* ---------- mobile ---------- */
.mobile-top{display:none}
.bottomnav{display:none}
.fab-sheet-item{
  display:flex;align-items:center;gap:13px;width:100%;border:0;background:var(--white);
  padding:14px 16px;border-radius:18px;cursor:pointer;text-align:left;margin-bottom:9px;
  box-shadow:var(--sh-1);transition:transform .16s var(--ease)
}
.fab-sheet-item:hover{transform:translateY(-2px)}
.fab-ic{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;font-size:18px;flex:0 0 38px}

@media(max-width:1180px){
  .stat-grid{grid-template-columns:repeat(2,1fr)}
  .chart-grid{grid-template-columns:1fr}
  .board{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:920px){
  .side{display:none}
  .main{padding:0 16px 104px}
  .login{grid-template-columns:1fr;max-width:440px}
  .login-art{display:none}
  .mobile-top{
    display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:40;
    background:rgba(251,246,242,.9);backdrop-filter:blur(12px);
    margin:0 -16px 14px;padding:14px 16px;border-bottom:1px solid var(--line)
  }
  .page-title{font-size:21px}
  .welcome{padding:22px;flex-direction:column;align-items:flex-start;text-align:left}
  .welcome h2{font-size:19px}
  .hero-score{margin-left:0;width:100%}
  .att-grid,.stu-grid,.face-grid{grid-template-columns:1fr}
  .board{grid-template-columns:1fr}
  .bottomnav{
    display:flex;position:fixed;left:0;right:0;bottom:0;z-index:50;
    background:rgba(255,255,255,.94);backdrop-filter:blur(14px);
    border-top:1px solid var(--line);padding:7px 6px calc(7px + env(safe-area-inset-bottom));
    justify-content:space-around;align-items:flex-end
  }
  .bn{
    border:0;background:transparent;display:flex;flex-direction:column;align-items:center;gap:3px;
    padding:5px 9px;cursor:pointer;color:var(--ink-soft);font-size:10.5px;font-weight:500;flex:1;
    transition:color .16s
  }
  .bn.on{color:var(--pink);font-weight:600}
  .bn-fab{
    width:52px;height:52px;border-radius:19px;background:var(--pink);color:#fff;
    display:grid;place-items:center;box-shadow:var(--sh-pink);margin-bottom:2px;
    border:0;cursor:pointer;transition:transform .18s var(--ease)
  }
  .bn-fab:active{transform:scale(.92) rotate(45deg)}
  .toast{bottom:88px}
}

.care{display:block;overflow:visible}
.care *{transform-box:fill-box}

/* หายใจ — ทั้งตัวขยับขึ้นลงช้า ๆ */
.care-all{transform-origin:50% 100%;animation:care-breathe 4.2s ease-in-out infinite}
@keyframes care-breathe{
  0%,100%{transform:translateY(0) scaleY(1)}
  50%{transform:translateY(-1.6px) scaleY(1.012)}
}

/* เงาใต้ตัว ขยับสวนทางกับการลอย */
.care-shadow{transform-origin:50% 50%;animation:care-shadow 4.2s ease-in-out infinite}
@keyframes care-shadow{
  0%,100%{transform:scale(1);opacity:.16}
  50%{transform:scale(.93);opacity:.11}
}

/* หัวเอียงเล็กน้อยเป็นจังหวะ ทำให้ดูมีชีวิต */
.care-head{transform-origin:50% 92%;animation:care-tilt 6.5s ease-in-out infinite}
@keyframes care-tilt{
  0%,72%,100%{transform:rotate(0deg)}
  80%{transform:rotate(-3.2deg)}
  90%{transform:rotate(2deg)}
}

/* กะพริบตา — หรี่เร็ว ๆ แล้วเว้นนาน */
.care-lid{transform-origin:50% 0%;animation:care-blink 5.4s infinite}
@keyframes care-blink{
  0%,92%,100%{transform:scaleY(0)}
  94%,96%{transform:scaleY(1)}
}

/* หัวใจด้านหลังเต้น */
.care-heart{transform-origin:50% 55%;animation:care-beat 2.6s ease-in-out infinite}
@keyframes care-beat{
  0%,100%{transform:scale(1)}
  12%{transform:scale(1.055)}
  24%{transform:scale(1)}
  36%{transform:scale(1.03)}
  48%{transform:scale(1)}
}

/* แขนโบก ใช้ตอนดีใจ/สำเร็จ */
.care-wave{transform-origin:18% 12%;animation:care-wave 1.5s ease-in-out infinite}
@keyframes care-wave{
  0%,100%{transform:rotate(0deg)}
  25%{transform:rotate(-26deg)}
  50%{transform:rotate(-8deg)}
  75%{transform:rotate(-26deg)}
}

/* แว่นขยายส่ายไปมาตอนค้นหา */
.care-lens{transform-origin:26% 26%;animation:care-scan 2.8s ease-in-out infinite}
@keyframes care-scan{
  0%,100%{transform:rotate(-11deg) translateY(0)}
  50%{transform:rotate(13deg) translateY(-3px)}
}

/* ป้ายเตือนสั่น */
.care-alert{transform-origin:50% 50%;animation:care-shake 2.4s ease-in-out infinite}
@keyframes care-shake{
  0%,62%,100%{transform:translateX(0) rotate(0)}
  68%{transform:translateX(-2px) rotate(-6deg)}
  74%{transform:translateX(2px) rotate(6deg)}
  80%{transform:translateX(-1px) rotate(-3deg)}
  86%{transform:translateX(0) rotate(0)}
}

/* ประกายดาว */
.care-spark{transform-origin:50% 50%;animation:care-spark 2.2s ease-in-out infinite}
.care-spark-2{animation-delay:.75s}
@keyframes care-spark{
  0%,100%{transform:scale(.4) rotate(0deg);opacity:0}
  40%{transform:scale(1) rotate(28deg);opacity:1}
  70%{transform:scale(.75) rotate(48deg);opacity:.5}
}

/* จุดสามจุดตอนรอ */
.care-dot{animation:care-dot 1.5s ease-in-out infinite}
.care-dot-2{animation-delay:.2s}
.care-dot-3{animation-delay:.4s}
@keyframes care-dot{
  0%,100%{opacity:.3;transform:translateY(0)}
  40%{opacity:1;transform:translateY(-3px)}
}

/* เครื่องหมายถูกวาดตัวเองตอนสำเร็จ */
.care-check{stroke-dasharray:34;stroke-dashoffset:34;animation:care-draw .55s .15s ease-out forwards}
@keyframes care-draw{to{stroke-dashoffset:0}}

/* ตอบสนองการกดของผู้ใช้ */
.care-tap{cursor:pointer;transition:transform .18s cubic-bezier(.22,.68,.36,1)}
.care-tap:active{transform:scale(.94)}

@media(prefers-reduced-motion:reduce){
  .care *{animation:none !important}
}

@media(prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;transition-duration:.01ms !important}
}

/* ==========================================================================
   ส่วนที่ต้องเติมกลับ  บล็อกเหล่านี้หายไปตอนแก้ไฟล์รอบก่อน
   ========================================================================== */

/* ---------- พื้นหลังมีลายจุดจาง ๆ ---------- */
.bg-deco::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(22,32,92,.055) 1px, transparent 1px);
  background-size:22px 22px;
  mask-image:radial-gradient(ellipse 90% 70% at 50% 0%, #000 35%, transparent 78%);
  -webkit-mask-image:radial-gradient(ellipse 90% 70% at 50% 0%, #000 35%, transparent 78%);
}
.blob-c{width:300px;height:300px;background:#FFE6D2;top:38%;right:6%;opacity:.42}

/* ---------- การ์ดไล่กันเข้ามาทีละใบ ---------- */
.stagger>*{animation:card-in .46s var(--ease) both}
.stagger>*:nth-child(1){animation-delay:.02s}
.stagger>*:nth-child(2){animation-delay:.07s}
.stagger>*:nth-child(3){animation-delay:.12s}
.stagger>*:nth-child(4){animation-delay:.17s}
.stagger>*:nth-child(5){animation-delay:.22s}
.stagger>*:nth-child(6){animation-delay:.27s}
.stagger>*:nth-child(7){animation-delay:.31s}
.stagger>*:nth-child(8){animation-delay:.35s}
.stagger>*:nth-child(n+9){animation-delay:.38s}
@keyframes card-in{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}

.page-enter{animation:page-in .34s var(--ease) both}
@keyframes page-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

.stat:active,.stu:active,.face:active,.att:active,.case:active{transform:scale(.985)}

.welcome::before{
  content:'';position:absolute;top:-60%;left:-40%;width:45%;height:220%;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.13),transparent);
  transform:rotate(14deg);animation:sweep 7s ease-in-out infinite
}
@keyframes sweep{0%,62%{left:-45%}88%,100%{left:125%}}

.sec-title::before{
  content:'';width:4px;height:19px;border-radius:4px;flex:0 0 4px;
  background:linear-gradient(180deg,var(--pink),var(--navy))
}
.stat-ic{position:relative}
.stat::after{
  content:'';position:absolute;right:-26px;bottom:-26px;width:84px;height:84px;
  border-radius:50%;background:var(--navy-soft);opacity:.5;transition:transform .3s var(--ease)
}
.stat:hover::after{transform:scale(1.28)}
.stat>*{position:relative;z-index:1}
.wave{display:block;width:100%;height:22px;margin-top:-12px;margin-bottom:10px}
.stat-num,.ring-num,.hero-name{font-variant-numeric:tabular-nums}

.confetti{position:fixed;inset:0;pointer-events:none;z-index:95;overflow:hidden}
.confetti i{position:absolute;top:-14px;width:9px;height:14px;border-radius:2px;
  animation:fall 2.4s cubic-bezier(.3,.7,.5,1) forwards}
@keyframes fall{
  0%{opacity:0;transform:translateY(-10px) rotate(0)}
  12%{opacity:1}
  100%{opacity:0;transform:translateY(102vh) rotate(680deg)}
}

.c360 *::-webkit-scrollbar{width:10px;height:10px}
.c360 *::-webkit-scrollbar-thumb{background:#E3DAD3;border-radius:9px;border:3px solid var(--cream)}
.c360 *::-webkit-scrollbar-thumb:hover{background:#D3C7BE}

/* ---------- น้อง CARE พูด ---------- */
.bubble-wrap{
  position:fixed;right:24px;bottom:24px;z-index:80;display:flex;align-items:flex-end;gap:10px;
  animation:bub-in .38s var(--ease);max-width:min(400px,calc(100vw - 40px))
}
@keyframes bub-in{
  0%{opacity:0;transform:translateY(18px) scale(.92)}
  60%{transform:translateY(-3px) scale(1.02)}
  100%{opacity:1;transform:translateY(0) scale(1)}
}
.bubble{
  background:var(--white);border-radius:20px 20px 6px 20px;padding:14px 18px;
  box-shadow:var(--sh-2);font-size:14px;line-height:1.6;color:var(--ink);position:relative;
  border:1.5px solid var(--pink-soft);flex:1;min-width:0
}
.bubble b{color:var(--navy);display:block;font-size:14.5px;margin-bottom:2px}
.bubble-x{
  position:absolute;top:-9px;right:-9px;width:24px;height:24px;border-radius:50%;
  background:var(--navy);color:#fff;border:0;cursor:pointer;display:grid;place-items:center;
  font-size:13px;line-height:1;box-shadow:var(--sh-1)
}
.bubble-act{margin-top:10px;display:flex;gap:7px}

/* ---------- เช็คชื่อ ---------- */
.roll{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}
.roll-row{
  background:var(--white);border-radius:18px;padding:12px 14px;box-shadow:var(--sh-1);
  display:flex;align-items:center;gap:11px
}
.roll-no{
  width:30px;height:30px;flex:0 0 30px;border-radius:10px;background:var(--navy-soft);
  color:var(--navy);font-size:12.5px;font-weight:700;display:grid;place-items:center
}
.roll-name{flex:1;min-width:0;font-size:14.5px;font-weight:500;color:var(--navy)}
.roll-btns{display:flex;gap:4px}
.roll-b{
  width:34px;height:34px;border-radius:11px;border:1.5px solid var(--line);background:var(--white);
  font-size:12px;font-weight:600;color:var(--ink-soft);cursor:pointer;
  transition:all .14s var(--ease);display:grid;place-items:center
}
.roll-b:active{transform:scale(.9)}
.roll-b.on{color:#fff;border-color:transparent}
.roll-sum{
  display:flex;gap:9px;flex-wrap:wrap;position:sticky;top:0;z-index:20;
  background:rgba(251,246,242,.92);backdrop-filter:blur(10px);padding:12px 0;margin-bottom:6px
}

/* ---------- แถบ 5 ขั้นตอน ---------- */
.steps5{display:flex;gap:8px;flex-wrap:wrap}
.step5{
  flex:1;min-width:132px;border:1.5px solid var(--line);background:var(--white);
  border-radius:16px;padding:12px 13px;text-align:left;cursor:pointer;
  transition:all .18s var(--ease);position:relative
}
.step5:hover{border-color:var(--pink-soft);transform:translateY(-2px)}
.step5.done{background:var(--green-bg);border-color:transparent}
.step5-n{
  width:24px;height:24px;border-radius:8px;display:grid;place-items:center;
  font-size:12px;font-weight:700;background:var(--navy-soft);color:var(--navy);margin-bottom:8px
}
.step5.done .step5-n{background:var(--green);color:#fff}
.step5-t{font-size:13.5px;font-weight:600;color:var(--navy);line-height:1.35}
.step5-d{font-size:11.5px;color:var(--ink-soft);margin-top:3px;line-height:1.45}

/* ---------- รูปนักเรียน ---------- */
.stu-photo{object-fit:cover;background:var(--navy-soft)}
.photo-pick{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}

/* ---------- แถบติดตามการส่งต่อ ---------- */
.track{background:var(--white);border-radius:var(--r-card);padding:18px;box-shadow:var(--sh-1);margin-bottom:12px}
.track-head{display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap}
.track-dot{width:10px;height:10px;border-radius:50%;flex:0 0 10px}
.track-line{
  display:flex;flex-direction:row;align-items:flex-start;
  overflow-x:auto;padding-bottom:6px;margin:0 -4px
}
.tnode{
  flex:1 1 0;min-width:98px;text-align:center;position:relative;padding:0 4px;
  display:flex;flex-direction:column;align-items:center
}
.tnode-ball{
  width:30px;height:30px;flex:0 0 30px;border-radius:50%;margin:0 auto 7px;
  display:grid;place-items:center;font-size:12.5px;font-weight:700;
  background:var(--white);border:2px solid var(--line);color:var(--ink-soft);
  position:relative;z-index:1;transition:all .3s var(--ease)
}
.tnode.done .tnode-ball{background:var(--green);border-color:var(--green);color:#fff}
.tnode.now .tnode-ball{background:var(--pink);border-color:var(--pink);color:#fff;transform:scale(1.12);box-shadow:var(--sh-pink)}
.tnode::before{content:'';position:absolute;top:15px;left:-50%;width:100%;height:2px;background:var(--line);z-index:0}
.tnode:first-child::before{display:none}
.tnode.done::before,.tnode.now::before{background:var(--green)}
.tnode-l{font-size:11.5px;color:var(--ink-soft);line-height:1.35}
.tnode.now .tnode-l{color:var(--pink);font-weight:600}
.tnode.done .tnode-l{color:var(--navy)}

/* ---------- หน้าจอล็อกและกล่องแจ้งข้อผิดพลาด ---------- */
.lock{
  position:fixed;inset:0;z-index:200;display:grid;place-items:center;padding:24px;
  background:rgba(251,246,242,.86);backdrop-filter:blur(22px) saturate(.6);
  animation:fade .25s var(--ease)
}
.lock-card{
  background:var(--white);border-radius:26px;box-shadow:var(--sh-2);
  padding:30px 28px;max-width:380px;width:100%;text-align:center
}
.crash{
  max-width:520px;margin:60px auto;background:var(--white);border-radius:26px;
  box-shadow:var(--sh-2);padding:32px 30px;text-align:center
}
.crash pre{
  text-align:left;background:var(--cream);border-radius:14px;padding:12px 14px;
  font-size:12px;color:var(--ink-mid);overflow:auto;max-height:170px;margin-top:16px;
  white-space:pre-wrap;word-break:break-word
}

/* ---------- แบบฟอร์มราชการ ---------- */
.a4{
  background:#fff;border-radius:10px;box-shadow:var(--sh-1);
  padding:30px 34px;max-width:860px;margin:0 auto;color:#000;font-size:14px;line-height:1.65
}
.a4-head{text-align:center;margin-bottom:20px}
.a4-head h2{margin:0;font-size:17px;font-weight:700}
.a4-head p{margin:3px 0 0;font-size:14px}
.a4 table{width:100%;border-collapse:collapse;margin-top:14px;font-size:13.5px}
.a4 th,.a4 td{border:1px solid #666;padding:6px 8px;vertical-align:top}
.a4 th{background:#F1F1F1;font-weight:600;text-align:center}
.a4 td.c{text-align:center}
.a4-sign{display:flex;justify-content:space-around;gap:20px;margin-top:46px;text-align:center;font-size:13.5px}
.a4-sign div{flex:1}
.a4-sign .line{margin-bottom:6px}
.a4-note{font-size:12.5px;color:#444;margin-top:16px}

@media(max-width:920px){
  .bubble-wrap{right:14px;left:14px;bottom:86px;max-width:none}
  .bg-deco::before{background-size:18px 18px}
}
@media(max-width:640px){
  .track-line{gap:6px}
  .tnode{min-width:84px}
  .tnode-l{font-size:10.5px}
}

@media print{
  @page{size:A4;margin:16mm 14mm}
  .side,.bottomnav,.netbar,.mobile-top,.btn,.chips,.bg-deco,.bubble-wrap,.confetti{display:none !important}
  .c360{background:#fff}
  .main{padding:0}
  .a4{box-shadow:none;border-radius:0;padding:0;max-width:none}
  .card,.stat{box-shadow:none;border:1px solid #DDD;break-inside:avoid}
  .welcome,.hero{background:#fff !important;color:#000 !important;border:1px solid #DDD}
  .welcome h2,.hero-name{color:#000 !important}
}

@media(prefers-reduced-motion:reduce){
  .stagger>*,.page-enter,.welcome::before,.confetti i,.bubble-wrap{animation:none !important}
}

`;

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const LEVELS = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const ROOMS = {
  "ม.1": 6, "ม.2": 6, "ม.3": 6, "ม.4": 5, "ม.5": 5, "ม.6": 5,
};

const TH_FIRST = ["พีรพัฒน์","ณัฐวุฒิ","ศิรประภา","กันยารัตน์","ธนกฤต","พิมพ์ชนก","อธิป","ชลธิชา","วรินทร","ภูริช","สุพิชญา","กิตติภพ","อารยา","ณิชาภัทร","ปัณณวิชญ์","เมธาวี","จิรายุ","ธัญชนก","ศุภกร","กชกร","รัฐภูมิ","พรนภา","อนุชิต","วิภาวี","ปรเมศวร์","ณัฏฐณิชา","ธีรเดช","สิริกร","ก้องภพ","นภสร"];
const TH_LAST = ["จารุพันธ์","ศรีวิชัย","ธรรมลังกา","ใจดี","วงศ์คำ","แก้วมณี","อินต๊ะวงค์","สุขสวัสดิ์","ปัญญาดี","มาลัยทอง","เขื่อนแก้ว","ทองอินทร์","ฟูเต็มวงค์","ชัยวรรณ","บุญเรือง","สมศักดิ์","พรหมมา","ตันติวงศ์","ใจเย็น","ก๋องแก้ว"];

const TEACHERS = [
  { id: "t1", name: "นางสาวเกตุฤดี ราชไชยา", rooms: ["ม.1/1"] },
  { id: "t2", name: "นายสมชาย ปัญญาวงค์", rooms: ["ม.1/2"] },
  { id: "t3", name: "นางสุนีย์ อินต๊ะวงค์", rooms: ["ม.2/1"] },
  { id: "t4", name: "นายวีระพงษ์ ธรรมใจ", rooms: ["ม.3/2"] },
  { id: "t5", name: "นางสาวพิมพ์ใจ ศรีวิชัย", rooms: ["ม.4/1"] },
  { id: "t6", name: "นายอานนท์ บุญมา", rooms: ["ม.5/2"] },
  { id: "t7", name: "นางกัลยา แก้วมณี", rooms: ["ม.6/1"] },
];

const STATUS = {
  normal: { key: "normal", label: "ปกติ", cls: "b-green", color: "var(--green)", bg: "var(--green-bg)" },
  watch: { key: "watch", label: "ควรติดตาม", cls: "b-yellow", color: "var(--yellow)", bg: "var(--yellow-bg)" },
  help: { key: "help", label: "ต้องดำเนินการ", cls: "b-orange", color: "var(--orange)", bg: "var(--orange-bg)" },
  urgent: { key: "urgent", label: "เร่งด่วน", cls: "b-red", color: "var(--red)", bg: "var(--red-bg)" },
};

// เครื่องสุ่มแบบกำหนด seed เพื่อให้ข้อมูลจำลองคงที่ทุกครั้งที่เปิด
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

function buildStudents() {
  const rnd = seeded(20260911);
  const out = [];
  let n = 0;
  LEVELS.forEach((lv) => {
    for (let r = 1; r <= ROOMS[lv]; r++) {
      const room = `${lv}/${r}`;
      const teacher = TEACHERS.find((t) => t.rooms.includes(room))?.name || "ยังไม่ระบุครูที่ปรึกษา";
      const size = 21 + Math.floor(rnd() * 4);
      for (let i = 1; i <= size; i++) {
        n++;
        const p = rnd();
        const status = p > 0.965 ? "urgent" : p > 0.9 ? "help" : p > 0.77 ? "watch" : "normal";
        const score = status === "urgent" ? 58 + Math.floor(rnd() * 12)
          : status === "help" ? 70 + Math.floor(rnd() * 12)
          : status === "watch" ? 82 + Math.floor(rnd() * 10)
          : 92 + Math.floor(rnd() * 9);
        out.push({
          id: `s${n}`,
          no: i,
          first: TH_FIRST[Math.floor(rnd() * TH_FIRST.length)],
          last: TH_LAST[Math.floor(rnd() * TH_LAST.length)],
          level: lv,
          room,
          teacher,
          status,
          score: Math.min(100, score),
          visited: rnd() > 0.14,
          risk: rnd(),
        });
      }
    }
  });
  return out;
}

const STUDENTS = buildStudents();
const nameOf = (s) => `${s.first} ${s.last}`;
const initialOf = (s) => s.first.slice(0, 1);

// รายละเอียดเชิงลึกใส่ให้เฉพาะนักเรียนตัวอย่าง ที่เหลือใช้ค่าเริ่มต้น
const DEEP = {
  s1: {
    nickname: "ต้นกล้า",
    birth: "14 มีนาคม 2555",
    blood: "O",
    talents: ["วงโยธวาทิต", "วาดภาพ"],
    dream: "อยากเป็นสถาปนิก",
    family: {
      live: "อยู่กับยาย",
      father: "ทำงานต่างจังหวัด ติดต่อได้เดือนละครั้ง",
      mother: "ทำงานโรงงาน จ.ลำพูน",
      siblings: "น้องชาย 1 คน เรียน ป.4",
      income: "รายได้ครัวเรือนไม่แน่นอน",
    },
    home: { type: "บ้านไม้ชั้นเดียว", own: "บ้านของยาย", light: "มีไฟฟ้า", net: "ใช้เน็ตมือถือ" },
    travel: { how: "จักรยาน", minutes: 25, cost: "ไม่มีค่าเดินทาง" },
    study: { gpa: 2.78, absent: 4, late: 6, weak: ["คณิตศาสตร์", "ภาษาอังกฤษ"] },
  },
};

const DEFAULT_DEEP = {
  nickname: "-",
  birth: "-",
  blood: "-",
  talents: ["ยังไม่บันทึก"],
  dream: "ยังไม่บันทึก",
  family: { live: "อยู่กับบิดามารดา", father: "รับจ้างทั่วไป", mother: "ค้าขาย", siblings: "-", income: "พอเพียง" },
  home: { type: "บ้านปูนชั้นเดียว", own: "บ้านของตนเอง", light: "มีไฟฟ้า", net: "มีอินเทอร์เน็ตบ้าน" },
  travel: { how: "รถรับส่ง", minutes: 20, cost: "40 บาท/วัน" },
  study: { gpa: 3.12, absent: 1, late: 2, weak: [] },
};
const deepOf = (id) => DEEP[id] || DEFAULT_DEEP;

const ATTENTION_SEED = [
  {
    id: "a1", sid: "s1", level: "urgent",
    reason: "มีรายการพฤติกรรมซ้ำ 3 ครั้งใน 7 วัน และคะแนนความประพฤติลดลง 12 คะแนน",
    action: "เปิด Case ช่วยเหลือ",
  },
  {
    id: "a2", sid: "s30", level: "watch",
    reason: "เยี่ยมบ้านแล้วพบประเด็นที่ควรติดตาม ผ่านมา 5 วันยังไม่มีบันทึกการติดตาม",
    action: "บันทึกการติดตาม",
  },
  {
    id: "a3", sid: "s58", level: "help",
    reason: "ขาดเรียนติดต่อกัน 3 วัน ยังไม่ได้รับการติดต่อจากผู้ปกครอง",
    action: "ติดต่อผู้ปกครอง",
  },
  {
    id: "a4", sid: "s92", level: "watch",
    reason: "ผลการคัดกรองอยู่กลุ่มเสี่ยงด้านเศรษฐกิจ ยังไม่ได้เสนอขอทุน",
    action: "เสนอขอทุน",
  },
  {
    id: "a5", sid: "s140", level: "help",
    reason: "ยังไม่มีข้อมูลการเยี่ยมบ้านของภาคเรียนนี้ และเป็นนักเรียนกลุ่มติดตาม",
    action: "นัดหมายเยี่ยมบ้าน",
  },
  {
    id: "a6", sid: "s205", level: "urgent",
    reason: "ครูที่ปรึกษาแจ้งพบสัญญาณด้านอารมณ์ ควรส่งต่อครูแนะแนวภายในวันนี้",
    action: "ส่งต่อครูแนะแนว",
  },
];

const CASES_SEED = [
  { id: "c1", sid: "s1", title: "ภาระค่าใช้จ่ายในครอบครัว", type: "เศรษฐกิจ", stage: "helping", owner: "นางสาวเกตุฤดี ราชไชยา", updated: "วันนี้", note: "ยื่นเรื่องขอทุนปัจจัยพื้นฐานแล้ว รอผลพิจารณา", prio: "urgent" },
  { id: "c2", sid: "s30", title: "มาโรงเรียนสายต่อเนื่อง", type: "การมาเรียน", stage: "watching", owner: "นายสมชาย ปัญญาวงค์", updated: "2 วันก่อน", note: "ตกลงกับผู้ปกครองเรื่องการเดินทางแล้ว", prio: "watch" },
  { id: "c3", sid: "s58", title: "ผลการเรียนลดลง 2 ภาคเรียน", type: "การเรียน", stage: "watching", owner: "นางสุนีย์ อินต๊ะวงค์", updated: "3 วันก่อน", note: "จัดสอนเสริมคณิตศาสตร์สัปดาห์ละ 2 ครั้ง", prio: "help" },
  { id: "c4", sid: "s92", title: "ขอทุนการศึกษารายเดือน", type: "เศรษฐกิจ", stage: "new", owner: "นายวีระพงษ์ ธรรมใจ", updated: "วันนี้", note: "รอเอกสารรับรองรายได้จากผู้ปกครอง", prio: "watch" },
  { id: "c5", sid: "s140", title: "ปรับพฤติกรรมการใช้โทรศัพท์", type: "พฤติกรรม", stage: "helping", owner: "นางสาวพิมพ์ใจ ศรีวิชัย", updated: "เมื่อวาน", note: "ทำข้อตกลงร่วมกับผู้ปกครองเป็นลายลักษณ์อักษร", prio: "help" },
  { id: "c6", sid: "s205", title: "ความเครียดจากการเรียน", type: "สุขภาพจิต", stage: "referred", owner: "นายอานนท์ บุญมา", updated: "เมื่อวาน", note: "ส่งต่อครูแนะแนว นัดพบครั้งแรกวันศุกร์", prio: "urgent" },
  { id: "c7", sid: "s250", title: "ค่าเดินทางมาโรงเรียน", type: "เศรษฐกิจ", stage: "closed", owner: "นางกัลยา แก้วมณี", updated: "สัปดาห์ก่อน", note: "ได้รับทุนค่าพาหนะแล้ว ติดตามผลอีก 1 เดือน", prio: "normal" },
  { id: "c8", sid: "s300", title: "ปรับตัวกับเพื่อนในห้อง", type: "พฤติกรรม", stage: "closed", owner: "นางสาวเกตุฤดี ราชไชยา", updated: "สัปดาห์ก่อน", note: "เข้ากลุ่มกิจกรรมแล้ว สถานการณ์ดีขึ้น", prio: "normal" },
];

const CASE_STAGES = [
  { key: "new", label: "รอดำเนินการ", color: "var(--blue)" },
  { key: "watching", label: "กำลังติดตาม", color: "var(--yellow)" },
  { key: "helping", label: "กำลังช่วยเหลือ", color: "var(--orange)" },
  { key: "referred", label: "ส่งต่อแล้ว", color: "var(--pink)" },
  { key: "closed", label: "ยุติแล้ว", color: "var(--green)" },
];

// ระเบียบว่าด้วยคะแนนความประพฤติของโรงเรียน ข้อ 18 (ตัดคะแนน) และ ข้อ 19 (เพิ่มคะแนน)
// ถ้าต่อฐานข้อมูลแล้ว ระบบจะโหลดจากตาราง care360_conduct_rules แทนชุดนี้
const CONDUCT_CATS = [
  { key: "dis_time", emoji: "⏰", label: "วินัยและการตรงต่อเวลา", items: [
    { code: "1101", label: "มาสาย (มาถึงโรงเรียนหลังเวลา 08.00 น.)", action: "ตักเตือน", min: 5, max: 5 },
    { code: "1102", label: "ไม่เข้าแถวเคารพธงชาติ หรือไม่เข้าร่วมกิจกรรมตามที่โรงเรียนกำหนด", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 10, max: 10 },
    { code: "1103", label: "ขาดเรียนโดยไม่แจ้งสาเหตุ", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 5, max: 5 },
    { code: "1104", label: "หนีเรียน / ออกนอกบริเวณโรงเรียนโดยไม่ได้รับอนุญาต", action: "แจ้งผู้ปกครอง", min: 20, max: 20 },
    { code: "1105", label: "ไม่ตั้งใจเรียน นอนหลับ หรือก่อกวนในห้องเรียน", action: "ตักเตือน", min: 5, max: 5 },
    { code: "1106", label: "ออกจากห้องเรียนขณะครูสอนโดยไม่ได้รับอนุญาต", action: "ตักเตือน", min: 10, max: 10 },
    { code: "1107", label: "ใช้อุปกรณ์อิเล็กทรอนิกส์ส่วนตัวในเวลาเรียนโดยไม่ได้รับอนุญาต", action: "ตักเตือน", min: 5, max: 5 },
  ] },
  { key: "dis_honest", emoji: "📖", label: "ความซื่อสัตย์ทางวิชาการ", items: [
    { code: "1121", label: "คัดลอกผลงาน/การบ้านของผู้อื่น หรือให้ผู้อื่นคัดลอก", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 20, max: 20 },
    { code: "1122", label: "ใช้ปัญญาประดิษฐ์ (AI) สร้างผลงานและส่งเป็นของตนเอง โดยไม่ได้รับอนุญาต", action: "แจ้งผู้ปกครอง / ทำทัณฑ์บน", min: 30, max: 30 },
    { code: "1123", label: "ร่วมมือกับผู้อื่นในลักษณะทุจริตผ่านช่องทางดิจิทัลในงานที่กำหนดให้ทำรายบุคคล", action: "แจ้งผู้ปกครอง / ทำทัณฑ์บน", min: 40, max: 40 },
    { code: "1124", label: "การจ้างวาน หรือใช้บุคคลอื่นทำผลงานทางวิชาการให้ และนำมาส่งเป็นของตนเอง", action: "แจ้งผู้ปกครอง / ทำทัณฑ์บน", min: 50, max: 50 },
    { code: "1125", label: "ทุจริตในการสอบ", action: "แจ้งผู้ปกครอง / ทำทัณฑ์บน", min: 50, max: 50 },
  ] },
  { key: "dis_dress", emoji: "👔", label: "เครื่องแบบการแต่งกาย", items: [
    { code: "2101", label: "แต่งกายผิดระเบียบหรือไม่ครบถ้วน (ไม่ปักชื่อ ไม่ประดับเข็มพระเกี้ยว จุดบอกระดับชั้น)", action: "ตักเตือน / ให้แก้ไข", min: 5, max: 5 },
    { code: "2102", label: "ดัดแปลงเครื่องแบบนักเรียนให้ผิดไปจากเดิม", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 10, max: 10 },
    { code: "2103", label: "สวมใส่ถุงเท้า/รองเท้าผิดระเบียบ หรือสวมรองเท้าแตะมาโรงเรียนโดยไม่มีเหตุอันควร", action: "ตักเตือน / ให้แก้ไข", min: 5, max: 5 },
    { code: "2104", label: "นักเรียนหญิงไม่สวมเสื้อบังทรงหรือเสื้อซับในให้เรียบร้อย", action: "ตักเตือน / ให้แก้ไข", min: 10, max: 10 },
    { code: "2105", label: "ปล่อยชายเสื้อออกนอกกางเกง/กระโปรง ในลักษณะไม่เรียบร้อย", action: "ตักเตือน / ให้แก้ไข", min: 5, max: 5 },
    { code: "2106", label: "นำชุดนักเรียนหรือชุดพละของผู้อื่นมาสวมใส่", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 10, max: 10 },
    { code: "2107", label: "ไม่แต่งกายตามกิจกรรมที่โรงเรียนกำหนด", action: "ตักเตือน", min: 5, max: 5 },
    { code: "2108", label: "แต่งชุดพลศึกษาในวันที่ไม่มีเรียนพลศึกษา", action: "ตักเตือน", min: 5, max: 5 },
    { code: "2109", label: "แต่งกายด้วยชุดไปรเวทในลักษณะไม่สุภาพ", action: "ตักเตือน / ให้แก้ไข", min: 10, max: 10 },
  ] },
  { key: "dis_hair", emoji: "✂️", label: "ทรงผมและการตกแต่งร่างกาย", items: [
    { code: "2201", label: "ทรงผมผิดระเบียบของโรงเรียน", action: "ตักเตือน / ให้แก้ไข", min: 10, max: 10 },
    { code: "2202", label: "ย้อมสีผม/ดัดผม/ต่อผม หรือตัดแต่งทรงผมเป็นลวดลาย", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 30, max: 30 },
    { code: "2203", label: "แต่งหน้าจัด/ทาเล็บ/ต่อเล็บ หรือใช้เครื่องสำอางสีสันฉูดฉาด", action: "ตักเตือน / ให้แก้ไข", min: 10, max: 10 },
    { code: "2204", label: "ใส่คอนแทคเลนส์สีเพื่อความสวยงาม", action: "ตักเตือน / ให้ถอดออก", min: 5, max: 5 },
    { code: "2205", label: "ใส่เครื่องประดับที่นอกเหนือจากที่ได้รับอนุญาต", action: "ตักเตือน / ยึดเก็บ", min: 5, max: 5 },
    { code: "2206", label: "เจาะอวัยวะบนร่างกายที่มองเห็นได้ชัดเจน หรือมีรอยสักนอกร่มผ้า", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 15, max: 15 },
  ] },
  { key: "dis_check", emoji: "🔍", label: "การให้ความร่วมมือในการตรวจระเบียบ", items: [
    { code: "2301", label: "หลีกเลี่ยง หรือปฏิเสธการตรวจระเบียบจากครู", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 20, max: 20 },
    { code: "2302", label: "ได้รับการตักเตือนแล้วไม่แก้ไข หรือกระทำผิดเรื่องเดิมซ้ำ", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 20, max: 20 },
    { code: "2303", label: "แสดงกิริยาวาจาไม่สุภาพ หรือโต้เถียงกับครูผู้ตรวจระเบียบ", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 30, max: 30 },
  ] },
  { key: "dis_violence", emoji: "🤝", label: "ความขัดแย้งและความรุนแรง", items: [
    { code: "3101", label: "กล่าวคำหยาบคาย พูดส่อเสียด ดูหมิ่นผู้อื่น", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 10, max: 10 },
    { code: "3102", label: "กลั่นแกล้ง ข่มขู่ หรือล้อเลียนผู้อื่นจนได้รับความอับอาย (Bullying)", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 20, max: 20 },
    { code: "3103", label: "ทะเลาะวิวาทกันโดยไม่มีอาวุธ", action: "แจ้งผู้ปกครอง / ทำทัณฑ์บน", min: 30, max: 30 },
    { code: "3104", label: "ชักชวนบุคคลภายนอกเข้ามาก่อเหตุทะเลาะวิวาท", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 40, max: 40 },
    { code: "3105", label: "ทำร้ายร่างกายผู้อื่นจนได้รับบาดเจ็บ", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 50, max: 50, severe: true },
    { code: "3106", label: "พกพาอาวุธ หรือสิ่งที่ใช้เป็นอาวุธได้มาโรงเรียน", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 80, max: 80, severe: true },
  ] },
  { key: "dis_drug", emoji: "🚭", label: "สิ่งเสพติดและอบายมุข", items: [
    { code: "3201", label: "เข้าไปในสถานที่ไม่เหมาะสมกับสภาพนักเรียน", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 10, max: 10 },
    { code: "3202", label: "สูบบุหรี่ หรือดื่มเครื่องดื่มที่มีแอลกอฮอล์", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 30, max: 30 },
    { code: "3203", label: "เล่นการพนัน รวมถึงการพนันออนไลน์", action: "แจ้งผู้ปกครอง / ทำทัณฑ์บน", min: 30, max: 30 },
    { code: "3204", label: "เสพ มีไว้ในครอบครอง หรือจำหน่ายบุหรี่ไฟฟ้าและอุปกรณ์ที่เกี่ยวข้อง", action: "ดูมาตรการข้อ 18.5", min: 60, max: 60, severe: true },
    { code: "3205", label: "เกี่ยวข้องกับยาเสพติด (เสพหรือมีไว้ในครอบครอง)", action: "ดูมาตรการข้อ 18.5", min: 100, max: 100, severe: true },
  ] },
  { key: "dis_property", emoji: "💰", label: "ความซื่อสัตย์และทรัพย์สิน", items: [
    { code: "3301", label: "ปลอมแปลงเอกสาร หรือลายมือชื่อผู้ปกครอง/ครู", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 20, max: 20 },
    { code: "3302", label: "ฉ้อโกง หรือหลอกลวงผู้อื่นเพื่อให้ได้มาซึ่งทรัพย์สิน", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 40, max: 40 },
    { code: "3303", label: "ลักทรัพย์ หรือกรรโชกทรัพย์", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 40, max: 40 },
    { code: "3304", label: "ทำลายทรัพย์สินของโรงเรียนหรือของผู้อื่น", action: "ตักเตือน / ชดใช้ค่าเสียหาย", min: 20, max: 20 },
    { code: "3305", label: "ยืมทรัพย์สินของผู้อื่นแล้วไม่นำมาคืน", action: "ตักเตือน / เชิญผู้ปกครอง", min: 10, max: 10 },
    { code: "3306", label: "นำบุคคลอื่นมาแอบอ้างเป็นผู้ปกครอง", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 30, max: 30 },
  ] },
  { key: "dis_media", emoji: "📱", label: "พฤติกรรมทางเพศและสื่อดิจิทัล", items: [
    { code: "3401", label: "แสดงพฤติกรรมทางชู้สาวอันไม่เหมาะสมในที่สาธารณะ", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 30, max: 30 },
    { code: "3402", label: "มีสื่อลามกอนาจารไว้ในครอบครองหรือเผยแพร่", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 30, max: 30 },
    { code: "3403", label: "ใช้สื่อสังคมออนไลน์ก่อความเสียหายต่อผู้อื่นหรือโรงเรียน (Cyberbullying)", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 50, max: 50 },
    { code: "3404", label: "บันทึกภาพหรือวิดีโอของบุคคลอื่นโดยไม่ได้รับอนุญาต และ/หรือนำไปเผยแพร่", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 50, max: 50 },
  ] },
  { key: "dis_respect", emoji: "🙏", label: "การดูหมิ่นและการไม่ให้ความเคารพ", items: [
    { code: "3501", label: "แสดงกิริยาวาจาไม่สุภาพต่อผู้อื่น", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 10, max: 10 },
    { code: "3502", label: "แสดงกิริยาก้าวร้าว หรือไม่ให้ความเคารพต่อครู/บุคลากรของโรงเรียน", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 30, max: 30 },
  ] },
  { key: "dis_reputation", emoji: "🏫", label: "การกระทำที่เสื่อมเสียชื่อเสียงโรงเรียน", items: [
    { code: "3601", label: "ปีนรั้ว หรือเข้า-ออกโรงเรียนในทางที่ไม่ได้รับอนุญาต", action: "ตักเตือน / เชิญผู้ปกครอง", min: 20, max: 20 },
    { code: "3602", label: "แต่งชุดนักเรียนไปในสถานที่ไม่เหมาะสม หรือไปนอกบ้านในชุดนักเรียนแต่ไม่มาโรงเรียน", action: "ตักเตือน / เชิญผู้ปกครอง", min: 20, max: 20 },
    { code: "3603", label: "ถูกเจ้าหน้าที่ตำรวจจับกุมในคดีที่สร้างความเสื่อมเสีย", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 50, max: 50 },
    { code: "3604", label: "นำบุคคลภายนอกเข้ามาในบริเวณโรงเรียนโดยไม่ได้รับอนุญาต", action: "ตักเตือน / เชิญผู้ปกครอง", min: 20, max: 20 },
    { code: "3605", label: "ก่อเหตุอันทำให้เกิดการร้องเรียนต่อโรงเรียน", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 50, max: 50 },
  ] },
  { key: "dis_nation", emoji: "🇹🇭", label: "การเคารพต่อสถาบันหลักของชาติ", items: [
    { code: "3701", label: "แสดงกิริยาวาจาที่ไม่เหมาะสมต่อสถาบันชาติ ศาสนา และพระมหากษัตริย์", action: "ตักเตือน / ทำกิจกรรม", min: 10, max: 10 },
    { code: "3702", label: "นำสัญลักษณ์สำคัญของชาติไปใช้ในทางที่ไม่เหมาะสม", action: "ตักเตือน / แจ้งผู้ปกครอง", min: 15, max: 15 },
    { code: "3703", label: "สร้างหรือเผยแพร่ข้อมูลอันเป็นเท็จ บิดเบือน หรือสร้างความเกลียดชังต่อสถาบันหลักของชาติในสื่อออนไลน์", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 40, max: 40 },
  ] },
  { key: "dis_clean", emoji: "🧹", label: "ความสะอาดและสิ่งแวดล้อม", items: [
    { code: "4101", label: "ทิ้งขยะไม่เป็นที่ หรือทำความสกปรกในบริเวณโรงเรียน", action: "ตักเตือน", min: 5, max: 5 },
    { code: "4102", label: "นำอาหารหรือเครื่องดื่มขึ้นไปบนอาคารเรียน", action: "ตักเตือน", min: 5, max: 5 },
    { code: "4103", label: "ไม่คัดแยกขยะทิ้งในภาชนะตามที่โรงเรียนกำหนด", action: "ตักเตือน", min: 5, max: 5 },
    { code: "4104", label: "สั่งอาหารจากบริการเดลิเวอรีภายนอกเข้ามารับประทานในโรงเรียน", action: "ตักเตือน / ยึดอาหาร", min: 5, max: 5 },
    { code: "4105", label: "ซื้อสินค้าหรืออาหารจากผู้จำหน่ายบริเวณริมรั้วโรงเรียน", action: "ตักเตือน", min: 20, max: 20 },
  ] },
  { key: "dis_order", emoji: "🪑", label: "ความเป็นระเบียบและทรัพย์สินส่วนรวม", items: [
    { code: "4201", label: "สวมรองเท้าขึ้นบนอาคารเรียน", action: "ตักเตือน", min: 5, max: 5 },
    { code: "4202", label: "ไม่ปฏิบัติหน้าที่เวรทำความสะอาดตามที่ได้รับมอบหมาย", action: "ตักเตือน", min: 5, max: 5 },
    { code: "4203", label: "ขีดเขียนโต๊ะ เก้าอี้ ฝาผนัง หรือทำลายทรัพย์สินส่วนรวม", action: "ตักเตือน / ชดใช้ค่าเสียหาย", min: 10, max: 10 },
    { code: "4204", label: "ส่งเสียงดังรบกวนผู้อื่นในเขตที่ต้องการความสงบ", action: "ตักเตือน", min: 5, max: 5 },
    { code: "4205", label: "ไม่ปิดไฟ พัดลม หรือเครื่องปรับอากาศหลังใช้งาน", action: "ตักเตือน", min: 5, max: 5 },
  ] },
  { key: "dis_digital", emoji: "💻", label: "ความเป็นระเบียบในยุคดิจิทัลและอื่น ๆ", items: [
    { code: "4301", label: "นำยานพาหนะส่วนตัวเข้ามาในโรงเรียนโดยไม่ได้รับอนุญาต หรือจอดในที่ห้ามจอด", action: "ตักเตือน / เชิญผู้ปกครอง", min: 15, max: 15 },
    { code: "4302", label: "ไม่พกบัตรประจำตัวนักเรียน หรือไม่แสดงตนเมื่อครูขอตรวจ", action: "ตักเตือน", min: 5, max: 5 },
    { code: "4303", label: "ใช้เครือข่ายอินเทอร์เน็ตของโรงเรียนเพื่อการพนัน สื่อลามกอนาจาร หรือกิจกรรมผิดกฎหมาย", action: "เชิญผู้ปกครอง / ทำทัณฑ์บน", min: 40, max: 40 },
    { code: "4304", label: "ส่งข้อความไม่เกี่ยวข้อง สแปม หรือสร้างความวุ่นวายในกลุ่มสื่อสารออนไลน์ของโรงเรียน", action: "ตักเตือน", min: 10, max: 10 },
  ] },
];

const MERIT_CATS = [
  { key: "mer_self", emoji: "🎯", label: "ความรับผิดชอบต่อตนเอง", items: [
    { code: "6101", label: "มีผลการเรียนเฉลี่ยอยู่ในระดับดี (3.00 ขึ้นไป) ต่อภาคเรียน", min: 10, max: 20 },
    { code: "6102", label: "มีสถิติการมาเรียนดีเยี่ยมและไม่เคยถูกตัดคะแนนตลอดภาคเรียน", min: 15, max: 15 },
    { code: "6103", label: "บรรลุเป้าหมายการพัฒนาตนเองที่ตั้งไว้กับครูที่ปรึกษาอย่างเป็นรูปธรรม", min: 15, max: 15 },
    { code: "6104", label: "สำเร็จหลักสูตรหรือได้รับการรับรองทักษะดิจิทัล/วิชาชีพจากหน่วยงานภายนอก", min: 20, max: 20 },
  ] },
  { key: "mer_volunteer", emoji: "💗", label: "จิตอาสาและการช่วยเหลือสังคม", items: [
    { code: "6201", label: "มีจิตอาสาช่วยเหลืองานของโรงเรียนหรือกิจกรรมสาธารณประโยชน์", min: 5, max: 10 },
    { code: "6202", label: "เก็บสิ่งของมีค่าได้และนำส่งคืนเจ้าของหรือแจ้งครู", min: 5, max: 15 },
    { code: "6203", label: "แจ้งเบาะแสการกระทำผิดหรือพฤติกรรมที่ไม่เหมาะสม", min: 10, max: 10 },
    { code: "6204", label: "ห้ามปราม หรือช่วยไกล่เกลี่ยเหตุทะเลาะวิวาท", min: 15, max: 15 },
    { code: "6205", label: "เป็นแกนนำในกิจกรรมด้านสิ่งแวดล้อมหรือการพัฒนาที่ยั่งยืน", min: 20, max: 20 },
    { code: "6206", label: "มีส่วนร่วมส่งเสริมสุขภาวะทางจิต หรือเป็นแกนนำให้คำปรึกษาเพื่อน", min: 15, max: 15 },
    { code: "6207", label: "การบริจาคโลหิต", min: 20, max: 20 },
    { code: "6208", label: "เป็นแกนนำกิจกรรมส่งเสริมความเป็นพลเมืองดิจิทัล", min: 20, max: 20 },
    { code: "6209", label: "ริเริ่มโครงงานนวัตกรรมเพื่อสังคมที่สร้างผลกระทบเชิงบวก", min: 25, max: 25 },
    { code: "6210", label: "เป็นแกนนำจัดกิจกรรมส่งเสริมความเท่าเทียมและความหลากหลายในโรงเรียน", min: 15, max: 15 },
  ] },
  { key: "mer_fame", emoji: "🏆", label: "การสร้างชื่อเสียงและการมีส่วนร่วม", items: [
    { code: "6301.1", label: "สร้างชื่อเสียงจากการแข่งขัน ระดับจังหวัด / เขตพื้นที่การศึกษา", min: 20, max: 20 },
    { code: "6301.2", label: "สร้างชื่อเสียงจากการแข่งขัน ระดับภาค / ระดับชาติ", min: 30, max: 40 },
    { code: "6301.3", label: "สร้างชื่อเสียงจากการแข่งขัน ระดับนานาชาติ", min: 50, max: 50 },
    { code: "6302", label: "ได้รับคัดเลือกให้นำเสนอผลงานวิชาการในเวทีระดับจังหวัดขึ้นไป", min: 25, max: 25 },
    { code: "6303", label: "สร้างชื่อเสียงให้โรงเรียนจากการทำความดีจนเป็นที่ประจักษ์ต่อสาธารณะ", min: 40, max: 40 },
    { code: "6304", label: "เป็นคณะกรรมการนักเรียน หรือผู้นำในกิจกรรมของโรงเรียน", min: 10, max: 20 },
    { code: "6305", label: "เข้าร่วมโครงการสอนเสริมหรือเป็นติวเตอร์ให้เพื่อนหรือรุ่นน้องที่โรงเรียนรับรอง", min: 15, max: 15 },
    { code: "6306", label: "เป็นตัวแทนเยาวชนระดับจังหวัดหรือชาติ หรือกิจกรรมแลกเปลี่ยนในนามโรงเรียน", min: 20, max: 20 },
  ] },
  { key: "mer_innov", emoji: "💡", label: "นวัตกรรมและความคิดสร้างสรรค์ในยุคดิจิทัล", items: [
    { code: "6401", label: "พัฒนาซอฟต์แวร์ แอปพลิเคชัน หรือเว็บไซต์ ที่ใช้งานได้จริงและเป็นประโยชน์ต่อส่วนรวม", min: 25, max: 25 },
    { code: "6402", label: "สร้างสรรค์สื่อดิจิทัลคุณภาพสูงที่ได้รับการเผยแพร่หรือรับรางวัล", min: 20, max: 20 },
    { code: "6403", label: "เป็นตัวแทนและสร้างชื่อเสียงจากการแข่งขัน E-Sports ระดับจังหวัดขึ้นไป", min: 15, max: 25 },
    { code: "6404", label: "เข้าร่วมหรือได้รับรางวัลด้านนวัตกรรม เทคโนโลยี หรือประกวดแผนธุรกิจ", min: 20, max: 30 },
  ] },
];

// ผลของการตัดคะแนนสะสม ตามข้อ 21
const CONDUCT_THRESHOLDS = [
  { at: 20, action: "แจ้งครูที่ปรึกษาและผู้ปกครองเป็นลายลักษณ์อักษร" },
  { at: 40, action: "เชิญผู้ปกครองพบครูที่ปรึกษาและหัวหน้างานกิจการนักเรียน" },
  { at: 60, action: "เชิญผู้ปกครองพบรองผู้อำนวยการกลุ่มบริหารกิจการนักเรียน ทำทัณฑ์บน และเข้ากิจกรรมปรับพฤติกรรม" },
  { at: 80, action: "เชิญผู้ปกครองพบผู้อำนวยการสถานศึกษา อาจปรับเปลี่ยนรูปแบบการเรียนชั่วคราว" },
  { at: 100, action: "เชิญผู้ปกครองพบผู้อำนวยการ เพื่อรับทราบผลการพิจารณาให้ย้ายสถานศึกษา" },
];

// เกณฑ์ใบรับรองความประพฤติ ตามข้อ 23 ใช้คะแนนที่ถูกตัดสะสมตลอดช่วงชั้น
function certGrade(deducted) {
  if (deducted === 0) return { label: "ดีเยี่ยม", cls: "b-green" };
  if (deducted <= 20) return { label: "ดีมาก", cls: "b-green" };
  if (deducted <= 40) return { label: "ดี", cls: "b-blue" };
  if (deducted <= 60) return { label: "ปานกลาง", cls: "b-yellow" };
  return { label: "ไม่ผ่านเกณฑ์", cls: "b-red" };
}

const HV_STEPS = ["ข้อมูลครอบครัว", "สภาพที่อยู่อาศัย", "การเดินทาง/เศรษฐกิจ", "สิ่งที่ครูพบ", "ภาพเยี่ยมบ้าน", "สรุปและส่ง"];

const ROLES = [
  { key: "advisor", name: "นางสาวเกตุฤดี ราชไชยา", title: "ครูที่ปรึกษา", scope: "เห็นเฉพาะนักเรียน ม.1/1 ที่รับผิดชอบ", rooms: ["ม.1/1"] },
  { key: "head", name: "นายอานนท์ บุญมา", title: "หัวหน้าระดับชั้น ม.1", scope: "เห็นนักเรียนทั้งระดับชั้น ม.1", levels: ["ม.1"] },
  { key: "admin", name: "นายปฐมพงษ์ ธรรมลังกา", title: "รองผู้อำนวยการ กลุ่มกิจการนักเรียน", scope: "เห็นข้อมูลนักเรียนทั้งโรงเรียน", all: true },
];

/* ==========================================================================
   DATA LAYER
   App.jsx รู้จักแค่ window.storage ที่ storage-shim.js เตรียมไว้ให้
   ถ้ายังไม่ได้ต่อ Supabase (เช่นเปิดเป็นต้นแบบ) จะใช้ข้อมูลจำลองด้านบนแทน
   ========================================================================== */

const LIVE = typeof window !== "undefined" && !!window.__care360_ready;
const OFFLINE = typeof window !== "undefined" && !!window.offline;

// สถานะสัญญาณและจำนวนรายการที่รอส่ง มาจาก src/offline.js
function useNet() {
  const [st, setSt] = useState({ online: true, pending: 0, syncing: false });
  useEffect(() => {
    if (!OFFLINE) return;
    return window.offline.subscribe(setSt);
  }, []);
  return st;
}

// แทนที่ข้อมูลในอาร์เรย์เดิมทั้งชุด เพื่อให้ทุกจุดที่ทำ .find() ยังชี้ข้อมูลชุดเดียวกัน
function replaceAll(arr, rows) {
  arr.length = 0;
  rows.forEach((r) => arr.push(r));
}

async function loadAll() {
  const [me, students, attention, cases] = await Promise.all([
    window.storage.get("me"),
    window.storage.get("students"),
    window.storage.get("attention"),
    window.storage.get("cases"),
  ]);
  if (students?.value) replaceAll(STUDENTS, students.value);
  if (attention?.value) replaceAll(ATTENTION_SEED, attention.value);
  return { me: me?.value || null, cases: cases?.value || [] };
}

// เขียนกลับฐานข้อมูล ถ้ายังไม่ต่อ Supabase ให้เงียบ ๆ ผ่านไป
async function save(key, value) {
  if (!LIVE) return null;
  try { return await window.storage.set(key, value); }
  catch (e) { console.error("[care360] save", key, e); return null; }
}

/* ==========================================================================
   ICONS — เส้นเดียวกันทั้งระบบ stroke 1.8 ปลายมน
   ========================================================================== */

const Ic = ({ d, size = 20, fill = "none", cls = "" }) => (
  <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const I = {
  home: <Ic d={<><path d="M3 10.5 12 3l9 7.5" /><path d="M5.5 9.5V20h13V9.5" /><path d="M9.5 20v-5h5v5" /></>} />,
  users: <Ic d={<><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.2 2.7-5.2 6-5.2s6 2 6 5.2" /><path d="M16 5.3a3.2 3.2 0 0 1 0 5.7" /><path d="M18 14.4c2 .8 3 2.4 3 4.6" /></>} />,
  heart: <Ic d={<path d="M12 20s-7-4.3-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.7 12 20 12 20Z" />} />,
  star: <Ic d={<path d="m12 3.8 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7.9-5.6-4-3.9 5.6-.8Z" />} />,
  house: <Ic d={<><path d="M4 11 12 4.5 20 11" /><path d="M6 10.2V20h12v-9.8" /><path d="M10 20v-4.5h4V20" /></>} />,
  search: <Ic d={<><circle cx="11" cy="11" r="6.2" /><path d="m16 16 4 4" /></>} />,
  hands: <Ic d={<><path d="M8 13 5.6 10.6a2 2 0 0 1 2.8-2.8L12 11.4l3.6-3.6a2 2 0 0 1 2.8 2.8L16 13" /><path d="M4 15.5c2.6 3 5.3 4.5 8 4.5s5.4-1.5 8-4.5" /></>} />,
  bell: <Ic d={<><path d="M18 15.5V10a6 6 0 1 0-12 0v5.5L4.5 18h15Z" /><path d="M10 20.5a2.2 2.2 0 0 0 4 0" /></>} />,
  chart: <Ic d={<><path d="M4 20V4" /><path d="M4 20h16" /><path d="M8 20v-6" /><path d="M13 20V9" /><path d="M18 20v-9.5" /></>} />,
  gear: <Ic d={<><circle cx="12" cy="12" r="3" /><path d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M18 6l-1.4 1.4M7.4 16.6 6 18M18 18l-1.4-1.4M7.4 7.4 6 6" /></>} />,
  plus: <Ic d={<><path d="M12 6v12M6 12h12" /></>} />,
  minus: <Ic d={<path d="M6 12h12" />} />,
  check: <Ic d={<path d="m5 12.5 4.5 4.5L19 7.5" />} />,
  arrow: <Ic d={<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>} />,
  back: <Ic d={<><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>} />,
  clock: <Ic d={<><circle cx="12" cy="12" r="8.2" /><path d="M12 7.6V12l3 1.8" /></>} />,
  shield: <Ic d={<><path d="M12 3.5 5.5 6v6c0 4 2.8 6.9 6.5 8.5 3.7-1.6 6.5-4.5 6.5-8.5V6Z" /><path d="m9.4 12 1.9 1.9 3.5-3.6" /></>} />,
  camera: <Ic d={<><path d="M4 8.5h3l1.4-2h7.2L17 8.5h3v11H4Z" /><circle cx="12" cy="13.5" r="3.2" /></>} />,
  doc: <Ic d={<><path d="M6 3.5h7l5 5v12H6Z" /><path d="M13 3.5v5h5" /><path d="M9 13h6M9 16.5h4" /></>} />,
  logout: <Ic d={<><path d="M10 4.5H5.5v15H10" /><path d="M15 8.5 19 12l-4 3.5" /><path d="M19 12H9.5" /></>} />,
  menu: <Ic d={<><path d="M4 7h16M4 12h16M4 17h16" /></>} />,
  info: <Ic d={<><circle cx="12" cy="12" r="8.2" /><path d="M12 11v5.5M12 8.2v.6" /></>} />,
  phone: <Ic d={<path d="M6.5 4h3l1.4 3.5-2 1.4a11 11 0 0 0 5.2 5.2l1.4-2L19 13.5v3a2 2 0 0 1-2.2 2A13.5 13.5 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z" />} />,
  pin: <Ic d={<><path d="M12 21c4-4.6 6-7.7 6-10.3A6 6 0 1 0 6 10.7C6 13.3 8 16.4 12 21Z" /><circle cx="12" cy="10.5" r="2.2" /></>} />,
};

/* ==========================================================================
   MASCOT — น้อง CARE (SVG original, เคลื่อนไหวได้)
   หัวใจโอบอยู่ด้านหลัง = การดูแลและอยู่ข้างนักเรียน
   หายใจ กะพริบตา เอียงหัว และมองตามเมาส์ ปิดเองเมื่อเครื่องตั้ง reduce motion
   ========================================================================== */

/* --------------------------------------------------------------------------
 * ปากแต่ละอารมณ์
 * ------------------------------------------------------------------------ */
const MOUTH = {
  idle:     "M 46 74 Q 60 84 74 74",
  search:   "M 49 75 Q 60 82 71 75",
  alert:    "M 50 78 Q 60 71 70 78",
  happy:    "M 44 71 Q 60 88 76 71",
  success:  "M 44 71 Q 60 88 76 71",
  tracking: "M 49 75 Q 60 80 71 75",
  empty:    "M 50 78 Q 60 74 70 78",
  waiting:  "M 51 76 L 69 76",
};

const EYE_OPEN = { idle: 5.6, search: 5.6, alert: 6.6, happy: 2.2, success: 2.2, tracking: 5.6, empty: 4.4, waiting: 5.2 };

/* --------------------------------------------------------------------------
 * Care — มาสคอตประจำระบบ
 *   mood : idle | search | alert | happy | success | tracking | empty | waiting
 *   look : ให้ตาเหลือบตามเมาส์ (ปิดได้ด้วย look={false})
 *   onClick : ถ้าใส่มา จะกดได้และมีฟีดแบ็กตอนกด
 * ------------------------------------------------------------------------ */
function Care({ mood = "idle", size = 120, look = true, onClick, style }) {
  const ref = useRef(null);
  const [p, setP] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!look) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.42;
        const dx = (e.clientX - cx) / Math.max(r.width, 1);
        const dy = (e.clientY - cy) / Math.max(r.height, 1);
        const m = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, m) / m;
        setP({ x: Math.max(-1, Math.min(1, dx * k)) * 2.6, y: Math.max(-1, Math.min(1, dy * k)) * 2.1 });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); if (raf) cancelAnimationFrame(raf); };
  }, [look]);

  // ตอนติดตาม ให้ตากวาดซ้ายขวาเองแทนการตามเมาส์
  const [scan, setScan] = useState(0);
  useEffect(() => {
    if (mood !== "tracking") return;
    let i = 0;
    const t = setInterval(() => { i = (i + 1) % 4; setScan([-2.4, 0, 2.4, 0][i]); }, 700);
    return () => clearInterval(t);
  }, [mood]);

  const ex = mood === "tracking" ? scan : p.x;
  const ey = mood === "tracking" ? 0 : p.y;
  const ry = EYE_OPEN[mood] ?? 5.6;
  const waving = mood === "happy" || mood === "success";
  const uid = useRef(`c${Math.random().toString(36).slice(2, 8)}`).current;

  return (
    <svg ref={ref} className={`care${onClick ? " care-tap" : ""}`} width={size} height={size}
      viewBox="0 0 120 126" fill="none" onClick={onClick} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}h`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF5C99" /><stop offset="55%" stopColor="#E01B6E" /><stop offset="100%" stopColor="#B3114F" />
        </linearGradient>
        <linearGradient id={`${uid}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B3480" /><stop offset="100%" stopColor="#141D52" />
        </linearGradient>
        <radialGradient id={`${uid}f`} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#FFFFFF" /><stop offset="100%" stopColor="#FFEAF2" />
        </radialGradient>
        <linearGradient id={`${uid}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF8FB8" /><stop offset="100%" stopColor="#E01B6E" />
        </linearGradient>
      </defs>

      {/* เงา */}
      <ellipse className="care-shadow" cx="60" cy="117" rx="27" ry="5.4" fill="#16205C" opacity=".16" />

      <g className="care-all">
        {/* หัวใจที่โอบอยู่ด้านหลัง */}
        <g className="care-heart">
          <path d="M60 100C37 85 17 70 17 50.5 17 38.6 26.4 30 37 30c8.2 0 14.3 4.7 23 14.4C68.7 34.7 74.8 30 83 30c10.6 0 20 8.6 20 20.5C103 70 83 85 60 100Z"
            fill={`url(#${uid}h)`} />
          <path d="M37 36c-6.2 0-11.4 4.6-12.3 10.6" stroke="#fff" strokeOpacity=".42" strokeWidth="3.4" strokeLinecap="round" />
        </g>

        {/* แขน */}
        <path d="M33 74c-5 2-8 6-8.5 11" stroke={`url(#${uid}b)`} strokeWidth="7.5" strokeLinecap="round" />
        <g className={waving ? "care-wave" : undefined}>
          <path d="M87 74c5 2 8 6 8.5 11" stroke={`url(#${uid}b)`} strokeWidth="7.5" strokeLinecap="round" />
        </g>

        {/* ลำตัว */}
        <path d="M38 70h44v18c0 7.2-5.8 13-13 13H51c-7.2 0-13-5.8-13-13Z" fill={`url(#${uid}b)`} />
        {/* ปกเสื้อสีชมพู บอกความเป็นแบรนด์โดยไม่ต้องติดโลโก้ */}
        <path d="M48 70h24l-6 9h-12Z" fill={`url(#${uid}s)`} />
        <circle cx="60" cy="88" r="3.4" fill="#FF8FB8" opacity=".9" />

        <g className="care-head">
          {/* หัว */}
          <ellipse cx="60" cy="57" rx="28" ry="26.5" fill={`url(#${uid}f)`} stroke="#16205C" strokeWidth="3.2" />
          {/* ผม */}
          <path d="M32.5 53.5C33.8 39 45.4 29 60 29s26.2 10 27.5 24.5c-6.6-8.2-16-12.6-27.5-12.6s-20.9 4.4-27.5 12.6Z" fill="#16205C" />
          <path d="M60 29c7.4 0 14.1 2.6 19.2 7" stroke="#3B4696" strokeWidth="3" strokeLinecap="round" opacity=".8" />
          {/* ไฮไลต์บนหน้าผาก ทำให้หัวดูมีปริมาตร */}
          <ellipse cx="47" cy="48" rx="8.5" ry="5" fill="#fff" opacity=".55" />

          {/* ตา */}
          <g>
            <ellipse cx={49.5 + ex} cy={57 + ey} rx="4.4" ry={ry} fill="#16205C" />
            <ellipse cx={70.5 + ex} cy={57 + ey} rx="4.4" ry={ry} fill="#16205C" />
            {ry > 3 && (
              <>
                <circle cx={51 + ex} cy={54.5 + ey} r="1.6" fill="#fff" opacity=".9" />
                <circle cx={72 + ex} cy={54.5 + ey} r="1.6" fill="#fff" opacity=".9" />
              </>
            )}
            {/* เปลือกตาสำหรับกะพริบ */}
            <rect className="care-lid" x="44" y={50} width="11" height="14" rx="5" fill="#FFEAF2" />
            <rect className="care-lid" x="65" y={50} width="11" height="14" rx="5" fill="#FFEAF2" style={{ animationDelay: ".08s" }} />
          </g>

          {/* แก้ม */}
          <ellipse cx="40" cy="66" rx="5" ry="3.6" fill="#FFA9C8" opacity=".85" />
          <ellipse cx="80" cy="66" rx="5" ry="3.6" fill="#FFA9C8" opacity=".85" />

          {/* ปาก */}
          <path d={MOUTH[mood] || MOUTH.idle} stroke="#16205C" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </g>

        {/* ของประกอบตามอารมณ์ */}
        {mood === "search" && (
          <g className="care-lens">
            <circle cx="96" cy="34" r="11" stroke="#16205C" strokeWidth="4" fill="#EAF0FF" fillOpacity=".75" />
            <path d="M88 30a8 8 0 0 1 6-5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            <path d="m104 42 8 8" stroke="#16205C" strokeWidth="4.4" strokeLinecap="round" />
          </g>
        )}

        {mood === "alert" && (
          <g className="care-alert">
            <circle cx="96" cy="30" r="12" fill="#E0692F" />
            <path d="M96 24v7.5M96 35.6v.7" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
          </g>
        )}

        {(mood === "happy" || mood === "success") && (
          <g fill="#FFC93C">
            <path className="care-spark" d="m99 26 2.2 5 5 2.2-5 2.2-2.2 5-2.2-5-5-2.2 5-2.2Z" />
            <path className="care-spark care-spark-2" d="m19 40 1.6 3.6 3.6 1.6-3.6 1.6L19 50.4l-1.6-3.6L13.8 45l3.6-1.6Z" />
          </g>
        )}

        {mood === "success" && (
          <g>
            <circle cx="96" cy="92" r="13" fill="#2E9E6B" />
            <path className="care-check" d="m90 92 4.2 4.4L103 88" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {mood === "waiting" && (
          <g fill="#16205C">
            <circle className="care-dot" cx="93" cy="34" r="3.1" />
            <circle className="care-dot care-dot-2" cx="102" cy="34" r="3.1" />
            <circle className="care-dot care-dot-3" cx="111" cy="34" r="3.1" />
          </g>
        )}

        {mood === "empty" && (
          <g stroke="#C9CEE3" strokeWidth="3.6" strokeLinecap="round">
            <path d="M90 30h22M90 38h15" />
          </g>
        )}

        {mood === "tracking" && (
          <g>
            <circle cx="97" cy="36" r="10" stroke="#E01B6E" strokeWidth="3.4" fill="#FFF0F6" />
            <path d="M97 30.5V36l3.6 2.4" stroke="#E01B6E" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
}

/* ==========================================================================
   SHARED SMALL COMPONENTS
   ========================================================================== */

function CountUp({ to, dur = 900, suffix = "" }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    let raf, t0;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / dur);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, dur]);
  return <>{v.toLocaleString("th-TH")}{suffix}</>;
}

function Ring({ value, max = 100, size = 132, stroke = 13, color = "var(--pink)", label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [dash, setDash] = useState(c);
  useEffect(() => {
    const t = setTimeout(() => setDash(c - (Math.min(value, max) / max) * c), 90);
    return () => clearTimeout(t);
  }, [value, max, c]);
  return (
    <div style={{ position: "relative", width: size, height: size, flex: `0 0 ${size}px` }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--navy-soft)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={dash}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,.68,.36,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div className="ring-num">{value}</div>
          {label && <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{label}</div>}
        </div>
      </div>
    </div>
  );
}

function Donut({ data, size = 172, label = "นักเรียน" }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = size / 2 - 16, cx = size / 2, cy = size / 2, sw = 26;
  let acc = 0;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: `0 0 ${size}px` }}>
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} stroke="var(--navy-soft)" strokeWidth={sw} fill="none" />
      {data.map((d, i) => {
        const len = (d.value / total) * c;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} stroke={d.color} strokeWidth={sw} fill="none"
            strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-acc}
            style={{ transition: "stroke-dasharray .9s cubic-bezier(.22,.68,.36,1)" }} />
        );
        acc += len;
        return el;
      })}
    </svg>
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
      <div>
        <div className="ring-num" style={{ fontSize: size * 0.2 }}>{total.toLocaleString("th-TH")}</div>
        <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{label}</div>
      </div>
    </div>
    </div>
  );
}

function HBars({ rows }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div>
      {rows.map((r) => (
        <div className="hbar-row" key={r.label}>
          <span className="hbar-lab">{r.label}</span>
          <span className="hbar-track"><i className="hbar-fill" style={{ width: `${(r.value / max) * 100}%`, background: r.color || "var(--pink)" }} /></span>
          <span className="hbar-val">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ series, labels, height = 180 }) {
  const w = 560, pad = 26;
  const all = series.flatMap((s) => s.points);
  const max = Math.max(...all) * 1.15 || 1;
  const x = (i, n) => pad + (i / (n - 1)) * (w - pad * 2);
  const y = (v) => height - pad - (v / max) * (height - pad * 2);
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", height: "auto" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={pad} x2={w - pad} y1={pad + g * (height - pad * 2)} y2={pad + g * (height - pad * 2)}
          stroke="var(--line)" strokeWidth="1" />
      ))}
      {series.map((s, si) => {
        const n = s.points.length;
        const d = s.points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i, n)} ${y(p)}`).join(" ");
        return (
          <g key={si}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            {s.points.map((p, i) => <circle key={i} cx={x(i, n)} cy={y(p)} r="3.6" fill="#fff" stroke={s.color} strokeWidth="2.4" />)}
          </g>
        );
      })}
      {labels.map((l, i) => (
        <text key={l} x={x(i, labels.length)} y={height - 7} textAnchor="middle"
          fontSize="11" fill="var(--ink-soft)" fontFamily="inherit">{l}</text>
      ))}
    </svg>
  );
}

function Spark({ points, color = "var(--pink)" }) {
  const w = 90, h = 28, max = Math.max(...points) || 1, min = Math.min(...points);
  const rng = max - min || 1;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * w} ${h - ((p - min) / rng) * (h - 4) - 2}`).join(" ");
  return <svg width={w} height={h}><path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" /></svg>;
}

function Badge({ status }) {
  const s = STATUS[status];
  return <span className={`badge ${s.cls}`}><i className="dot" />{s.label}</span>;
}

function Confetti({ on }) {
  const bits = useMemo(() => {
    const colors = ["#E01B6E", "#16205C", "#FFC93C", "#2E9E6B", "#FF8FB8", "#3A6FD9"];
    return Array.from({ length: 46 }, (_, i) => ({
      left: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.5,
      dur: 1.9 + Math.random() * 0.9,
      w: 6 + Math.random() * 6,
    }));
  }, [on]);
  if (!on) return null;
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return null;
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <i key={i} style={{
          left: `${b.left}%`, background: b.color, width: b.w,
          animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s`,
        }} />
      ))}
    </div>
  );
}

// เส้นคลื่นคั่นใต้การ์ดต้อนรับ ทำให้หน้าไม่ดูเป็นกล่องสี่เหลี่ยมเรียงกันล้วน ๆ
function Wave() {
  return (
    <svg className="wave" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 22c120-18 240-18 360 0s240 18 360 0 240-18 360 0 120 12 120 12V40H0Z"
        fill="var(--cream)" />
    </svg>
  );
}

function CareBubble({ bub, onClose, onAct }) {
  useEffect(() => {
    if (!bub || bub.sticky) return;
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [bub, onClose]);
  if (!bub) return null;
  return (
    <div className="bubble-wrap" role="status">
      <div className="bubble">
        <button className="bubble-x" onClick={onClose} aria-label="ปิด">×</button>
        <b>น้อง CARE</b>
        {bub.text}
        {bub.action && (
          <div className="bubble-act">
            <button className="btn btn-primary btn-sm" onClick={() => { onAct(bub.action.to); onClose(); }}>
              {bub.action.label}
            </button>
          </div>
        )}
      </div>
      <Care mood={bub.mood || "happy"} size={78} look={false} />
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return <div className="toast">{I.check}{msg}</div>;
}

function Sheet({ open, onClose, title, sub, children }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="sheet-head">
          <div className="sheet-grip" />
          {title && <h3 className="sheet-title">{title}</h3>}
          {sub && <p className="sheet-sub" style={{ margin: 0 }}>{sub}</p>}
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

function Empty({ mood = "empty", title, desc, action }) {
  return (
    <div className="empty">
      <Care mood={mood} size={104} />
      <div className="empty-t">{title}</div>
      <p className="empty-d">{desc}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

function Skeleton() {
  return (
    <div>
      <div className="sk" style={{ height: 128, borderRadius: 26, marginBottom: 18 }} />
      <div className="stat-grid stagger">
        {[0, 1, 2, 3].map((i) => <div key={i} className="sk" style={{ height: 132, borderRadius: 22 }} />)}
      </div>
      <div className="att-grid stagger">
        {[0, 1, 2].map((i) => <div key={i} className="sk" style={{ height: 196, borderRadius: 22 }} />)}
      </div>
    </div>
  );
}

/* ==========================================================================
   PAGE — DASHBOARD (ภาพรวม)
   ========================================================================== */

function AttentionCard({ a, student, onOpen, onDone, done }) {
  const s = STATUS[a.level];
  return (
    <article className={`att${done ? " done" : ""}`} style={{ "--c": s.color }}>
      <div className="att-top">
        <div className="att-ava">{initialOf(student)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="att-name">{nameOf(student)}</div>
          <div className="att-meta">{student.room} · เลขที่ {student.no}</div>
        </div>
        <Badge status={a.level} />
      </div>
      <p className="att-reason">{a.reason}</p>
      <div className="att-teacher">{I.users}ครูที่ปรึกษา {student.teacher}</div>
      {done ? (
        <div className="att-done-msg">{I.check} บันทึกการติดตามแล้ว</div>
      ) : (
        <div className="att-acts">
          <button className="btn btn-sm" onClick={() => onOpen(student)}>ดูข้อมูล</button>
          <button className="btn btn-primary btn-sm" onClick={() => onDone(a)}>{a.action}</button>
        </div>
      )}
    </article>
  );
}

function Dashboard({ scope, role, attention, doneIds, onDone, goto, openStudent }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 620); return () => clearTimeout(t); }, []);

  const total = scope.length;
  const visited = scope.filter((s) => s.visited).length;
  const visitPct = Math.round((visited / (total || 1)) * 100);
  const watch = scope.filter((s) => s.status === "watch").length;
  const activeCases = CASES_SEED.filter((c) => c.stage !== "closed" && scope.some((s) => s.id === c.sid)).length;

  const open = attention.filter((a) => !doneIds.includes(a.id));
  const finished = open.length === 0;

  if (loading) return <Skeleton />;

  return (
    <>
      <section className="welcome">
        <div className="welcome-text">
          <h2>สวัสดี {role.title} 👋</h2>
          <p>
            {finished
              ? "น้อง CARE ตรวจให้แล้ว วันนี้ไม่มีรายการที่ต้องดำเนินการเร่งด่วน"
              : `น้อง CARE พบนักเรียน ${open.length} คนที่ควรดูแลวันนี้ เริ่มจากรายการเร่งด่วนก่อนได้เลย`}
          </p>
          <button className="welcome-cta" onClick={() => goto("today")}>
            {finished ? "ดูรายการทั้งหมด" : "ดูรายการที่ต้องติดตาม"} {I.arrow}
          </button>
        </div>
        <div className="welcome-mascot"><Care mood={finished ? "success" : "search"} size={124} /></div>
      </section>
      <Wave />

      <div className="stat-grid stagger">
        <button className="stat" onClick={() => goto("students")}>
          <div className="stat-ic" style={{ background: "var(--navy-soft)", color: "var(--navy)" }}>{I.users}</div>
          <div className="stat-num"><CountUp to={total} /> <small>คน</small></div>
          <div className="stat-lab">นักเรียนในความดูแล</div>
          <div className="stat-trend">{I.shield} {role.scope}</div>
        </button>

        <button className="stat" onClick={() => goto("homevisit")}>
          <div className="stat-ic" style={{ background: "var(--green-bg)", color: "var(--green)" }}>{I.house}</div>
          <div className="stat-num"><CountUp to={visitPct} suffix="%" /></div>
          <div className="stat-lab">เยี่ยมบ้านแล้ว {visited} คน</div>
          <div style={{ marginTop: 10 }} className="pbar"><i style={{ width: `${visitPct}%`, background: "var(--green)" }} /></div>
        </button>

        <button className="stat" onClick={() => goto("today")}>
          <div className="stat-ic" style={{ background: "var(--yellow-bg)", color: "var(--yellow)" }}>{I.bell}</div>
          <div className="stat-num"><CountUp to={watch} /> <small>คน</small></div>
          <div className="stat-lab">อยู่ในกลุ่มควรติดตาม</div>
          <div className="stat-trend"><Spark points={[12, 15, 14, 18, 16, watch]} color="var(--yellow)" /> 4 สัปดาห์ล่าสุด</div>
        </button>

        <button className="stat" onClick={() => goto("cases")}>
          <div className="stat-ic" style={{ background: "var(--pink-mist)", color: "var(--pink)" }}>{I.hands}</div>
          <div className="stat-num"><CountUp to={activeCases} /> <small>เคส</small></div>
          <div className="stat-lab">กำลังช่วยเหลืออยู่</div>
          <div className="stat-trend">{I.clock} อัปเดตล่าสุดวันนี้</div>
        </button>
      </div>

      <div className="sec-head">
        <h3 className="sec-title">วันนี้ควรดูแลใคร {open.length > 0 && <span className="sec-count">{open.length} รายการ</span>}</h3>
        <button className="btn btn-ghost btn-sm" onClick={() => goto("today")}>ดูทั้งหมด {I.arrow}</button>
      </div>

      {finished ? (
        <div className="card">
          <Empty mood="success" title="เยี่ยมเลย วันนี้ไม่มีรายการเร่งด่วน"
            desc="ทุกรายการได้รับการติดตามแล้ว น้อง CARE จะแจ้งอีกครั้งเมื่อมีเรื่องที่ควรดูแล"
            action={<button className="btn" onClick={() => goto("students")}>ดูรายชื่อนักเรียน</button>} />
        </div>
      ) : (
        <div className="att-grid stagger">
          {open.slice(0, 3).map((a) => {
            const st = STUDENTS.find((s) => s.id === a.sid);
            if (!st) return null;
            return <AttentionCard key={a.id} a={a} student={st} done={false} onDone={onDone} onOpen={openStudent} />;
          })}
        </div>
      )}

      <div className="sec-head"><h3 className="sec-title">ภาพรวมการดูแลนักเรียน</h3></div>
      <div className="chart-grid">
        <div className="card">
          <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
            <Donut data={statusData(scope)} />
            <div className="legend" style={{ flex: 1, minWidth: 180 }}>
              {statusData(scope).map((d) => (
                <div className="leg" key={d.label}>
                  <i className="leg-sw" style={{ background: d.color }} />{d.label}<b>{d.value}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--navy)", marginBottom: 16 }}>ความคืบหน้าการเยี่ยมบ้านรายระดับชั้น</div>
          <HBars rows={visitByLevel(scope)} />
        </div>
      </div>
    </>
  );
}

function statusData(scope) {
  return [
    { label: "ปกติ", value: scope.filter((s) => s.status === "normal").length, color: "var(--green)" },
    { label: "ควรติดตาม", value: scope.filter((s) => s.status === "watch").length, color: "var(--yellow)" },
    { label: "ต้องดำเนินการ", value: scope.filter((s) => s.status === "help").length, color: "var(--orange)" },
    { label: "เร่งด่วน", value: scope.filter((s) => s.status === "urgent").length, color: "var(--red)" },
  ];
}

function visitByLevel(scope) {
  return LEVELS.map((lv) => {
    const g = scope.filter((s) => s.level === lv);
    const pct = g.length ? Math.round((g.filter((s) => s.visited).length / g.length) * 100) : 0;
    return { label: lv, value: pct, color: pct >= 85 ? "var(--green)" : pct >= 70 ? "var(--yellow)" : "var(--orange)" };
  }).filter((r) => r.value > 0 || scope.some((s) => s.level === r.label));
}

/* ==========================================================================
   PAGE — วันนี้ควรติดตาม
   ========================================================================== */

function TodayPage({ attention, doneIds, onDone, openStudent }) {
  const [filter, setFilter] = useState("all");
  const list = attention.filter((a) => filter === "all" || a.level === filter);
  const open = list.filter((a) => !doneIds.includes(a.id));

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">วันนี้ควรติดตาม</h1>
          <p className="page-sub">เรียงตามความเร่งด่วน กดปุ่มการทำงานเพื่อบันทึกการติดตามทันที</p>
        </div>
        <div className="chips">
          {[["all", "ทั้งหมด"], ["urgent", "เร่งด่วน"], ["help", "ต้องดำเนินการ"], ["watch", "ควรติดตาม"]].map(([k, l]) => (
            <button key={k} className={`chip${filter === k ? " on" : ""}`} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card"><Empty mood="empty" title="ไม่มีรายการในหมวดนี้" desc="ลองเลือกหมวดอื่น หรือกลับไปดูรายการทั้งหมด" /></div>
      ) : open.length === 0 ? (
        <div className="card"><Empty mood="success" title="ติดตามครบทุกรายการแล้ว" desc="น้อง CARE บันทึกการติดตามให้เรียบร้อย ระบบจะแจ้งอีกครั้งเมื่อมีรายการใหม่" /></div>
      ) : null}

      <div className="att-grid stagger">
        {list.map((a) => {
          const st = STUDENTS.find((s) => s.id === a.sid);
          if (!st) return null;
          return <AttentionCard key={a.id} a={a} student={st} done={doneIds.includes(a.id)} onDone={onDone} onOpen={openStudent} />;
        })}
      </div>
    </>
  );
}

/* ==========================================================================
   PAGE — นักเรียน
   ========================================================================== */

function StudentsPage({ scope, openStudent, title = "นักเรียน", sub }) {
  const [q, setQ] = useState("");
  const [lv, setLv] = useState("all");
  const [room, setRoom] = useState("all");
  const [st, setSt] = useState("all");
  const [limit, setLimit] = useState(60);

  const levels = useMemo(() => [...new Set(scope.map((s) => s.level))].sort(), [scope]);
  const rooms = useMemo(() =>
    [...new Set(scope.filter((s) => lv === "all" || s.level === lv).map((s) => s.room))]
      .sort((a, b) => a.localeCompare(b, "th", { numeric: true })), [scope, lv]);

  const filtered = useMemo(() => scope.filter((s) =>
    (lv === "all" || s.level === lv) &&
    (room === "all" || s.room === room) &&
    (st === "all" || s.status === st) &&
    (q === "" || nameOf(s).includes(q) || s.room.includes(q))
  ), [scope, lv, room, st, q]);

  const list = filtered.slice(0, limit);
  useEffect(() => { setLimit(60); }, [lv, room, st, q]);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">{sub || `ทั้งหมด ${scope.length} คน — เลือกนักเรียนเพื่อเปิด Student 360°`}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <div className="search">{I.search}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาชื่อนักเรียนหรือห้องเรียน" />
        </div>
      </div>

      <div className="chips" style={{ marginBottom: 8 }}>
        <button className={`chip${lv === "all" ? " on" : ""}`} onClick={() => { setLv("all"); setRoom("all"); }}>ทุกระดับชั้น</button>
        {levels.map((l) => (
          <button key={l} className={`chip${lv === l ? " on" : ""}`} onClick={() => { setLv(l); setRoom("all"); }}>{l}</button>
        ))}
      </div>

      {rooms.length > 1 && (
        <div className="chips" style={{ marginBottom: 8 }}>
          <button className={`chip${room === "all" ? " on" : ""}`} onClick={() => setRoom("all")}>ทุกห้อง</button>
          {rooms.map((r) => (
            <button key={r} className={`chip${room === r ? " on" : ""}`} onClick={() => setRoom(r)}>{r}</button>
          ))}
        </div>
      )}
      <div className="chips" style={{ marginBottom: 18 }}>
        <button className={`chip${st === "all" ? " on" : ""}`} onClick={() => setSt("all")}>ทุกสถานะ</button>
        {Object.values(STATUS).map((s) => <button key={s.key} className={`chip${st === s.key ? " on" : ""}`} onClick={() => setSt(s.key)}>{s.label}</button>)}
      </div>

      {list.length === 0 ? (
        <div className="card"><Empty mood="search" title="ไม่พบนักเรียนที่ตรงกับเงื่อนไข" desc="ลองพิมพ์ชื่อให้สั้นลง หรือล้างตัวกรองระดับชั้นและสถานะ" /></div>
      ) : (
        <div className="stu-grid stagger">
          {list.map((s) => (
            <button className="stu" key={s.id} onClick={() => openStudent(s)}>
              {s.photoUrl
                ? <img className="stu-ava stu-photo" src={s.photoUrl} alt="" />
                : <span className="stu-ava" style={{ background: `linear-gradient(145deg,${STATUS[s.status].color},var(--navy))` }}>{initialOf(s)}</span>}
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="stu-name" style={{ display: "block" }}>{nameOf(s)}</span>
                <span className="stu-meta" style={{ display: "block" }}>{s.room} · เลขที่ {s.no} · {s.score} คะแนน</span>
              </span>
              <i className="dot" style={{ background: STATUS[s.status].color, width: 9, height: 9 }} />
            </button>
          ))}
        </div>
      )}
      {filtered.length > list.length && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button className="btn" onClick={() => setLimit((n) => n + 120)}>
            โหลดเพิ่มอีก {Math.min(120, filtered.length - list.length)} คน
          </button>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 10 }}>
            แสดง {list.length} จาก {filtered.length} คนที่ตรงเงื่อนไข (ทั้งหมด {scope.length} คน)
          </p>
        </div>
      )}
      {filtered.length > 0 && filtered.length === list.length && (
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 16, textAlign: "center" }}>
          แสดงครบทั้ง {filtered.length} คนแล้ว
        </p>
      )}
    </>
  );
}

/* ==========================================================================
   PAGE — STUDENT 360°
   ========================================================================== */

const FACES = [
  { key: "me", emoji: "❤️", t: "รู้จักฉัน", d: "ชื่อเล่น วันเกิด ความสนใจ", bg: "var(--pink-mist)" },
  { key: "home", emoji: "🏠", t: "บ้านของฉัน", d: "ครอบครัวและที่อยู่อาศัย", bg: "var(--navy-soft)" },
  { key: "talent", emoji: "⭐", t: "จุดเด่นของฉัน", d: "ความสามารถและความฝัน", bg: "var(--yellow-bg)" },
  { key: "study", emoji: "📚", t: "การเรียน", d: "ผลการเรียนและการมาเรียน", bg: "var(--blue-bg)" },
  { key: "behavior", emoji: "📝", t: "พฤติกรรม", d: "บันทึกคะแนนความประพฤติ", bg: "var(--orange-bg)" },
  { key: "case", emoji: "🤝", t: "การช่วยเหลือ", d: "Case ที่กำลังดูแล", bg: "var(--green-bg)" },
  { key: "visit", emoji: "📍", t: "การเยี่ยมบ้าน", d: "ผลการเยี่ยมบ้านล่าสุด", bg: "var(--pink-mist)" },
  { key: "screen", emoji: "🛡", t: "ผลการคัดกรอง", d: "SDQ และการจัดกลุ่ม", bg: "var(--blue-bg)" },
  { key: "edit", emoji: "✏️", t: "แก้ไขข้อมูลรายบุคคล", d: "ขั้นที่ 1 รู้จักนักเรียน", bg: "var(--navy-soft)" },
];

const BEHAVIOR_LOG = [
  { date: "8 ก.ย. 2569", title: "มาสาย", body: "มาถึงโรงเรียนเวลา 08.15 น. ครูเวรบันทึก", delta: -5, color: "var(--orange)" },
  { date: "2 ก.ย. 2569", title: "ช่วยงานกิจกรรมกีฬาสี", body: "ช่วยจัดสถานที่และเก็บอุปกรณ์จนเสร็จ", delta: +5, color: "var(--green)" },
  { date: "27 ส.ค. 2569", title: "ใช้โทรศัพท์ในคาบเรียน", body: "ครูประจำวิชาตักเตือนและบันทึก", delta: -5, color: "var(--orange)" },
];

function DetailForm({ initial, onSave }) {
  const [f, setF] = useState({
    nickname: initial.nickname || "",
    live_with: initial.live_with || "",
    father_note: initial.father_note || "",
    mother_note: initial.mother_note || "",
    siblings_note: initial.siblings_note || "",
    dream: initial.dream || "",
    talents: (initial.talents || []).join(", "),
    weak_subjects: (initial.weak_subjects || []).join(", "),
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const split = (v) => v.split(",").map((x) => x.trim()).filter(Boolean);

  return (
    <>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "0 0 16px", lineHeight: 1.6 }}>
        ขั้นที่ 1 ของระบบดูแลช่วยเหลือนักเรียน กรอกเท่าที่ทราบจริง ช่องไหนยังไม่รู้เว้นไว้ได้
        อย่าเดาแทนนักเรียน
      </p>
      <div className="field"><label>ชื่อเล่น</label>
        <input className="inp" value={f.nickname} onChange={(e) => set("nickname", e.target.value)} /></div>
      <div className="field"><label>พักอาศัยอยู่กับ</label>
        <OptRow options={["บิดามารดา", "บิดา", "มารดา", "ญาติ", "หอพัก/อื่น ๆ"]}
          value={f.live_with} onChange={(v) => set("live_with", v)} /></div>
      <div className="field"><label>บิดา <span className="hint">อาชีพหรือสถานะการติดต่อ</span></label>
        <input className="inp" value={f.father_note} onChange={(e) => set("father_note", e.target.value)} /></div>
      <div className="field"><label>มารดา</label>
        <input className="inp" value={f.mother_note} onChange={(e) => set("mother_note", e.target.value)} /></div>
      <div className="field"><label>พี่น้อง</label>
        <input className="inp" value={f.siblings_note} onChange={(e) => set("siblings_note", e.target.value)} /></div>
      <div className="field"><label>ความสามารถหรือสิ่งที่ชอบ <span className="hint">คั่นด้วยจุลภาค</span></label>
        <input className="inp" value={f.talents} placeholder="วงโยธวาทิต, วาดภาพ"
          onChange={(e) => set("talents", e.target.value)} /></div>
      <div className="field"><label>ความฝันหรือสิ่งที่อยากเป็น</label>
        <input className="inp" value={f.dream} onChange={(e) => set("dream", e.target.value)} /></div>
      <div className="field"><label>วิชาที่ควรช่วยเหลือ <span className="hint">คั่นด้วยจุลภาค</span></label>
        <input className="inp" value={f.weak_subjects} placeholder="คณิตศาสตร์, ภาษาอังกฤษ"
          onChange={(e) => set("weak_subjects", e.target.value)} /></div>

      <div className="privacy" style={{ marginTop: 0, marginBottom: 16 }}>{I.shield}
        <span>ข้อมูลนี้เห็นได้เฉพาะทีมดูแลช่วยเหลือนักเรียน ผู้ปกครองและนักเรียนคนอื่นไม่เห็น</span>
      </div>

      <button className="btn btn-primary btn-block btn-lg"
        onClick={() => onSave({
          ...f, talents: split(f.talents), weak_subjects: split(f.weak_subjects),
        })}>บันทึกข้อมูล</button>
    </>
  );
}

const CARE_STEPS = [
  { n: 1, t: "รู้จักนักเรียนเป็นรายบุคคล", d: "ข้อมูลรายบุคคลและการเยี่ยมบ้าน" },
  { n: 2, t: "คัดกรองนักเรียน", d: "SDQ และการจัดกลุ่ม" },
  { n: 3, t: "ส่งเสริมและพัฒนา", d: "กิจกรรมและคะแนนความดี" },
  { n: 4, t: "ป้องกันและแก้ไขปัญหา", d: "เปิด Case และติดตาม" },
  { n: 5, t: "ส่งต่อ", d: "ครูแนะแนวหรือหน่วยงานภายนอก" },
];

function CareSteps({ student, done, onMark }) {
  const [pick, setPick] = useState(null);
  const [note, setNote] = useState("");
  const has = (n) => done.some((d) => d.step === n);

  return (
    <>
      <div className="sec-head" style={{ marginTop: 22 }}>
        <h3 className="sec-title">ระบบดูแลช่วยเหลือนักเรียน 5 ขั้นตอน
          <span className="sec-count">{done.length} จาก 5</span></h3>
      </div>
      <div className="steps5">
        {CARE_STEPS.map((st) => {
          const d = done.find((x) => x.step === st.n);
          return (
            <button key={st.n} className={`step5${d ? " done" : ""}`}
              onClick={() => { setPick(st); setNote(d?.evidence || ""); }}>
              <span className="step5-n">{d ? "✓" : st.n}</span>
              <span className="step5-t" style={{ display: "block" }}>{st.t}</span>
              <span className="step5-d" style={{ display: "block" }}>
                {d ? (d.evidence || "บันทึกแล้ว") : st.d}
              </span>
            </button>
          );
        })}
      </div>

      <Sheet open={!!pick} onClose={() => setPick(null)}
        title={pick ? `ขั้นที่ ${pick.n} ${pick.t}` : ""}
        sub={student ? `${nameOf(student)} · ${student.room}` : ""}>
        {pick && (
          <>
            {has(pick.n) ? (
              <div className="privacy" style={{ marginTop: 0, marginBottom: 16, background: "var(--green-bg)", color: "var(--green)" }}>
                {I.check}<span>ขั้นนี้บันทึกไว้แล้ว แก้ไขหลักฐานด้านล่างแล้วบันทึกซ้ำได้</span>
              </div>
            ) : (
              <p style={{ fontSize: 13.5, color: "var(--ink-mid)", margin: "0 0 14px", lineHeight: 1.6 }}>
                บางขั้นระบบบันทึกให้เองเมื่อมีข้อมูลครบ เช่น เยี่ยมบ้านแล้ว คัดกรองแล้ว หรือเปิด Case แล้ว
                ส่วนขั้นที่ระบบเดาไม่ได้ ให้ครูบันทึกหลักฐานเองที่นี่
              </p>
            )}
            <div className="field">
              <label>หลักฐานหรือสิ่งที่ทำ</label>
              <textarea className="inp" value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="เช่น เข้าร่วมค่ายพัฒนาทักษะชีวิต 12 ส.ค. 2569" />
            </div>
            <button className="btn btn-primary btn-block" disabled={note.trim().length < 4}
              onClick={() => { onMark(pick.n, note.trim()); setPick(null); }}>
              บันทึกขั้นที่ {pick.n}
            </button>
          </>
        )}
      </Sheet>
    </>
  );
}

function Student360({ student, onBack, goConduct, goVisit, goCase, toast }) {
  const [face, setFace] = useState(null);
  const [live, setLive] = useState(null);
  const [grades, setGrades] = useState([]);
  const [steps, setSteps] = useState([]);
  const [screens, setScreens] = useState([]);
  const [editing, setEditing] = useState(null);
  const [refs, setRefs] = useState({});          // ขั้นปัจจุบันของแต่ละสาย
  const [refOpen, setRefOpen] = useState(null);  // {track, from}
  const [pcOpen, setPcOpen] = useState(false);
  const [pcLog, setPcLog] = useState([]);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!LIVE) return;
    setLive(null); setGrades([]);
    window.storage.get(`student:${student.id}:details`).then((r) => r?.value && setLive(r.value)).catch(() => {});
    window.storage.get(`student:${student.id}:grades`).then((r) => setGrades(r?.value || [])).catch(() => {});
    window.storage.get(`student:${student.id}:steps`).then((r) => setSteps(r?.value || [])).catch(() => {});
    window.storage.get(`student:${student.id}:screen`).then((r) => setScreens(r?.value || [])).catch(() => {});
    window.storage.get(`student:${student.id}:referrals`).then((r) => {
      const m = {}; (r?.value || []).forEach((x) => { m[x.track] = x; }); setRefs(m);
    }).catch(() => {});
    window.storage.get(`student:${student.id}:contacts`).then((r) => setPcLog(r?.value || [])).catch(() => {});
    if (student.photoUrl) setPhotoUrl(student.photoUrl);
  }, [student.id]);

  const markStep = async (n, evidence) => {
    setSteps((p) => [...p.filter((x) => x.step !== n), { step: n, evidence, done_on: new Date().toISOString() }]);
    await save("carestep", { sid: student.id, step: n, evidence });
    toast(`บันทึกขั้นที่ ${n} แล้วครับ`, "happy");
  };

  const sendReferral = async (payload) => {
    const now = new Date().toISOString();
    setRefs((p) => ({ ...p, [payload.track]: {
      track: payload.track, step: payload.to_step, status: "sent",
      to_person: payload.to_person, reason: payload.reason, created_at: now,
    } }));
    await save("referral", { sid: student.id, ...payload });
    setRefOpen(null);
    toast(payload.to_step >= 4
      ? "บันทึกการส่งต่อแล้ว ระบบนับเป็นขั้นที่ 5 ของระบบดูแลช่วยเหลือนักเรียนให้ด้วย"
      : "บันทึกการส่งต่อแล้ว ติดตามได้จากแถบสายส่งต่อ", "tracking");
  };

  const saveContact = async (form) => {
    const row = { ...form, when: new Date().toLocaleString("th-TH") };
    setPcLog((p) => [row, ...p]);
    await save("parentcontact", { sid: student.id, ...form });
    setPcOpen(false);
    toast(form.outcome === "reached"
      ? "บันทึกการติดต่อผู้ปกครองแล้ว"
      : "บันทึกแล้ว ระบบเพิ่มรายการติดตามให้เพราะยังติดต่อไม่สำเร็จ",
      form.outcome === "reached" ? "happy" : "tracking");
  };

  const uploadPhoto = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast("ไฟล์ใหญ่เกิน 5 MB"); return; }
    setPhotoUrl(URL.createObjectURL(file));
    if (LIVE) {
      try { await window.storage.uploadStudentPhoto(student.id, file); toast("บันทึกรูปนักเรียนแล้ว"); }
      catch { toast("อัปโหลดไม่สำเร็จ ลองใหม่อีกครั้ง"); }
    } else {
      toast("บันทึกรูปนักเรียนแล้ว");
    }
  };

  const saveDetails = async (form) => {
    setLive((p) => ({ ...(p || {}), ...form }));
    await save(`student:${student.id}:details`, form);
    setEditing(null);
    toast("บันทึกข้อมูลรายบุคคลแล้ว");
  };

  const d = live ? {
    ...DEFAULT_DEEP,
    nickname: live.nickname || "-",
    talents: live.talents?.length ? live.talents : DEFAULT_DEEP.talents,
    dream: live.dream || "ยังไม่บันทึก",
    family: {
      live: live.live_with || "-", father: live.father_note || "-", mother: live.mother_note || "-",
      siblings: live.siblings_note || "-", income: live.income_level || "-",
    },
    home: { type: live.house_type || "-", own: live.house_own || "-", light: "-", net: "-" },
    travel: { how: live.travel_mode || "-", minutes: live.travel_minutes || 0, cost: live.travel_cost || "-" },
    study: {
      gpa: Number(live.gpa) || 0, absent: live.absent_count || 0, late: live.late_count || 0,
      weak: live.weak_subjects || [],
    },
  } : deepOf(student.id);
  const s = STATUS[student.status];
  const myCases = CASES_SEED.filter((c) => c.sid === student.id);

  const body = {
    me: (
      <div>
        <div className="kv"><span className="kv-k">ชื่อเล่น</span><span className="kv-v">{d.nickname}</span></div>
        <div className="kv"><span className="kv-k">วันเกิด</span><span className="kv-v">{d.birth}</span></div>
        <div className="kv"><span className="kv-k">กรุ๊ปเลือด</span><span className="kv-v">{d.blood}</span></div>
        <div className="kv"><span className="kv-k">ห้องเรียน</span><span className="kv-v">{student.room} เลขที่ {student.no}</span></div>
        <div className="kv"><span className="kv-k">ครูที่ปรึกษา</span><span className="kv-v">{student.teacher}</span></div>
      </div>
    ),
    home: (
      <div>
        <div className="kv"><span className="kv-k">พักอาศัยกับ</span><span className="kv-v">{d.family.live}</span></div>
        <div className="kv"><span className="kv-k">บิดา</span><span className="kv-v">{d.family.father}</span></div>
        <div className="kv"><span className="kv-k">มารดา</span><span className="kv-v">{d.family.mother}</span></div>
        <div className="kv"><span className="kv-k">พี่น้อง</span><span className="kv-v">{d.family.siblings}</span></div>
        <div className="kv"><span className="kv-k">ลักษณะบ้าน</span><span className="kv-v">{d.home.type} · {d.home.own}</span></div>
        <div className="kv"><span className="kv-k">การเดินทาง</span><span className="kv-v">{d.travel.how} · {d.travel.minutes} นาที</span></div>
      </div>
    ),
    talent: (
      <div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {d.talents.map((t) => <span key={t} className="badge b-pink">{t}</span>)}
        </div>
        <div className="kv"><span className="kv-k">ความฝัน</span><span className="kv-v">{d.dream}</span></div>
      </div>
    ),
    study: (
      <div>
        <div className="kv"><span className="kv-k">เกรดเฉลี่ยสะสม</span><span className="kv-v">{d.study.gpa.toFixed(2)}</span></div>
        <div className="kv"><span className="kv-k">ขาดเรียน</span><span className="kv-v">{d.study.absent} ครั้ง</span></div>
        <div className="kv"><span className="kv-k">มาสาย</span><span className="kv-v">{d.study.late} ครั้ง</span></div>
        <div className="kv"><span className="kv-k">วิชาที่ควรช่วยเหลือ</span>
          <span className="kv-v">{d.study.weak.length ? d.study.weak.join(" · ") : "ไม่มี"}</span></div>
        {grades.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--navy)", marginBottom: 8 }}>
              ผลการเรียนที่นำเข้าจาก SGS
            </div>
            {grades.filter((g) => g.is_risk).length === 0 ? (
              <span className="badge b-green"><i className="dot" />ไม่มีรายวิชาที่ต้องแก้ไข</span>
            ) : grades.filter((g) => g.is_risk).map((g) => (
              <div className="kv" key={g.subject_code + g.term}>
                <span className="kv-k">{g.subject_name || g.subject_code} · ภาค {g.term}</span>
                <span className="kv-v" style={{ color: "var(--red)" }}>{g.result}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    behavior: (
      <div className="timeline">
        {BEHAVIOR_LOG.map((b, i) => (
          <div className="tl-item" key={i} style={{ color: b.color }}>
            <i className="tl-dot" />
            <div className="tl-date">{b.date}</div>
            <div className="tl-title">{b.title} <span style={{ color: b.color }}>{b.delta > 0 ? `+${b.delta}` : b.delta}</span></div>
            <div className="tl-body">{b.body}</div>
          </div>
        ))}
      </div>
    ),
    case: myCases.length ? (
      <div>
        {myCases.map((c) => (
          <div key={c.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
            <div style={{ fontWeight: 600, color: "var(--navy)" }}>{c.title}</div>
            <div style={{ fontSize: 13, color: "var(--ink-mid)", marginTop: 4 }}>{c.note}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 6 }}>
              {CASE_STAGES.find((x) => x.key === c.stage)?.label} · ผู้ดูแล {c.owner} · {c.updated}
            </div>
          </div>
        ))}
      </div>
    ) : <Empty mood="empty" title="ยังไม่มี Case ที่รอคุณดำเนินการ" desc="เมื่อเปิด Case ช่วยเหลือ รายการจะแสดงที่นี่พร้อมประวัติการติดตาม" />,
    screen: screens.length ? (
      <div className="timeline">
        {screens.map((sc, i) => {
          const b = { normal: ["ปกติ", "var(--green)"], risk: ["กลุ่มเสี่ยง", "var(--yellow)"], problem: ["กลุ่มมีปัญหา", "var(--red)"] }[sc.band] || ["-", "var(--ink-soft)"];
          return (
            <div className="tl-item" key={i} style={{ color: b[1] }}>
              <i className="tl-dot" />
              <div className="tl-date">{new Date(sc.screened_on).toLocaleDateString("th-TH")} · ภาคเรียนที่ {sc.term || 1}</div>
              <div className="tl-title">{sc.instrument} — {b[0]}</div>
              <div className="tl-body">
                {sc.source === "hero"
                  ? `คัดกรองในระบบ HERO OBEC CARE${sc.hero_round ? ` รอบที่ ${sc.hero_round}` : ""} · ระบบนี้เก็บเฉพาะผลกลุ่ม`
                  : `คะแนนรวมปัญหา ${sc.scores?.total ?? "-"} · สัมพันธภาพทางสังคม ${sc.scores?.prosocial ?? "-"}`}
              </div>
            </div>
          );
        })}
      </div>
    ) : <Empty mood="empty" title="ยังไม่มีผลการคัดกรอง"
      desc="เมื่อบันทึกผลจาก HERO OBEC CARE แล้ว ประวัติการคัดกรองทุกรอบจะมาแสดงที่นี่" />,

    edit: (
      <DetailForm initial={live || {}} onSave={saveDetails} />
    ),

    visit: student.visited ? (
      <div>
        <div className="kv"><span className="kv-k">วันที่เยี่ยม</span><span className="kv-v">24 มิถุนายน 2569</span></div>
        <div className="kv"><span className="kv-k">ผู้เยี่ยม</span><span className="kv-v">{student.teacher}</span></div>
        <div className="kv"><span className="kv-k">ผลการประเมิน</span><span className="kv-v">{s.label}</span></div>
        <div className="photo-grid" style={{ marginTop: 16 }}>
          {["🏠 ภายนอกบ้าน", "🛋 ภายในบ้าน", "👨‍👩‍👧 กับผู้ปกครอง"].map((t) => (
            <div key={t} className="photo-slot filled">
              <div className="photo-thumb">{t.slice(0, 2)}</div>
              <div className="photo-t">{t.slice(2)}</div>
            </div>
          ))}
        </div>
      </div>
    ) : <Empty mood="waiting" title="ยังไม่มีบันทึกการเยี่ยมบ้าน"
      desc="ภาคเรียนนี้ยังไม่มีข้อมูล เริ่มบันทึกได้จากปุ่มด้านล่าง"
      action={<button className="btn btn-primary" onClick={() => { setFace(null); goVisit(student); }}>บันทึกการเยี่ยมบ้าน</button>} />,
  };

  return (
    <>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 14 }}>{I.back} กลับ</button>

      <section className="hero">
        <svg style={{ position: "absolute", right: 14, top: 10, opacity: .16, pointerEvents: "none" }}
          width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
          <g stroke="#fff" strokeWidth="1.4" fill="none">
            <circle cx="106" cy="42" r="30" /><circle cx="106" cy="42" r="46" />
            <circle cx="106" cy="42" r="62" />
          </g>
          <g fill="#fff">
            <circle cx="40" cy="96" r="2.4" /><circle cx="58" cy="118" r="1.8" />
            <circle cx="22" cy="66" r="1.6" /><circle cx="126" cy="112" r="2" />
          </g>
        </svg>
        <div className="hero-row">
          <label className="hero-ava" style={{ cursor: "pointer", overflow: "hidden", padding: 0, position: "relative" }}
            title="แตะเพื่อเพิ่มหรือเปลี่ยนรูปนักเรียน">
            {photoUrl
              ? <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initialOf(student)}
            <span style={{
              position: "absolute", right: 0, bottom: 0, left: 0, background: "rgba(0,0,0,.45)",
              fontSize: 10.5, padding: "3px 0", textAlign: "center",
            }}>{photoUrl ? "เปลี่ยนรูป" : "เพิ่มรูป"}</span>
            <input type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { uploadPhoto(e.target.files?.[0]); e.target.value = ""; }} />
          </label>
          <div style={{ minWidth: 0 }}>
            <h2 className="hero-name">{nameOf(student)}</h2>
            <div className="hero-meta">{student.room} · เลขที่ {student.no} · ครูที่ปรึกษา {student.teacher}</div>
            <span className="badge" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>
              <i className="dot" style={{ background: s.color }} />{s.label}
            </span>
          </div>
          <div className="hero-score">
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1 }}>{student.score}</div>
              <div className="hero-kv">คะแนนความประพฤติ / 100</div>
            </div>
            <Care mood={student.status === "normal" ? "happy" : "tracking"} size={78} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 9, marginTop: 18, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          <button className="btn btn-sm" style={{ background: "#fff", color: "var(--pink)" }} onClick={() => goConduct(student)}>บันทึกคะแนน</button>
          <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.16)", color: "#fff" }} onClick={() => goVisit(student)}>เยี่ยมบ้าน</button>
          <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.16)", color: "#fff" }} onClick={() => goCase(student)}>เปิด Case ช่วยเหลือ</button>
          <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.16)", color: "#fff" }}
            onClick={() => setPcOpen(true)}>{I.phone} ติดต่อผู้ปกครอง
            {pcLog.length > 0 && <span className="badge" style={{ background: "rgba(255,255,255,.25)", color: "#fff", fontSize: 11 }}>{pcLog.length}</span>}
          </button>
        </div>
      </section>

      <CareSteps student={student} done={steps} onMark={markStep} />

      <div className="sec-head">
        <h3 className="sec-title">การส่งต่อ</h3>
        <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>สองสายเดินคู่ขนานกันได้</span>
      </div>
      <TrackBar track="discipline" cur={refs.discipline} onSend={(t, from) => setRefOpen({ track: t, from })} />
      <TrackBar track="wellbeing" cur={refs.wellbeing} onSend={(t, from) => setRefOpen({ track: t, from })} />

      <div className="sec-head"><h3 className="sec-title">ข้อมูลรายด้าน</h3></div>
      <div className="face-grid stagger">
        {FACES.map((f) => (
          <button className="face" key={f.key} onClick={() => setFace(f)}>
            <span className="face-ic" style={{ background: f.bg }}>{f.emoji}</span>
            <span className="face-t" style={{ display: "block" }}>{f.t}</span>
            <span className="face-d" style={{ display: "block" }}>{f.d}</span>
          </button>
        ))}
      </div>

      <Sheet open={!!face} onClose={() => setFace(null)} title={face ? `${face.emoji} ${face.t}` : ""} sub={face ? `${nameOf(student)} · ${student.room}` : ""}>
        {face && body[face.key]}
      </Sheet>

      <ReferralSheet open={!!refOpen} onClose={() => setRefOpen(null)} student={student}
        track={refOpen?.track} from={refOpen?.from} onSave={sendReferral} />

      <ParentContactSheet open={pcOpen} onClose={() => setPcOpen(false)} student={student}
        history={pcLog} onSave={saveContact} />
    </>
  );
}


/* ==========================================================================
   สายการส่งต่อ สองสายเดินคู่ขนานกันได้
   สายวินัย   งานระเบียบและความปลอดภัย
   สายดูแลจิตใจ งานช่วยเหลือและสุขภาพจิต
   ทั้งสองสายอยู่ภายในขั้นที่ 4 และ 5 ของระบบดูแลช่วยเหลือนักเรียน ไม่ได้มาแทนกัน
   ========================================================================== */

const TRACKS = {
  discipline: {
    key: "discipline", label: "สายวินัย", color: "var(--orange)",
    desc: "งานระเบียบและความปลอดภัย",
    steps: [
      { step: 1, label: "ครูที่ปรึกษา", hint: "ตักเตือน ทำข้อตกลง แจ้งผู้ปกครอง" },
      { step: 2, label: "หัวหน้าระดับชั้น", hint: "ประชุมทีมระดับ ติดตามผลข้อตกลง" },
      { step: 3, label: "ครูพฤติกรรม", hint: "รับเคสที่ยังไม่ดีขึ้น ทำข้อตกลงกับผู้ปกครอง" },
      { step: 4, label: "คณะกรรมการฯ", hint: "พิจารณาตามระเบียบข้อ 18.5 และ 21" },
      { step: 5, label: "ผู้อำนวยการ", hint: "วินิจฉัยชี้ขาด ทัณฑ์บน หรือย้ายสถานศึกษา" },
    ],
  },
  wellbeing: {
    key: "wellbeing", label: "สายดูแลจิตใจ", color: "var(--blue)",
    desc: "งานช่วยเหลือและสุขภาพจิต",
    steps: [
      { step: 1, label: "ครูที่ปรึกษา", hint: "รับฟัง สังเกต บันทึกสิ่งที่พบ" },
      { step: 2, label: "หัวหน้าระดับชั้น", hint: "ประชุมทีมระดับ วางแผนช่วยเหลือ" },
      { step: 3, label: "แนะแนว / จิตวิทยาโรงเรียน", hint: "ให้คำปรึกษารายบุคคล" },
      { step: 4, label: "นักจิตวิทยาประจำเขต", hint: "ส่งต่อผ่าน HERO OBEC CARE" },
      { step: 5, label: "โรงพยาบาล / ภายนอก", hint: "ต้องได้รับความยินยอมจากผู้ปกครอง" },
    ],
  },
};

const REF_STATUS = {
  sent: { label: "ส่งแล้ว รอรับเรื่อง", cls: "b-blue" },
  received: { label: "รับเรื่องแล้ว", cls: "b-yellow" },
  in_progress: { label: "กำลังดำเนินการ", cls: "b-orange" },
  returned: { label: "ส่งกลับต้นทาง", cls: "b-navy" },
  done: { label: "ดำเนินการเสร็จ", cls: "b-green" },
};

function TrackBar({ track, cur, onSend }) {
  const T = TRACKS[track];
  const at = cur?.step || 0;
  return (
    <div className="track">
      <div className="track-head">
        <i className="track-dot" style={{ background: T.color }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 15 }}>{T.label}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{T.desc}</div>
        </div>
        {cur
          ? <span className={`badge ${REF_STATUS[cur.status]?.cls || "b-navy"}`}>
              <i className="dot" />{REF_STATUS[cur.status]?.label || cur.status}
            </span>
          : <span className="badge b-green"><i className="dot" />ยังไม่ต้องส่งต่อ</span>}
      </div>

      <div className="track-line">
        {T.steps.map((st) => (
          <div key={st.step} className={`tnode${st.step < at ? " done" : st.step === at ? " now" : ""}`}>
            <div className="tnode-ball">{st.step < at ? "✓" : st.step}</div>
            <div className="tnode-l">{st.label}</div>
          </div>
        ))}
      </div>

      {cur && (
        <div style={{ fontSize: 13, color: "var(--ink-mid)", marginTop: 12, lineHeight: 1.6 }}>
          อยู่ที่ <b style={{ color: "var(--navy)" }}>{cur.to_person_name || cur.to_person || T.steps[at - 1]?.label}</b>
          {cur.created_at && ` · ส่งเมื่อ ${new Date(cur.created_at).toLocaleDateString("th-TH")}`}
          {cur.reason && <div style={{ marginTop: 4 }}>เหตุผล {cur.reason}</div>}
        </div>
      )}

      <button className="btn btn-sm" style={{ marginTop: 14 }} onClick={() => onSend(track, at)}>
        {at === 0 ? "เริ่มส่งต่อในสายนี้" : at >= 5 ? "บันทึกความคืบหน้า" : "ส่งต่อขั้นถัดไป"}
      </button>
    </div>
  );
}

function ReferralSheet({ open, onClose, student, track, from, onSave }) {
  const [toStep, setToStep] = useState(Math.min(5, (from || 0) + 1));
  const [reason, setReason] = useState("");
  const [person, setPerson] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => { setToStep(Math.min(5, (from || 0) + 1)); setReason(""); setPerson(""); setConsent(false); }, [open, from]);
  if (!track) return null;

  const T = TRACKS[track];
  const needConsent = toStep >= 5;
  const ok = reason.trim().length >= 8 && (!needConsent || consent);

  return (
    <Sheet open={open} onClose={onClose} title={`ส่งต่อ ${T.label}`}
      sub={student ? `${nameOf(student)} · ${student.room}` : ""}>
      <div className="field">
        <label>ส่งต่อไปยังขั้นใด</label>
        <div className="opt-row">
          {T.steps.filter((x) => x.step >= Math.max(1, from || 1)).map((x) => (
            <button key={x.step} className={`opt${toStep === x.step ? " on" : ""}`} onClick={() => setToStep(x.step)}>
              {x.step}. {x.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.55 }}>
          {T.steps.find((x) => x.step === toStep)?.hint}
        </p>
      </div>

      <div className="field">
        <label>ผู้รับเรื่อง <span className="hint">ชื่อผู้รับ หรือชื่อหน่วยงาน</span></label>
        <input className="inp" value={person} onChange={(e) => setPerson(e.target.value)}
          placeholder="เช่น นางสาวพิมพ์ใจ ศรีวิชัย หรือ โรงพยาบาลลำปาง" />
      </div>

      <div className="field">
        <label>เหตุผลและสิ่งที่ทำมาแล้ว <span className="hint">จำเป็น</span></label>
        <textarea className="inp" value={reason} onChange={(e) => setReason(e.target.value)}
          placeholder="ระบุว่าทำอะไรมาแล้วบ้าง ผลเป็นอย่างไร และต้องการให้ผู้รับช่วยเรื่องใด" />
      </div>

      {needConsent && (
        <label className="privacy" style={{ marginTop: 0, marginBottom: 16, cursor: "pointer", background: "var(--orange-bg)", color: "var(--orange)" }}>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
          <span>
            ยืนยันว่าได้รับความยินยอมจากผู้ปกครองแล้วในการส่งข้อมูลออกนอกโรงเรียน
            ถ้ายังไม่ได้ ให้ขอก่อนแล้วค่อยบันทึก
          </span>
        </label>
      )}

      <button className="btn btn-primary btn-block btn-lg" disabled={!ok}
        onClick={() => onSave({ track, from_step: from || null, to_step: toStep, to_person: person.trim(), reason: reason.trim(), consent })}>
        {ok ? "บันทึกการส่งต่อ" : needConsent && !consent ? "ต้องยืนยันความยินยอมก่อน" : "กรอกเหตุผลอย่างน้อย 8 ตัวอักษร"}
      </button>
    </Sheet>
  );
}

/* ==========================================================================
   บันทึกการติดต่อผู้ปกครอง
   ========================================================================== */

const PC_CHANNEL = [
  ["phone", "โทรศัพท์"], ["line", "ไลน์"], ["visit", "ไปพบที่บ้าน"],
  ["meeting", "เชิญมาพบที่โรงเรียน"], ["letter", "หนังสือแจ้ง"], ["other", "อื่น ๆ"],
];
const PC_OUTCOME = [
  ["reached", "ติดต่อได้ รับทราบแล้ว", "var(--green)"],
  ["no_answer", "ติดต่อไม่ได้", "var(--orange)"],
  ["postponed", "ขอเลื่อนนัด", "var(--yellow)"],
  ["refused", "ไม่ให้ความร่วมมือ", "var(--red)"],
];

function ParentContactSheet({ open, onClose, student, onSave, history }) {
  const [f, setF] = useState({ channel: "phone", contacted: "", topic: "", outcome: "", note: "", next_action: "", next_on: "" });
  const [tab, setTab] = useState("new");
  useEffect(() => {
    if (open) { setF({ channel: "phone", contacted: "", topic: "", outcome: "", note: "", next_action: "", next_on: "" }); setTab("new"); }
  }, [open]);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const ok = f.contacted.trim() && f.topic.trim() && f.outcome;

  return (
    <Sheet open={open} onClose={onClose} title="ติดต่อผู้ปกครอง"
      sub={student ? `${nameOf(student)} · ${student.room}` : ""}>
      <div className="chips" style={{ marginBottom: 16 }}>
        <button className={`chip${tab === "new" ? " on" : ""}`} onClick={() => setTab("new")}>บันทึกการติดต่อ</button>
        <button className={`chip${tab === "log" ? " on" : ""}`} onClick={() => setTab("log")}>
          ประวัติ {history.length > 0 && `(${history.length})`}
        </button>
      </div>

      {tab === "log" ? (
        history.length === 0
          ? <Empty mood="empty" title="ยังไม่มีประวัติการติดต่อ" desc="เมื่อบันทึกแล้ว รายการจะแสดงที่นี่พร้อมชื่อผู้บันทึกและเวลา" />
          : <div className="timeline">
              {history.map((h, i) => {
                const oc = PC_OUTCOME.find((x) => x[0] === h.outcome);
                return (
                  <div className="tl-item" key={i} style={{ color: oc?.[2] || "var(--ink-soft)" }}>
                    <i className="tl-dot" />
                    <div className="tl-date">{h.when} · {PC_CHANNEL.find((c) => c[0] === h.channel)?.[1]}</div>
                    <div className="tl-title">{h.topic}</div>
                    <div className="tl-body">
                      ติดต่อกับ {h.contacted} · {oc?.[1]}
                      {h.note && <div style={{ marginTop: 3 }}>{h.note}</div>}
                      {h.next_action && <div style={{ marginTop: 3 }}>นัดต่อไป {h.next_action} {h.next_on || ""}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
      ) : (
        <>
          <div className="field"><label>ช่องทาง</label>
            <OptRow options={PC_CHANNEL.map((c) => c[1])}
              value={PC_CHANNEL.find((c) => c[0] === f.channel)?.[1]}
              onChange={(v) => set("channel", PC_CHANNEL.find((c) => c[1] === v)[0])} /></div>

          <div className="field"><label>ติดต่อกับใคร</label>
            <input className="inp" value={f.contacted} placeholder="เช่น มารดา (นางสมศรี ใจดี)"
              onChange={(e) => set("contacted", e.target.value)} /></div>

          <div className="field"><label>เรื่องที่แจ้ง</label>
            <input className="inp" value={f.topic} placeholder="เช่น ขาดเรียนติดต่อกัน 3 วัน"
              onChange={(e) => set("topic", e.target.value)} /></div>

          <div className="field"><label>ผลการติดต่อ</label>
            <div className="opt-row">
              {PC_OUTCOME.map(([k, label, c]) => (
                <button key={k} className={`opt${f.outcome === k ? " on" : ""}`} onClick={() => set("outcome", k)}>
                  <i className="dot" style={{ background: c, display: "inline-block", marginRight: 7 }} />{label}
                </button>
              ))}
            </div>
          </div>

          <div className="field"><label>รายละเอียด</label>
            <textarea className="inp" value={f.note} placeholder="ผู้ปกครองแจ้งว่าอย่างไร ตกลงกันไว้ว่าอะไร"
              onChange={(e) => set("note", e.target.value)} /></div>

          <div className="field"><label>สิ่งที่ต้องทำต่อ <span className="hint">ใส่หรือไม่ใส่ก็ได้</span></label>
            <input className="inp" value={f.next_action} placeholder="เช่น นัดผู้ปกครองมาพบที่โรงเรียน"
              onChange={(e) => set("next_action", e.target.value)} /></div>

          <div className="field"><label>วันที่นัดหมาย</label>
            <input className="inp" type="date" style={{ width: "auto" }} value={f.next_on}
              onChange={(e) => set("next_on", e.target.value)} /></div>

          <button className="btn btn-primary btn-block btn-lg" disabled={!ok} onClick={() => onSave(f)}>
            {ok ? "บันทึกการติดต่อ" : "กรอกผู้ที่ติดต่อ เรื่อง และผลการติดต่อ"}
          </button>
        </>
      )}
    </Sheet>
  );
}

/* ==========================================================================
   PAGE — คะแนนความประพฤติ
   ========================================================================== */

function ConductPage({ student, scope, openStudent, scores, setScore, toast }) {
  const [mode, setMode] = useState(null);      // 'minus' | 'plus'
  const [cat, setCat] = useState(null);
  const [pts, setPts] = useState(null);
  const [result, setResult] = useState(null);
  const [rules, setRules] = useState(null);    // ระเบียบจากฐานข้อมูล ถ้ามี

  useEffect(() => {
    if (!LIVE) return;
    window.storage.get("conductrules")
      .then((r) => r?.value?.deduct?.length && setRules(r.value))
      .catch(() => {});
  }, []);

  if (!student) {
    return <StudentsPage scope={scope} openStudent={openStudent} title="คะแนนความประพฤติ"
      sub="เลือกนักเรียนเพื่อเพิ่มหรือตัดคะแนน ระบบจะบันทึกผู้ทำรายการและเวลาไว้เสมอ" />;
  }

  const cur = scores[student.id] ?? student.score;
  const cats = mode === "plus"
    ? (rules?.merit || MERIT_CATS)
    : (rules?.deduct || CONDUCT_CATS);
  const tone = cur >= 90 ? "var(--green)" : cur >= 80 ? "var(--yellow)" : cur >= 70 ? "var(--orange)" : "var(--red)";

  const deducted = 100 - cur;   // คะแนนที่ถูกตัดสะสมในภาคเรียนนี้

  const apply = (item, pts) => {
    const delta = mode === "plus" ? pts : -pts;
    const next = Math.max(0, Math.min(100, cur + delta));
    const before = deducted;
    const after = 100 - next;
    // ข้ามขั้นไหนบ้างตามข้อ 21
    const crossed = CONDUCT_THRESHOLDS.filter((t) => before < t.at && after >= t.at);

    setScore(student.id, next);
    save("conduct", {
      sid: student.id, category: cat.key, label: item.label,
      rule_code: item.code, points: delta,
    });
    setResult({ from: cur, to: next, item, delta, crossed, severe: !!item.severe });
    setCat(null); setMode(null); setPts(null);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">คะแนนความประพฤติ</h1>
          <p className="page-sub">{nameOf(student)} · {student.room} · เลขที่ {student.no}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => openStudent(null)}>เปลี่ยนนักเรียน</button>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="ring-wrap">
          <Ring value={cur} label="จาก 100" color={tone} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)" }}>
              {cur >= 90 ? "อยู่ในเกณฑ์ปกติ" : cur >= 80 ? "ควรติดตามอย่างใกล้ชิด" : cur >= 70 ? "ควรเข้าสู่กระบวนการช่วยเหลือ" : "ต้องดำเนินการตามระเบียบและแจ้งผู้ปกครอง"}
            </div>
            <p style={{ fontSize: 13.5, color: "var(--ink-mid)", margin: "6px 0 12px", maxWidth: "48ch", lineHeight: 1.6 }}>
              คะแนนเริ่มต้นภาคเรียนละ 100 คะแนน ถูกตัดสะสมแล้ว {deducted} คะแนน
              การตัดคะแนนต้องอ้างรหัสตามระเบียบและแจ้งนักเรียนทุกครั้ง
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <span className={`badge ${certGrade(deducted).cls}`}>
                <i className="dot" />ใบรับรองความประพฤติ: {certGrade(deducted).label}
              </span>
              {(() => {
                const nx = CONDUCT_THRESHOLDS.find((t) => deducted < t.at);
                return nx ? <span className="badge b-navy">อีก {nx.at - deducted} คะแนนถึงขั้น {nx.at}</span> : null;
              })()}
            </div>
            <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => setMode("plus")}>{I.plus} เพิ่มคะแนน</button>
              <button className="btn" onClick={() => setMode("minus")}>{I.minus} ตัดคะแนน</button>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Care mood={cur >= 90 ? "happy" : cur >= 75 ? "tracking" : "alert"} size={92} />
            <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4, maxWidth: 150 }}>
              {cur >= 90 ? "น้อง CARE บอกว่ารักษาไว้แบบนี้ได้เลย" : "น้อง CARE แนะนำให้บันทึกการช่วยเหลือควบคู่ไปด้วย"}
            </div>
          </div>
        </div>
      </div>

      <div className="sec-head"><h3 className="sec-title">ประวัติการบันทึกล่าสุด</h3></div>
      <div className="card">
        <div className="timeline">
          {BEHAVIOR_LOG.map((b, i) => (
            <div className="tl-item" key={i} style={{ color: b.color }}>
              <i className="tl-dot" />
              <div className="tl-date">{b.date} · บันทึกโดย {student.teacher}</div>
              <div className="tl-title">{b.title} <span>{b.delta > 0 ? `+${b.delta}` : b.delta}</span></div>
              <div className="tl-body">{b.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* เลือกหมวด */}
      <Sheet open={!!mode && !cat} onClose={() => setMode(null)}
        title={mode === "plus" ? "เพิ่มคะแนนความประพฤติ" : "ตัดคะแนนความประพฤติ"}
        sub="เลือกหมวดก่อน ระบบจะแสดงรายการตามระเบียบของโรงเรียน">
        <div className="cat-grid">
          {cats.map((c) => (
            <button className="cat" key={c.key} onClick={() => setCat(c)}>
              <div className="cat-e">{c.emoji}</div>
              <div className="cat-t">{c.label}</div>
            </button>
          ))}
        </div>
      </Sheet>

      {/* เลือกรายการ */}
      <Sheet open={!!cat} onClose={() => setCat(null)} title={cat ? `${cat.emoji} ${cat.label}` : ""} sub="เลือกรายการที่ตรงกับเหตุการณ์">
        {cat?.items.map((it) => {
          const range = it.max > it.min;
          return (
            <button key={it.code} className="fab-sheet-item"
              onClick={() => (range ? setPts(it) : apply(it, it.min))}>
              <span className="fab-ic" style={{
                background: it.severe ? "var(--red-bg)" : mode === "plus" ? "var(--green-bg)" : "var(--orange-bg)",
                color: it.severe ? "var(--red)" : mode === "plus" ? "var(--green)" : "var(--orange)",
                fontSize: 12, fontWeight: 700,
              }}>{it.code}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontWeight: 600, color: "var(--navy)", fontSize: 14.5, lineHeight: 1.4 }}>
                  {it.label}
                  {it.severe && <span className="badge b-red" style={{ marginLeft: 7, fontSize: 11 }}>ร้ายแรง</span>}
                </span>
                <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>
                  {mode === "plus"
                    ? (range ? `เพิ่ม ${it.min}–${it.max} คะแนน` : `เพิ่ม ${it.min} คะแนน`)
                    : `ตัด ${it.min} คะแนน · ${it.action || ""}`}
                </span>
              </span>
            </button>
          );
        })}
      </Sheet>

      {/* รายการที่ระเบียบให้เป็นช่วงคะแนน ครูเลือกตามความเหมาะสม */}
      <Sheet open={!!pts} onClose={() => setPts(null)} title={pts?.label}
        sub={`ระเบียบกำหนดไว้ ${pts?.min}–${pts?.max} คะแนน เลือกตามระดับความโดดเด่นของผลงาน`}>
        <div className="opt-row">
          {pts && Array.from(
            { length: Math.min(6, Math.floor((pts.max - pts.min) / 5) + 1) },
            (_, i) => pts.min + i * 5
          ).filter((v) => v <= pts.max).map((v) => (
            <button key={v} className="opt" onClick={() => apply(pts, v)}>{v} คะแนน</button>
          ))}
          {pts && pts.max % 5 !== 0 && (
            <button className="opt" onClick={() => apply(pts, pts.max)}>{pts.max} คะแนน</button>
          )}
        </div>
      </Sheet>

      {/* สำเร็จ */}
      <Sheet open={!!result} onClose={() => setResult(null)}>
        {result && (
          <div className="success-wrap">
            <div className="check-ring" style={{ color: "var(--green)" }}><Ic d={<path d="m5 12.5 4.5 4.5L19 7.5" />} size={34} /></div>
            <div style={{ fontSize: 17.5, fontWeight: 700, color: "var(--navy)" }}>บันทึกเรียบร้อย</div>
            <p style={{ fontSize: 13.5, color: "var(--ink-mid)", margin: "6px 0 0" }}>{result.label}</p>
            <div className="score-move"><span className="old">{result.from}</span>{I.arrow}<span style={{ color: result.delta > 0 ? "var(--green)" : "var(--orange)" }}>{result.to}</span></div>
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 8 }}>
              รหัส {result.item.code} · ถูกตัดสะสมแล้ว {100 - result.to} คะแนนในภาคเรียนนี้
            </p>

            {result.severe && (
              <div className="privacy" style={{ marginTop: 16, marginBottom: 0, background: "var(--red-bg)", color: "var(--red)", textAlign: "left" }}>
                {I.info}
                <span>
                  เป็นความผิดร้ายแรงตามข้อ 18.5 ต้องเสนอคณะกรรมการพิจารณาความประพฤตินักเรียน
                  ต่อผู้อำนวยการตั้งแต่การกระทำผิดครั้งแรก ระบบขึ้นเป็นรายการเร่งด่วนให้แล้ว
                </span>
              </div>
            )}

            {result.crossed.map((t) => (
              <div key={t.at} className="privacy" style={{ marginTop: 14, marginBottom: 0, background: "var(--orange-bg)", color: "var(--orange)", textAlign: "left" }}>
                {I.info}
                <span>ถูกตัดสะสมถึง {t.at} คะแนนแล้ว ตามระเบียบข้อ 21 ต้อง{t.action}</span>
              </div>
            ))}
            <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 18 }}
              onClick={() => {
                setResult(null);
                toast(result.delta > 0
                  ? "บันทึกคะแนนความดีให้แล้วครับ เรื่องแบบนี้ควรบอกนักเรียนด้วยนะครับ"
                  : "บันทึกแล้วครับ อย่าลืมแจ้งนักเรียนและบันทึกการช่วยเหลือควบคู่ไปด้วย",
                  result.delta > 0 ? "happy" : "tracking");
              }}>เสร็จสิ้น</button>
          </div>
        )}
      </Sheet>
    </>
  );
}

/* ==========================================================================
   PAGE — เยี่ยมบ้าน (Step Form)
   ========================================================================== */

function OptRow({ options, value, onChange }) {
  return (
    <div className="opt-row">
      {options.map((o) => (
        <button key={o} className={`opt${value === o ? " on" : ""}`} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

function DraftsResume({ scope, onOpen }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (!OFFLINE) return;
    window.offline.drafts.list().then((all) =>
      setRows((all || []).filter((d) => String(d.id).startsWith("visit:"))));
  }, []);
  if (rows.length === 0) return null;

  return (
    <>
      <div className="sec-head" style={{ marginTop: 0 }}>
        <h3 className="sec-title">กรอกค้างไว้ <span className="sec-count">{rows.length} รายการ</span></h3>
      </div>
      <div className="stu-grid" style={{ marginBottom: 6 }}>
        {rows.map((d) => {
          const sid = String(d.id).slice(6);
          const st = scope.find((x) => x.id === sid);
          const done = (d.data?.step || 0) + 1;
          return (
            <button className="stu" key={d.id} onClick={() => st && onOpen(st)} disabled={!st}>
              <span className="stu-ava" style={{ background: "linear-gradient(145deg,var(--yellow),var(--navy))" }}>{I.clock}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="stu-name" style={{ display: "block" }}>{d.data?.name || (st ? nameOf(st) : "นักเรียน")}</span>
                <span className="stu-meta" style={{ display: "block" }}>
                  {d.data?.room || st?.room} · กรอกถึงขั้นที่ {done} จาก 6
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 20 }}>
        ร่างเก็บอยู่ในเครื่องนี้เท่านั้น ยังไม่ถูกส่งเข้าระบบ เปิดต่อเพื่อกรอกให้ครบแล้วส่ง
      </p>
    </>
  );
}

const BLANK_VISIT = { live: "", income: "", house: "", own: "", util: "", travel: "", minutes: "", cost: "", found: "", risk: "", note: "", informant: "", photos: {} };

function HomeVisitPage({ student, scope, openStudent, toast, onDone }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState(BLANK_VISIT);
  const [sent, setSent] = useState(false);
  const [urls, setUrls] = useState({});
  const [extraFiles, setExtraFiles] = useState([]);
  const [resumed, setResumed] = useState(false);
  const [queued, setQueued] = useState(false);
  const net = useNet();
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const draftKey = student ? `visit:${student.id}` : null;

  // กู้ร่างที่กรอกค้างไว้ของนักเรียนคนนี้
  useEffect(() => {
    if (!OFFLINE || !draftKey) return;
    let alive = true;
    setF(BLANK_VISIT); setStep(0); setResumed(false);
    window.offline.drafts.get(draftKey).then((d) => {
      if (!alive || !d) return;
      setF({ ...BLANK_VISIT, ...d.form });
      setStep(d.step || 0);
      setResumed(true);
    });
    return () => { alive = false; };
  }, [draftKey]);

  // บันทึกร่างอัตโนมัติทุกครั้งที่กรอก ครูปิดแอปกลางทางก็ไม่หาย
  useEffect(() => {
    if (!OFFLINE || !draftKey || sent) return;
    const t = setTimeout(() => window.offline.drafts.save(draftKey, { form: f, step, name: student && nameOf(student), room: student?.room }), 500);
    return () => clearTimeout(t);
  }, [f, step, draftKey, sent, student]);

  const extras = useMemo(
    () => extraFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [extraFiles]
  );
  useEffect(() => () => extras.forEach((x) => URL.revokeObjectURL(x.url)), [extras]);
  const setExtras = setExtraFiles;

  // พรีวิวรูปจากไฟล์จริง
  useEffect(() => {
    const next = {};
    Object.entries(f.photos || {}).forEach(([k, file]) => { if (file) next[k] = URL.createObjectURL(file); });
    setUrls(next);
    return () => Object.values(next).forEach((u) => URL.revokeObjectURL(u));
  }, [f.photos]);

  const pickPhoto = (kind, file) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast("ไฟล์ใหญ่เกิน 8 MB ลองถ่ายใหม่ด้วยความละเอียดต่ำลง"); return; }
    setF((p) => ({ ...p, photos: { ...p.photos, [kind]: file } }));
  };
  const dropPhoto = (kind) => setF((p) => { const n = { ...p.photos }; delete n[kind]; return { ...p, photos: n }; });

  const addExtras = (fileList) => {
    const arr = Array.from(fileList || []).filter((x) => x && x.size <= 8 * 1024 * 1024);
    if (arr.length === 0) { toast("ไม่ได้เพิ่มภาพ ไฟล์อาจใหญ่เกิน 8 MB"); return; }
    setExtras((p) => [...p, ...arr.slice(0, 8 - p.length)].slice(0, 8));
  };
  const dropExtra = (i) => setExtras((p) => p.filter((_, k) => k !== i));

  const submitVisit = async () => {
    const photos = [
      ...Object.entries(f.photos || {}).map(([kind, file]) => ({ kind: kind === "home" ? "outside" : kind, file })),
      ...extraFiles.map((file) => ({ kind: "extra", file })),
    ];
    let r = { queued: false };
    if (OFFLINE) {
      r = await window.offline.submit("homevisit", { ...f, sid: student.id, utilities: f.util ? [f.util] : null, submit: true }, photos);
    } else {
      save("homevisit", { ...f, sid: student.id, submit: true });
    }
    if (OFFLINE && draftKey) window.offline.drafts.remove(draftKey);
    setQueued(!!r.queued);
    setSent(true);
    toast(r.queued ? "บันทึกไว้ในเครื่องแล้ว" : "ส่งข้อมูลการเยี่ยมบ้านแล้ว");
  };

  if (!student) {
    return (
      <>
        <DraftsResume scope={scope} onOpen={openStudent} />
        <StudentsPage scope={scope} openStudent={openStudent} title="เยี่ยมบ้าน"
          sub="เลือกนักเรียนเพื่อเริ่มบันทึกการเยี่ยมบ้าน กรอกบนมือถือได้สะดวก ระบบบันทึกร่างให้อัตโนมัติทุกขั้นตอน" />
      </>
    );
  }

  if (sent) {
    return (
      <div className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
        <div className="success-wrap">
          <Care mood={queued ? "waiting" : "success"} size={118} />
          <div style={{ fontSize: 19, fontWeight: 700, color: "var(--navy)", marginTop: 8 }}>
            {queued ? "บันทึกไว้ในเครื่องแล้ว" : "ส่งข้อมูลการเยี่ยมบ้านแล้ว"}
          </div>
          <p style={{ fontSize: 13.5, color: "var(--ink-mid)", margin: "8px 0 0" }}>
            {queued
              ? `ตอนนี้ไม่มีสัญญาณ ข้อมูลของ ${nameOf(student)} พร้อมรูปถูกเก็บไว้ในเครื่องแล้ว ระบบจะส่งเองอัตโนมัติเมื่อกลับเข้าพื้นที่มีสัญญาณ ปิดแอปได้เลย`
              : `บันทึกของ ${nameOf(student)} ถูกส่งให้หัวหน้าระดับตรวจสอบ และเพิ่มเข้าสรุปการเยี่ยมบ้านของห้อง ${student.room} แล้ว`}
          </p>
          <div style={{ display: "flex", gap: 9, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => { setSent(false); setStep(0); openStudent(null); }}>เยี่ยมบ้านคนต่อไป</button>
            <button className="btn" onClick={() => onDone(student)}>ดู Student 360°</button>
          </div>
        </div>
      </div>
    );
  }

  const canNext = [
    f.live && f.income,
    f.house && f.own,
    f.travel && f.minutes,
    f.found,
    true,
    f.risk,
  ][step];

  const panes = [
    <div key="0">
      <div className="field"><label>นักเรียนพักอาศัยอยู่กับใคร</label>
        <OptRow options={["บิดามารดา", "บิดา", "มารดา", "ญาติ", "หอพัก/อื่น ๆ"]} value={f.live} onChange={(v) => set("live", v)} /></div>
      <div className="field"><label>ความเพียงพอของรายได้ครัวเรือน</label>
        <OptRow options={["เพียงพอและเหลือเก็บ", "เพียงพอ", "ไม่เพียงพอ", "ไม่เพียงพอและมีหนี้สิน"]} value={f.income} onChange={(v) => set("income", v)} /></div>
      <div className="field"><label>ผู้ให้ข้อมูล <span className="hint">ระบุชื่อและความเกี่ยวข้อง</span></label>
        <input className="inp" placeholder="เช่น นางสมศรี ใจดี (ยาย)"
          value={f.informant} onChange={(e) => set("informant", e.target.value)} /></div>
    </div>,
    <div key="1">
      <div className="field"><label>ลักษณะที่อยู่อาศัย</label>
        <OptRow options={["บ้านไม้", "บ้านปูน", "บ้านครึ่งตึกครึ่งไม้", "ห้องเช่า/หอพัก"]} value={f.house} onChange={(v) => set("house", v)} /></div>
      <div className="field"><label>กรรมสิทธิ์</label>
        <OptRow options={["บ้านของตนเอง", "บ้านญาติ", "บ้านเช่า"]} value={f.own} onChange={(v) => set("own", v)} /></div>
      <div className="field"><label>สาธารณูปโภคที่มี</label>
        <OptRow options={["ไฟฟ้า", "น้ำประปา", "อินเทอร์เน็ตบ้าน", "ไม่มีอินเทอร์เน็ต"]} value={f.util} onChange={(v) => set("util", v)} /></div>
    </div>,
    <div key="2">
      <div className="field"><label>วิธีเดินทางมาโรงเรียน</label>
        <OptRow options={["เดิน", "จักรยาน", "รถรับส่ง", "รถโดยสาร", "ผู้ปกครองรับส่ง"]} value={f.travel} onChange={(v) => set("travel", v)} /></div>
      <div className="field"><label>ระยะเวลาเดินทาง</label>
        <OptRow options={["ไม่เกิน 15 นาที", "15–30 นาที", "30–60 นาที", "มากกว่า 1 ชั่วโมง"]} value={f.minutes} onChange={(v) => set("minutes", v)} /></div>
      <div className="field"><label>ค่าเดินทางต่อวัน <span className="hint">ไม่มีให้ใส่ 0</span></label>
        <input className="inp" placeholder="บาท" value={f.cost} onChange={(e) => set("cost", e.target.value)} /></div>
    </div>,
    <div key="3">
      <div className="field"><label>สิ่งที่ครูพบจากการเยี่ยมบ้าน</label>
        <textarea className="inp" placeholder="บันทึกสิ่งที่สังเกตเห็นตามความเป็นจริง หลีกเลี่ยงการตัดสินหรือคาดเดา"
          value={f.found} onChange={(e) => set("found", e.target.value)} /></div>
      <div className="field"><label>ประเด็นที่ควรติดตามต่อ</label>
        <OptRow options={["ด้านเศรษฐกิจ", "ด้านการเรียน", "ด้านสุขภาพ", "ด้านการดูแลจากครอบครัว", "ไม่มี"]} value={f.note} onChange={(v) => set("note", v)} /></div>
      <div className="privacy">{I.shield}
        <span>บันทึกนี้เป็นข้อมูลส่วนบุคคลของนักเรียน เห็นได้เฉพาะครูที่ปรึกษาของห้อง หัวหน้าระดับ และฝ่ายกิจการนักเรียนเท่านั้น</span></div>
    </div>,
    <div key="4">
      <div className="photo-grid">
        {[["home", "🏠", "ภายนอกบ้าน", "ให้เห็นสภาพบ้านโดยรวม"],
          ["inside", "🛋", "ภายในบ้าน", "มุมที่นักเรียนใช้อ่านหนังสือ"]].map(([k, e, t, a]) => {
          const file = f.photos[k];
          return (
            <div key={k} className={`photo-slot${file ? " filled" : ""}`}>
              {file
                ? <div className="photo-thumb" style={{ backgroundImage: `url(${urls[k]})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                : <div className="photo-emoji">{e}</div>}
              <div className="photo-t">{t}</div>
              <div className="photo-a">{file ? `${Math.round(file.size / 1024)} KB` : a}</div>

              {file ? (
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}
                  onClick={() => dropPhoto(k)}>ลบภาพนี้</button>
              ) : (
                <div className="photo-pick">
                  <label className="btn btn-sm btn-primary" style={{ cursor: "pointer" }}>
                    {I.camera} ถ่ายภาพ
                    <input type="file" accept="image/*" capture="environment" style={{ display: "none" }}
                      onChange={(ev) => { pickPhoto(k, ev.target.files?.[0]); ev.target.value = ""; }} />
                  </label>
                  <label className="btn btn-sm" style={{ cursor: "pointer" }}>
                    เลือกจากคลัง
                    <input type="file" accept="image/*" style={{ display: "none" }}
                      onChange={(ev) => { pickPhoto(k, ev.target.files?.[0]); ev.target.value = ""; }} />
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 8 }}>
          📷 ภาพเพิ่มเติม {extras.length > 0 && <span className="badge b-pink">{extras.length} ภาพ</span>}
        </div>
        {extras.length > 0 && (
          <div className="photo-grid" style={{ marginBottom: 10 }}>
            {extras.map((x, i) => (
              <div key={i} className="photo-slot filled">
                <div className="photo-thumb" style={{ backgroundImage: `url(${x.url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div className="photo-a">{Math.round(x.file.size / 1024)} KB</div>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }}
                  onClick={() => dropExtra(i)}>ลบ</button>
              </div>
            ))}
          </div>
        )}
        <div className="photo-pick" style={{ marginTop: 0 }}>
          <label className="btn btn-sm btn-primary" style={{ cursor: "pointer" }}>
            {I.camera} ถ่ายเพิ่ม
            <input type="file" accept="image/*" capture="environment" style={{ display: "none" }}
              onChange={(ev) => { addExtras(ev.target.files); ev.target.value = ""; }} />
          </label>
          <label className="btn btn-sm" style={{ cursor: "pointer" }}>
            เลือกจากคลัง (เลือกหลายภาพได้)
            <input type="file" accept="image/*" multiple style={{ display: "none" }}
              onChange={(ev) => { addExtras(ev.target.files); ev.target.value = ""; }} />
          </label>
        </div>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 14 }}>
        ขอความยินยอมจากผู้ปกครองก่อนถ่ายภาพทุกครั้ง และไม่ถ่ายภาพที่ระบุตัวบุคคลอื่นในบ้านโดยไม่จำเป็น
      </p>
    </div>,
    <div key="5">
      <div className="field"><label>สรุปการจัดกลุ่มนักเรียน</label>
        <div className="opt-row">
          {Object.values(STATUS).map((s) => (
            <button key={s.key} className={`opt${f.risk === s.key ? " on" : ""}`} onClick={() => set("risk", s.key)}>
              <i className="dot" style={{ background: s.color, display: "inline-block", marginRight: 7 }} />{s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="card" style={{ background: "var(--cream)", boxShadow: "none", marginTop: 6 }}>
        <div style={{ fontWeight: 600, color: "var(--navy)", marginBottom: 10, fontSize: 14.5 }}>ตรวจทานก่อนส่ง</div>
        <div className="kv"><span className="kv-k">นักเรียน</span><span className="kv-v">{nameOf(student)} · {student.room}</span></div>
        <div className="kv"><span className="kv-k">พักอาศัยกับ</span><span className="kv-v">{f.live || "-"}</span></div>
        <div className="kv"><span className="kv-k">รายได้ครัวเรือน</span><span className="kv-v">{f.income || "-"}</span></div>
        <div className="kv"><span className="kv-k">ที่อยู่อาศัย</span><span className="kv-v">{[f.house, f.own].filter(Boolean).join(" · ") || "-"}</span></div>
        <div className="kv"><span className="kv-k">การเดินทาง</span><span className="kv-v">{[f.travel, f.minutes].filter(Boolean).join(" · ") || "-"}</span></div>
        <div className="kv"><span className="kv-k">ภาพที่แนบ</span><span className="kv-v">{Object.values(f.photos).filter(Boolean).length + extraFiles.length} ภาพ</span></div>
      </div>
    </div>,
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">เยี่ยมบ้าน</h1>
          <p className="page-sub">{nameOf(student)} · {student.room} · ขั้นที่ {step + 1} จาก 6</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => openStudent(null)}>เปลี่ยนนักเรียน</button>
      </div>

      {resumed && (
        <div className="privacy" style={{ marginTop: 0, marginBottom: 14, background: "var(--yellow-bg)", color: "var(--yellow)" }}>
          {I.info}<span>กู้ข้อมูลที่กรอกค้างไว้ให้แล้ว กรอกต่อจากขั้นที่ {step + 1} ได้เลย</span>
        </div>
      )}
      {!net.online && (
        <div className="privacy" style={{ marginTop: 0, marginBottom: 14, background: "var(--orange-bg)", color: "var(--orange)" }}>
          {I.info}<span>ตอนนี้ไม่มีสัญญาณ กรอกต่อได้ตามปกติ ทุกอย่างเก็บไว้ในเครื่องและจะส่งเองเมื่อสัญญาณกลับมา</span>
        </div>
      )}

      <div className="steps">
        {HV_STEPS.map((lab, i) => (
          <React.Fragment key={lab}>
            {i > 0 && <span className={`step-line${i <= step ? " done" : ""}`} />}
            <div className={`step-node${i === step ? " on" : i < step ? " done" : ""}`}>
              <div className="step-ball">{i < step ? "✓" : i + 1}</div>
              <div className="step-lab">{lab}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="card">
        <div style={{ fontSize: 16.5, fontWeight: 700, color: "var(--navy)", marginBottom: 16 }}>{HV_STEPS[step]}</div>
        {panes[step]}
        <div style={{ display: "flex", gap: 9, marginTop: 22, justifyContent: "space-between" }}>
          <button className="btn btn-ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>{I.back} ย้อนกลับ</button>
          {step < 5 ? (
            <button className="btn btn-primary" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
              ถัดไป {I.arrow}
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" disabled={!canNext}
              onClick={submitVisit}>
              {net.online ? "ส่งข้อมูลการเยี่ยมบ้าน" : "บันทึกไว้ในเครื่อง"}
            </button>
          )}
        </div>
        {!canNext && <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 12 }}>กรอกข้อมูลในขั้นนี้ให้ครบก่อนจึงไปขั้นถัดไปได้</p>}
      </div>
    </>
  );
}

/* ==========================================================================
   PAGE — การช่วยเหลือ (Case)
   ========================================================================== */

const CASE_TYPES = ["เศรษฐกิจ", "การเรียน", "พฤติกรรม", "สุขภาพ", "สุขภาพจิต", "ความปลอดภัย", "อื่น ๆ"];

function CasesPage({ scope, cases, setCases, toast, openStudent, seedStudent }) {
  const [sel, setSel] = useState(null);
  const [nw, setNw] = useState(null);   // ฟอร์มเปิด Case ใหม่
  const [q, setQ] = useState("");

  useEffect(() => {
    if (seedStudent) setNw({ sid: seedStudent.id, title: "", type: "", prio: "watch", note: "" });
  }, [seedStudent]);

  const openNew = () => setNw({ sid: "", title: "", type: "", prio: "watch", note: "" });

  const createCase = async () => {
    const stu = scope.find((x) => x.id === nw.sid);
    const row = {
      id: `local-${Date.now()}`, sid: nw.sid, title: nw.title.trim(), type: nw.type,
      stage: "new", prio: nw.prio, owner: "คุณ", note: nw.note.trim(), updated: "เมื่อสักครู่",
    };
    setCases((p) => [row, ...p]);
    await save("cases", { sid: nw.sid, title: row.title, type: row.type, prio: row.prio, note: row.note });
    setNw(null);
    toast(`เปิด Case ให้ ${stu ? nameOf(stu) : "นักเรียน"} แล้วครับ อย่าลืมบันทึกความคืบหน้าภายใน 7 วันนะครับ`, "tracking");
  };

  const nwValid = nw && nw.sid && nw.title.trim().length >= 4 && nw.type;
  const mine = cases.filter((c) => scope.some((s) => s.id === c.sid));

  const move = (id, stage) => {
    setCases((p) => p.map((c) => (c.id === id ? { ...c, stage, updated: "เมื่อสักครู่" } : c)));
    save("cases", { id, stage, log: "ย้ายสถานะจากหน้าบอร์ด" });
    setSel(null);
    toast("อัปเดตสถานะ Case แล้ว");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">การช่วยเหลือ</h1>
          <p className="page-sub">{mine.filter((c) => c.stage !== "closed").length} Case ที่ยังดำเนินการอยู่ — เลือก Case เพื่อบันทึกความคืบหน้า</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>{I.plus} เปิด Case ใหม่</button>
      </div>

      {mine.length === 0 ? (
        <div className="card"><Empty mood="empty" title="ยังไม่มี Case ที่รอคุณดำเนินการ" desc="เมื่อพบนักเรียนที่ต้องการความช่วยเหลือ เปิด Case เพื่อให้ทีมติดตามร่วมกันได้" /></div>
      ) : (
        <div className="board">
          {CASE_STAGES.filter((st) => st.key !== "closed").map((st) => {
            const list = mine.filter((c) => c.stage === st.key);
            return (
              <div key={st.key}>
                <div className="col-head">
                  <i className="dot" style={{ background: st.color, width: 9, height: 9 }} />
                  <h4>{st.label}</h4><span className="col-n">{list.length}</span>
                </div>
                {list.length === 0 ? (
                  <div style={{ border: "1.5px dashed var(--line)", borderRadius: 18, padding: "22px 14px", textAlign: "center", fontSize: 12.5, color: "var(--ink-soft)" }}>
                    ไม่มีรายการ
                  </div>
                ) : list.map((c) => {
                  const stu = STUDENTS.find((s) => s.id === c.sid);
                  return (
                    <button className="case" key={c.id} onClick={() => setSel(c)}>
                      <span className={`badge ${STATUS[c.prio].cls}`} style={{ marginBottom: 8 }}><i className="dot" />{c.type}</span>
                      <div className="case-t">{c.title}</div>
                      <div className="case-m">{stu ? `${nameOf(stu)} · ${stu.room}` : ""}</div>
                      <div className="case-d">{c.note}</div>
                      <div className="case-f">{I.clock} {c.updated} · {c.owner.split(" ")[0]}</div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      <div className="sec-head"><h3 className="sec-title">ยุติแล้วในเดือนนี้</h3></div>
      <div className="stu-grid stagger">
        {mine.filter((c) => c.stage === "closed").map((c) => {
          const stu = STUDENTS.find((s) => s.id === c.sid);
          return (
            <div className="card" key={c.id} style={{ padding: 16 }}>
              <span className="badge b-green" style={{ marginBottom: 8 }}><i className="dot" />ยุติแล้ว</span>
              <div className="case-t">{c.title}</div>
              <div className="case-m">{stu ? `${nameOf(stu)} · ${stu.room}` : ""}</div>
              <div className="case-d">{c.note}</div>
            </div>
          );
        })}
      </div>

      <Sheet open={!!nw} onClose={() => setNw(null)} title="เปิด Case ช่วยเหลือใหม่"
        sub="เปิดเมื่อเรื่องนั้นต้องติดตามต่อเนื่อง ไม่ใช่ทุกเรื่องที่พบต้องเปิด Case">
        {nw && (
          <>
            <div className="field">
              <label>นักเรียน</label>
              {nw.sid ? (
                <div className="opt on" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  {(() => { const st = scope.find((x) => x.id === nw.sid); return st ? `${nameOf(st)} · ${st.room}` : ""; })()}
                  <span onClick={() => setNw((p) => ({ ...p, sid: "" }))} style={{ cursor: "pointer" }}>×</span>
                </div>
              ) : (
                <>
                  <div className="search" style={{ boxShadow: "none", border: "1.5px solid var(--line)", marginBottom: 8 }}>
                    {I.search}<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="พิมพ์ชื่อนักเรียน" />
                  </div>
                  <div style={{ maxHeight: 190, overflow: "auto" }}>
                    {scope.filter((x) => q.length >= 1 && (nameOf(x).includes(q) || x.room.includes(q)))
                      .slice(0, 8).map((x) => (
                        <button key={x.id} className="fab-sheet-item" onClick={() => { setNw((p) => ({ ...p, sid: x.id })); setQ(""); }}>
                          <span className="fab-ic" style={{ background: STATUS[x.status].bg, color: STATUS[x.status].color }}>
                            {initialOf(x)}
                          </span>
                          <span style={{ flex: 1 }}>
                            <span style={{ display: "block", fontWeight: 600, color: "var(--navy)", fontSize: 14.5 }}>{nameOf(x)}</span>
                            <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-soft)" }}>{x.room} · {STATUS[x.status].label}</span>
                          </span>
                        </button>
                      ))}
                    {q.length >= 1 && scope.filter((x) => nameOf(x).includes(q)).length === 0 && (
                      <p style={{ fontSize: 13, color: "var(--ink-soft)", padding: "8px 2px" }}>ไม่พบนักเรียนที่ตรงกับคำค้น</p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="field">
              <label>เรื่อง <span className="hint">สั้น ๆ ให้ทีมเข้าใจตรงกัน</span></label>
              <input className="inp" value={nw.title} placeholder="เช่น ภาระค่าใช้จ่ายในครอบครัว"
                onChange={(e) => setNw((p) => ({ ...p, title: e.target.value }))} />
            </div>

            <div className="field">
              <label>ประเภท</label>
              <OptRow options={CASE_TYPES} value={nw.type} onChange={(v) => setNw((p) => ({ ...p, type: v }))} />
            </div>

            <div className="field">
              <label>ระดับความเร่งด่วน</label>
              <div className="opt-row">
                {["watch", "help", "urgent"].map((k) => (
                  <button key={k} className={`opt${nw.prio === k ? " on" : ""}`} onClick={() => setNw((p) => ({ ...p, prio: k }))}>
                    <i className="dot" style={{ background: STATUS[k].color, display: "inline-block", marginRight: 7 }} />
                    {STATUS[k].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>สภาพปัญหาและสิ่งที่ตั้งใจจะทำ</label>
              <textarea className="inp" value={nw.note} placeholder="บันทึกตามข้อเท็จจริง และระบุสิ่งที่จะทำเป็นขั้นแรก"
                onChange={(e) => setNw((p) => ({ ...p, note: e.target.value }))} />
            </div>

            <button className="btn btn-primary btn-block btn-lg" disabled={!nwValid} onClick={createCase}>
              {nwValid ? "เปิด Case" : "กรอกนักเรียน เรื่อง และประเภทให้ครบ"}
            </button>
          </>
        )}
      </Sheet>

      <Sheet open={!!sel} onClose={() => setSel(null)} title={sel?.title} sub={sel ? `${sel.type} · ผู้ดูแล ${sel.owner}` : ""}>
        {sel && (
          <>
            <div className="card" style={{ background: "var(--cream)", boxShadow: "none", marginBottom: 16 }}>
              <div style={{ fontSize: 13.5, color: "var(--ink-mid)", lineHeight: 1.6 }}>{sel.note}</div>
            </div>
            <div className="field"><label>บันทึกความคืบหน้าวันนี้</label>
              <textarea className="inp" placeholder="สิ่งที่ทำ ผลที่เกิดขึ้น และสิ่งที่จะทำต่อ" /></div>
            <div className="field"><label>ย้ายสถานะไปที่</label>
              <div className="opt-row">
                {CASE_STAGES.filter((s) => s.key !== sel.stage).map((s) => (
                  <button key={s.key} className="opt" onClick={() => move(sel.id, s.key)}>{s.label}</button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary btn-block" onClick={() => { setSel(null); toast("บันทึกความคืบหน้าแล้ว"); }}>บันทึกความคืบหน้า</button>
          </>
        )}
      </Sheet>
    </>
  );
}

/* ==========================================================================
   PAGE — รายงานและ Analytics (มี Drill Down)
   ========================================================================== */

function ReportsPage({ scope, role, openStudent }) {
  const [level, setLevel] = useState(null);
  const [room, setRoom] = useState(null);

  const inLevel = level ? scope.filter((s) => s.level === level) : scope;
  const inRoom = room ? inLevel.filter((s) => s.room === room) : inLevel;
  const cur = inRoom;

  const visited = cur.filter((s) => s.visited).length;
  const pct = Math.round((visited / (cur.length || 1)) * 100);

  const levels = [...new Set(scope.map((s) => s.level))];
  const rooms = level ? [...new Set(scope.filter((s) => s.level === level).map((s) => s.room))] : [];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">รายงานและสถิติ</h1>
          <p className="page-sub">เจาะลึกจากภาพรวมโรงเรียนลงไปถึงรายบุคคล ข้อมูลจำกัดตามสิทธิ์ของคุณ</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-sm" onClick={() => exportCSV("care360-students", cur.map((s) => ({
            เลขที่: s.no, ชื่อ: s.first, สกุล: s.last, ห้อง: s.room,
            สถานะ: STATUS[s.status].label, คะแนนความประพฤติ: s.score,
            เยี่ยมบ้าน: s.visited ? "แล้ว" : "ยังไม่ได้เยี่ยม", ครูที่ปรึกษา: s.teacher,
          })))}>{I.doc} ส่งออก Excel</button>
          <button className="btn btn-sm" onClick={() => window.print()}>พิมพ์รายงาน</button>
        </div>
      </div>

      <div className="drill">
        <button onClick={() => { setLevel(null); setRoom(null); }}>{role.all ? "ทั้งโรงเรียน" : "ขอบเขตของฉัน"}</button>
        {level && <>›<button onClick={() => setRoom(null)}>{level}</button></>}
        {room && <>›<span style={{ color: "var(--navy)", fontWeight: 600 }}>{room}</span></>}
        {!level && <span>· เลือกระดับชั้นด้านล่างเพื่อเจาะลึก</span>}
      </div>

      <div className="stat-grid stagger">
        <div className="stat" style={{ cursor: "default" }}>
          <div className="stat-ic" style={{ background: "var(--navy-soft)", color: "var(--navy)" }}>{I.users}</div>
          <div className="stat-num">{cur.length.toLocaleString("th-TH")} <small>คน</small></div>
          <div className="stat-lab">นักเรียนในขอบเขตนี้</div>
        </div>
        <div className="stat" style={{ cursor: "default" }}>
          <div className="stat-ic" style={{ background: "var(--green-bg)", color: "var(--green)" }}>{I.house}</div>
          <div className="stat-num">{pct}%</div>
          <div className="stat-lab">เยี่ยมบ้านแล้ว {visited} คน</div>
          <div style={{ marginTop: 10 }} className="pbar"><i style={{ width: `${pct}%`, background: "var(--green)" }} /></div>
        </div>
        <div className="stat" style={{ cursor: "default" }}>
          <div className="stat-ic" style={{ background: "var(--yellow-bg)", color: "var(--yellow)" }}>{I.bell}</div>
          <div className="stat-num">{cur.filter((s) => s.status !== "normal").length} <small>คน</small></div>
          <div className="stat-lab">อยู่ในกลุ่มที่ต้องดูแล</div>
        </div>
        <div className="stat" style={{ cursor: "default" }}>
          <div className="stat-ic" style={{ background: "var(--pink-mist)", color: "var(--pink)" }}>{I.star}</div>
          <div className="stat-num">{Math.round(cur.reduce((a, s) => a + s.score, 0) / (cur.length || 1))}</div>
          <div className="stat-lab">คะแนนความประพฤติเฉลี่ย</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--navy)", marginBottom: 14 }}>สถานะการดูแลนักเรียน</div>
          <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
            <Donut data={statusData(cur)} />
            <div className="legend" style={{ flex: 1, minWidth: 170 }}>
              {statusData(cur).map((d) => (
                <div className="leg" key={d.label}><i className="leg-sw" style={{ background: d.color }} />{d.label}<b>{d.value}</b></div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--navy)", marginBottom: 16 }}>
            {room ? "เปรียบเทียบห้องในระดับชั้น" : level ? "ความคืบหน้าการเยี่ยมบ้านรายห้อง" : "ความคืบหน้าการเยี่ยมบ้านรายระดับชั้น"}
          </div>
          <HBars rows={level
            ? rooms.map((r) => {
                const g = scope.filter((s) => s.room === r);
                const p = Math.round((g.filter((s) => s.visited).length / (g.length || 1)) * 100);
                return { label: r, value: p, color: p >= 85 ? "var(--green)" : p >= 70 ? "var(--yellow)" : "var(--orange)" };
              })
            : visitByLevel(scope)} />
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>แนวโน้มการดูแลรายเดือน</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
          <span className="leg"><i className="leg-sw" style={{ background: "var(--pink)" }} />Case ที่เปิดใหม่</span>
          <span className="leg"><i className="leg-sw" style={{ background: "var(--green)" }} />Case ที่ยุติแล้ว</span>
        </div>
        <LineChart
          labels={["พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย."]}
          series={[
            { color: "var(--pink)", points: [6, 11, 9, 14, 8] },
            { color: "var(--green)", points: [2, 5, 8, 9, 11] },
          ]} />
      </div>

      {!level && (
        <>
          <div className="sec-head"><h3 className="sec-title">เจาะลึกรายระดับชั้น</h3></div>
          <div className="chips">
            {levels.map((l) => <button key={l} className="chip" onClick={() => setLevel(l)}>{l} {I.arrow}</button>)}
          </div>
        </>
      )}
      {level && !room && (
        <>
          <div className="sec-head"><h3 className="sec-title">เจาะลึกรายห้อง</h3></div>
          <div className="chips">
            {rooms.map((r) => <button key={r} className="chip" onClick={() => setRoom(r)}>{r} {I.arrow}</button>)}
          </div>
        </>
      )}
      {room && (
        <>
          <div className="sec-head"><h3 className="sec-title">นักเรียนที่ต้องดูแลในห้อง {room}</h3></div>
          {cur.filter((s) => s.status !== "normal").length === 0 ? (
            <div className="card"><Empty mood="happy" title={`ห้อง ${room} อยู่ในเกณฑ์ปกติทั้งห้อง`} desc="ยังไม่มีนักเรียนที่ต้องติดตามเป็นพิเศษในขณะนี้" /></div>
          ) : (
            <div className="stu-grid stagger">
              {cur.filter((s) => s.status !== "normal").map((s) => (
                <button className="stu" key={s.id} onClick={() => openStudent(s)}>
                  <span className="stu-ava" style={{ background: `linear-gradient(145deg,${STATUS[s.status].color},var(--navy))` }}>{initialOf(s)}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="stu-name" style={{ display: "block" }}>{nameOf(s)}</span>
                    <span className="stu-meta" style={{ display: "block" }}>เลขที่ {s.no} · {STATUS[s.status].label}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

/* ==========================================================================
   PAGE — ตั้งค่า
   ========================================================================== */

function SettingsPage({ role, onRole, toast }) {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">ตั้งค่า</h1>
          <p className="page-sub">บัญชีผู้ใช้ สิทธิ์การเข้าถึง และการแจ้งเตือน</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>สิทธิ์การเข้าถึงข้อมูล</div>
        <p style={{ fontSize: 13.5, color: "var(--ink-mid)", margin: "0 0 16px", maxWidth: "58ch" }}>
          ขอบเขตข้อมูลกำหนดจากบทบาทของผู้ใช้ และบังคับที่ฐานข้อมูลด้วย Row Level Security ไม่ใช่การซ่อนที่หน้าจอ
          ในต้นแบบนี้สลับบทบาทเพื่อดูว่าผู้ใช้แต่ละกลุ่มเห็นข้อมูลต่างกันอย่างไร
        </p>
        {LIVE && (
          <div className="privacy" style={{ marginTop: 0, marginBottom: 14 }}>{I.info}
            <span>บทบาทของคุณคือ {role.title} กำหนดโดยผู้ดูแลระบบ เปลี่ยนเองจากหน้านี้ไม่ได้</span></div>
        )}
        <div className="role-pick" style={{ opacity: LIVE ? .5 : 1, pointerEvents: LIVE ? "none" : "auto" }}>
          {ROLES.map((r) => (
            <button key={r.key} className={`role${role.key === r.key ? " on" : ""}`} onClick={() => onRole(r)}>
              <span className="avatar">{r.name.replace(/^(นาย|นาง|นางสาว)/, "").slice(0, 1)}</span>
              <span style={{ flex: 1 }}>
                <span className="role-t" style={{ display: "block" }}>{r.title}</span>
                <span className="role-d" style={{ display: "block" }}>{r.scope}</span>
              </span>
              {role.key === r.key && <span className="badge b-pink">กำลังใช้</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 12 }}>การแจ้งเตือน</div>
        {[["สรุปรายการที่ต้องดูแลทุกเช้า 07.30 น.", true],
          ["แจ้งทันทีเมื่อมีนักเรียนเข้ากลุ่มเร่งด่วน", true],
          ["เตือนเมื่อ Case ไม่มีความคืบหน้าเกิน 7 วัน", true],
          ["สรุปความคืบหน้าการเยี่ยมบ้านรายสัปดาห์", false]].map(([t, on]) => (
          <label key={t} className="kv" style={{ cursor: "pointer" }}>
            <span className="kv-k" style={{ color: "var(--ink)", fontSize: 14 }}>{t}</span>
            <input type="checkbox" defaultChecked={on} onChange={() => toast("บันทึกการตั้งค่าแล้ว")} />
          </label>
        ))}
      </div>

      <div className="card">
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 10 }}>ความเป็นส่วนตัวของข้อมูลนักเรียน</div>
        <div className="privacy" style={{ marginTop: 0 }}>{I.shield}
          <span>
            ระบบนี้เก็บข้อมูลอ่อนไหวของนักเรียน จึงไม่มีโหมดเปิดดูโดยไม่ล็อกอิน และไม่มีการสร้างลิงก์สาธารณะ
            ทุกการเข้าดูและแก้ไขถูกบันทึกไว้ว่าใครทำอะไรเมื่อใด หากต้องการเผยแพร่สถิติสู่ภายนอก ให้ใช้รายงานสรุปที่ไม่ระบุตัวบุคคลเท่านั้น
          </span>
        </div>
      </div>
    </>
  );
}

/* ==========================================================================
   LOGIN
   ========================================================================== */

function Login({ onLogin }) {
  const [role, setRole] = useState(ROLES[2]);
  const [email, setEmail] = useState(LIVE ? "" : "pratompong@tupkln.ac.th");
  const [pw, setPw] = useState(LIVE ? "" : "••••••••");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!LIVE) return onLogin(role);
    setErr(""); setBusy(true);
    try {
      await window.auth.signIn(email.trim(), pw);
      onLogin(null); // ดึงโปรไฟล์จริงจาก window.storage.get('me') ในขั้นตอน boot
    } catch (e) {
      setErr(e.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally { setBusy(false); }
  };

  return (
    <div className="login-wrap">
      <div className="login">
        <div className="login-art">
          <div style={{ position: "relative", zIndex: 1 }}>
            <Care mood="idle" size={106} />
            <h2 style={{ fontSize: 22, margin: "16px 0 6px", fontWeight: 700 }}>TUPKLN CARE 360</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", margin: 0, lineHeight: 1.6 }}>
              ระบบดูแลช่วยเหลือนักเรียน<br />โรงเรียนเตรียมอุดมศึกษาพัฒนาการเขลางค์นคร
            </p>
          </div>
          <div style={{ position: "relative", zIndex: 1, fontSize: 12.5, color: "rgba(255,255,255,.68)", lineHeight: 1.6 }}>
            ข้อมูลนักเรียนเป็นข้อมูลส่วนบุคคล เข้าถึงได้เฉพาะผู้ที่ได้รับมอบหมายเท่านั้น
          </div>
        </div>

        <div className="login-form">
          <h1>เข้าสู่ระบบ</h1>
          <p className="lead">ใช้อีเมลของโรงเรียนที่ได้รับสิทธิ์</p>

          <div className="field"><label>อีเมล</label>
            <input className="inp" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="field"><label>รหัสผ่าน</label>
            <input className="inp" type="password" value={pw} onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()} /></div>

          {err && (
            <div className="badge b-red" style={{ marginBottom: 14, padding: "9px 14px", lineHeight: 1.5 }}>
              {I.info} {err}
            </div>
          )}

          {!LIVE && (
            <>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--navy)", margin: "6px 0 8px" }}>
                ต้นแบบนี้ให้เลือกบทบาทเพื่อทดลองขอบเขตสิทธิ์
              </div>
              <div className="role-pick">
                {ROLES.map((r) => (
                  <button key={r.key} className={`role${role.key === r.key ? " on" : ""}`} onClick={() => setRole(r)}>
                    <span className="avatar">{r.name.replace(/^(นาย|นาง|นางสาว)/, "").slice(0, 1)}</span>
                    <span style={{ flex: 1 }}>
                      <span className="role-t" style={{ display: "block" }}>{r.title}</span>
                      <span className="role-d" style={{ display: "block" }}>{r.scope}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          <button className="btn btn-primary btn-block btn-lg" onClick={submit} disabled={busy}>
            {busy ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
          </button>

          <div className="privacy">{I.shield}
            <span>ไม่มีโหมดเข้าดูโดยไม่ล็อกอิน และไม่มีลิงก์สาธารณะสำหรับข้อมูลนักเรียน</span>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ==========================================================================
   PAGE — คัดกรองนักเรียน (SDQ / EQ)
   ========================================================================== */

const BAND = {
  normal: { key: "normal", label: "กลุ่มปกติ", cls: "b-green", color: "var(--green)" },
  risk: { key: "risk", label: "กลุ่มเสี่ยง", cls: "b-yellow", color: "var(--yellow)" },
  problem: { key: "problem", label: "กลุ่มมีปัญหา", cls: "b-red", color: "var(--red)" },
};

const HERO_TOOLS = [
  { code: "HERO-9S", emoji: "👀", label: "แบบสังเกต 9S / 9S plus", d: "เฝ้าระวังพฤติกรรม อารมณ์ สังคม" },
  { code: "HERO-SDQ", emoji: "📋", label: "แบบประเมิน SDQ", d: "ประเมินละเอียดหลังพบสัญญาณ" },
  { code: "HERO-REDFLAG", emoji: "🚩", label: "Red Flag", d: "ต้องดูแลทันที ไม่ต้องรอรอบคัดกรอง" },
];

function ScreeningPage({ student, scope, openStudent, toast }) {
  const [tool, setTool] = useState(null);
  const [band, setBand] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [round, setRound] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => { setTool(null); setBand(""); setRound(""); setDone(null); }, [student]);

  if (!student) {
    return (
      <>
        <div className="privacy" style={{ marginTop: 0, marginBottom: 18 }}>{I.info}
          <span>
            การคัดกรองจริงทำในระบบ <b>HERO OBEC CARE</b> ของ สพฐ. ร่วมกับกรมสุขภาพจิต
            หน้านี้มีไว้คัดลอกผลกลุ่มเข้ามาเท่านั้น เพื่อให้ระบบของโรงเรียนเอาไปเตือน
            เปิด Case และออกรายงานต่อได้ ไม่ต้องทำแบบประเมินซ้ำสองที่
          </span>
        </div>
        <StudentsPage scope={scope} openStudent={openStudent} title="บันทึกผลคัดกรอง"
          sub="ขั้นที่ 2 ของระบบดูแลช่วยเหลือนักเรียน เลือกนักเรียนเพื่อบันทึกผลที่ได้จาก HERO OBEC CARE" />
      </>
    );
  }

  const isRed = tool?.code === "HERO-REDFLAG";
  const ready = tool && (isRed || band);

  const submit = async () => {
    setSaving(true);
    const finalBand = isRed ? "problem" : band;
    try {
      await save("instruments", {
        sid: student.id, instrument: tool.code, band: finalBand,
        source: "hero", screened_on: date, hero_round: round || null,
      });
      setDone({ tool, band: finalBand, red: isRed });
      toast(isRed
        ? "บันทึก Red Flag แล้ว ระบบขึ้นเป็นรายการเร่งด่วนให้ทันที"
        : "บันทึกผลคัดกรองจาก HERO แล้วครับ",
        isRed ? "alert" : finalBand === "normal" ? "happy" : "tracking");
    } catch {
      toast("บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally { setSaving(false); }
  };

  if (done) {
    const b = BAND[done.band];
    return (
      <>
        <div className="page-head">
          <div>
            <h1 className="page-title">บันทึกผลแล้ว</h1>
            <p className="page-sub">{nameOf(student)} · {student.room} · {done.tool.label}</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => openStudent(null)}>บันทึกคนต่อไป</button>
        </div>

        <div className="card">
          <div className="ring-wrap">
            <Care mood={done.red ? "alert" : done.band === "normal" ? "happy" : "tracking"} size={104} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <span className={`badge ${done.red ? "b-red" : b.cls}`}>
                <i className="dot" />{done.red ? "Red Flag ต้องดูแลทันที" : b.label}
              </span>
              <p style={{ fontSize: 13.5, color: "var(--ink-mid)", margin: "12px 0 0", lineHeight: 1.65, maxWidth: "50ch" }}>
                {done.red
                  ? "ระบบจัดนักเรียนเข้ากลุ่มเร่งด่วนและสร้างรายการติดตามให้แล้ว ขั้นต่อไปคือส่งต่อครูแนะแนวและแจ้งผู้บริหารในวันนี้ ห้ามรอรอบคัดกรองถัดไป"
                  : done.band === "problem"
                    ? "ระบบสร้างรายการติดตามให้แล้ว ขั้นต่อไปคือเปิด Case ช่วยเหลือ และพิจารณาว่าต้องส่งต่อผู้เชี่ยวชาญผ่าน HERO หรือไม่"
                    : done.band === "risk"
                      ? "ระบบย้ายนักเรียนเข้ากลุ่มควรติดตาม สังเกตพฤติกรรมต่อเนื่องและบันทึกสิ่งที่พบไว้ในระบบ"
                      : "อยู่ในเกณฑ์ปกติ ทำซ้ำตามรอบที่ HERO กำหนด"}
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                <button className="btn btn-sm" onClick={() => openStudent(null)}>บันทึกคนต่อไป</button>
                {done.band !== "normal" && (
                  <button className="btn btn-primary btn-sm" onClick={() => toast("เปิดหน้าการช่วยเหลือเพื่อเปิด Case")}>
                    เปิด Case ช่วยเหลือ
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="privacy" style={{ marginTop: 14 }}>{I.shield}
          <span>
            ระบบนี้เก็บเฉพาะผลกลุ่มเท่านั้น ไม่เก็บคะแนนรายด้านและไม่เก็บคำตอบรายข้อ
            รายละเอียดระดับนั้นอยู่ใน HERO OBEC CARE กับครูแนะแนว
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">บันทึกผลคัดกรอง</h1>
          <p className="page-sub">{nameOf(student)} · {student.room} · คัดลอกผลจาก HERO OBEC CARE</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => openStudent(null)}>เปลี่ยนนักเรียน</button>
      </div>

      <div className="card">
        <div className="field">
          <label>คัดกรองด้วยเครื่องมืออะไร</label>
          <div className="cat-grid">
            {HERO_TOOLS.map((t) => (
              <button key={t.code} className="cat"
                style={tool?.code === t.code
                  ? { borderColor: "var(--pink)", background: "var(--pink-mist)" } : undefined}
                onClick={() => { setTool(t); setBand(""); }}>
                <div className="cat-e">{t.emoji}</div>
                <div className="cat-t">{t.label}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 3, lineHeight: 1.4 }}>{t.d}</div>
              </button>
            ))}
          </div>
        </div>

        {tool && !isRed && (
          <div className="field">
            <label>ผลที่ HERO แสดง</label>
            <div className="opt-row">
              {Object.values(BAND).map((b) => (
                <button key={b.key} className={`opt${band === b.key ? " on" : ""}`} onClick={() => setBand(b.key)}>
                  <i className="dot" style={{ background: b.color, display: "inline-block", marginRight: 7 }} />
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {isRed && (
          <div className="privacy" style={{ marginTop: 0, marginBottom: 16, background: "var(--red-bg)", color: "var(--red)" }}>
            {I.info}
            <span>
              Red Flag ถือเป็นเรื่องเร่งด่วนเสมอ กดบันทึกแล้วระบบจะจัดนักเรียนเข้ากลุ่มเร่งด่วนทันที
              และแจ้งเตือนครูที่ปรึกษา ถ้าเป็นเรื่องความปลอดภัยเฉพาะหน้า อย่ารอระบบ ให้แจ้งผู้บริหารด้วยตนเองก่อน
            </span>
          </div>
        )}

        {tool && (
          <>
            <div className="field"><label>วันที่คัดกรองใน HERO</label>
              <input className="inp" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "auto" }} /></div>
            <div className="field"><label>รอบที่ <span className="hint">ใส่หรือไม่ใส่ก็ได้</span></label>
              <input className="inp" value={round} placeholder="เช่น 1" onChange={(e) => setRound(e.target.value)} /></div>
          </>
        )}

        <button className="btn btn-primary btn-block btn-lg" disabled={!ready || saving} onClick={submit}>
          {saving ? "กำลังบันทึก…" : ready ? "บันทึกผล" : "เลือกเครื่องมือและผลก่อน"}
        </button>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 16, maxWidth: "60ch", lineHeight: 1.6 }}>
        ถ้าแอดมินโรงเรียน export ผลจาก HERO ออกมาเป็นไฟล์ได้ ไม่ต้องกรอกทีละคน
        ใช้ <code>node scripts/import-hero.mjs hero.csv</code> นำเข้าทั้งโรงเรียนครั้งเดียวจบ
      </p>
    </>
  );
}

/* ==========================================================================
   PAGE — บันทึกการใช้งาน (Audit log)
   ========================================================================== */

const TABLE_TH = {
  care360_students: "ข้อมูลนักเรียน",
  care360_student_details: "ข้อมูลเชิงลึก",
  care360_home_visits: "การเยี่ยมบ้าน",
  care360_conduct_logs: "คะแนนความประพฤติ",
  care360_cases: "Case ช่วยเหลือ",
  care360_case_logs: "บันทึกความคืบหน้า",
  care360_attention: "รายการติดตาม",
  care360_screenings: "ผลการคัดกรอง",
};
const ACTION_TH = { INSERT: "เพิ่ม", UPDATE: "แก้ไข", DELETE: "ลบ" };

const MOCK_AUDIT = [
  { id: 1, who: "นางสาวเกตุฤดี ราชไชยา", what: "care360_conduct_logs", action: "INSERT", when: "วันนี้ 09:14" },
  { id: 2, who: "นายวีระพงษ์ ธรรมใจ", what: "care360_home_visits", action: "INSERT", when: "วันนี้ 08:52" },
  { id: 3, who: "นายปฐมพงษ์ ธรรมลังกา", what: "care360_cases", action: "UPDATE", when: "เมื่อวาน 16:20" },
  { id: 4, who: "นางสุนีย์ อินต๊ะวงค์", what: "care360_screenings", action: "INSERT", when: "เมื่อวาน 14:03" },
  { id: 5, who: "นางกัลยา แก้วมณี", what: "care360_students", action: "UPDATE", when: "เมื่อวาน 11:47" },
];

function AuditPage({ role, toast }) {
  const [rows, setRows] = useState(LIVE ? [] : MOCK_AUDIT);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(LIVE);

  useEffect(() => {
    if (!LIVE) return;
    window.storage.get("audit")
      .then((r) => setRows(r?.value || []))
      .catch(() => toast("ไม่มีสิทธิ์ดูบันทึกการใช้งาน"))
      .finally(() => setLoading(false));
  }, [toast]);

  const list = rows.filter((r) =>
    q === "" || r.who.includes(q) || (TABLE_TH[r.what] || r.what).includes(q));

  const allowed = role.all || role.role === "executive" || role.role === "student_affairs";
  if (!allowed) {
    return <div className="card"><Empty mood="alert" title="เฉพาะผู้บริหารและกลุ่มกิจการนักเรียน"
      desc="บันทึกการใช้งานเปิดให้เฉพาะผู้ที่มีหน้าที่ตรวจสอบเท่านั้น" /></div>;
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">บันทึกการใช้งาน</h1>
          <p className="page-sub">ใครแก้อะไรเมื่อไร แสดง 200 รายการล่าสุด ระบบบันทึกอัตโนมัติที่ฐานข้อมูล แก้ไขไม่ได้</p>
        </div>
        <button className="btn btn-sm" onClick={() => exportCSV("audit-log", list.map((r) => ({
          เวลา: r.when, ผู้ใช้: r.who, รายการ: TABLE_TH[r.what] || r.what, การกระทำ: ACTION_TH[r.action] || r.action,
        })))}>{I.doc} ส่งออก CSV</button>
      </div>

      <div className="search" style={{ marginBottom: 16, maxWidth: 420 }}>
        {I.search}<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาชื่อผู้ใช้หรือรายการ" />
      </div>

      {loading ? <div className="sk" style={{ height: 260, borderRadius: 22 }} />
        : list.length === 0 ? (
          <div className="card"><Empty mood="empty" title="ยังไม่มีบันทึกที่ตรงกับเงื่อนไข" desc="ลองล้างคำค้นหรือรอให้มีการใช้งานเกิดขึ้นก่อน" /></div>
        ) : (
          <div className="card">
            <div className="timeline">
              {list.map((r) => {
                const c = r.action === "DELETE" ? "var(--red)" : r.action === "UPDATE" ? "var(--yellow)" : "var(--green)";
                return (
                  <div className="tl-item" key={r.id} style={{ color: c }}>
                    <i className="tl-dot" />
                    <div className="tl-date">{r.when}</div>
                    <div className="tl-title">{r.who}</div>
                    <div className="tl-body">
                      {ACTION_TH[r.action] || r.action} · {TABLE_TH[r.what] || r.what}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
    </>
  );
}

/* ==========================================================================
   ส่งออกข้อมูล — CSV ที่ Excel ภาษาไทยเปิดได้ไม่เพี้ยน
   ========================================================================== */

function exportCSV(name, rows) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const esc = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const body = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\r\n");
  // ต้องมี BOM ไม่งั้น Excel เปิดภาษาไทยเป็นตัวขยะ
  const blob = new Blob(["\uFEFF" + body], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}



/* ==========================================================================
   PAGE — เช็คชื่อ
   กฎ "ขาดเรียนติดต่อกัน" ต้องมีข้อมูลตัวนี้ป้อนเข้าไป ไม่งั้นกฎไม่ทำงาน
   ออกแบบให้จบใน 30 วินาทีต่อห้อง ค่าเริ่มต้นคือมาเรียน ครูแตะเฉพาะคนที่ผิดปกติ
   ========================================================================== */

const ATT_STATES = [
  { key: "present", short: "มา", label: "มาเรียน", color: "var(--green)" },
  { key: "late", short: "สาย", label: "มาสาย", color: "var(--yellow)" },
  { key: "leave", short: "ลา", label: "ลา", color: "var(--blue)" },
  { key: "absent", short: "ขาด", label: "ขาดเรียน", color: "var(--red)" },
];

function AttendancePage({ scope, toast }) {
  const rooms = useMemo(() => [...new Set(scope.map((s) => s.room))].sort(), [scope]);
  const [room, setRoom] = useState(rooms[0] || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [marks, setMarks] = useState({});
  const [saved, setSaved] = useState(false);

  const list = useMemo(
    () => scope.filter((s) => s.room === room).sort((a, b) => (a.no || 0) - (b.no || 0)),
    [scope, room]
  );

  useEffect(() => {
    setSaved(false);
    const init = {};
    list.forEach((s) => { init[s.id] = "present"; });
    setMarks(init);
    if (!LIVE) return;
    window.storage.get(`attendance:${date}`).then((r) => {
      if (!r?.value?.length) return;
      const m = { ...init };
      r.value.forEach((row) => { if (m[row.student_id] !== undefined) m[row.student_id] = row.state; });
      setMarks(m);
      setSaved(true);
    }).catch(() => {});
  }, [room, date, scope.length]);

  const count = (k) => Object.values(marks).filter((v) => v === k).length;

  const submit = async () => {
    const rows = list.map((s) => ({ sid: s.id, state: marks[s.id] || "present" }));
    if (LIVE) {
      try { await window.storage.set("attendance", { date, rows }); }
      catch { toast("บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง"); return; }
    }
    setSaved(true);
    const absent = count("absent");
    if (absent === 0) {
      toast(`บันทึกการมาเรียนห้อง ${room} แล้ว วันนี้มาครบทุกคนเลยครับ`, "happy");
    } else {
      toast(`บันทึกแล้วครับ วันนี้ขาด ${absent} คน ถ้าขาดติดกัน 3 วันระบบจะเตือนให้เองนะครับ`, "tracking");
    }
  };

  if (rooms.length === 0) {
    return <div className="card"><Empty mood="empty" title="ยังไม่มีห้องในความรับผิดชอบ"
      desc="ติดต่อผู้ดูแลระบบเพื่อผูกห้องที่ปรึกษาให้บัญชีของคุณ" /></div>;
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">เช็คชื่อ</h1>
          <p className="page-sub">ทุกคนตั้งต้นเป็นมาเรียน แตะเฉพาะคนที่สาย ลา หรือขาด แล้วกดบันทึก</p>
        </div>
        <input className="inp" type="date" value={date} onChange={(e) => setDate(e.target.value)}
          style={{ width: "auto" }} />
      </div>

      <div className="chips" style={{ marginBottom: 14 }}>
        {rooms.map((r) => (
          <button key={r} className={`chip${room === r ? " on" : ""}`} onClick={() => setRoom(r)}>{r}</button>
        ))}
      </div>

      <div className="roll-sum">
        {ATT_STATES.map((st) => (
          <span key={st.key} className="badge" style={{ background: "var(--white)", color: st.color, boxShadow: "var(--sh-1)" }}>
            <i className="dot" />{st.label} {count(st.key)}
          </span>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => {
          const m = {}; list.forEach((s) => { m[s.id] = "present"; }); setMarks(m);
        }}>ตั้งเป็นมาเรียนทั้งหมด</button>
      </div>

      <div className="roll stagger">
        {list.map((s) => (
          <div className="roll-row" key={s.id}>
            <span className="roll-no">{s.no}</span>
            <span className="roll-name">{nameOf(s)}</span>
            <span className="roll-btns">
              {ATT_STATES.map((st) => {
                const on = (marks[s.id] || "present") === st.key;
                return (
                  <button key={st.key} className={`roll-b${on ? " on" : ""}`}
                    style={on ? { background: st.color } : undefined}
                    title={st.label}
                    onClick={() => { setMarks((p) => ({ ...p, [s.id]: st.key })); setSaved(false); }}>
                    {st.short}
                  </button>
                );
              })}
            </span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 22, maxWidth: 420 }}
        onClick={submit} disabled={saved}>
        {saved ? "บันทึกแล้ว" : `บันทึกการมาเรียน ${list.length} คน`}
      </button>
    </>
  );
}


/* ==========================================================================
   PAGE — รายงานการมาเรียน
   ข้อมูลมาจากหน้าเช็คชื่อ ยิ่งเช็คสม่ำเสมอ ตัวเลขยิ่งใช้อ้างอิงได้
   ========================================================================== */

const MOCK_ATT_DAYS = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (13 - i));
  const total = 745;
  const absent = 6 + Math.round(Math.sin(i * 1.3) * 4 + (i % 5));
  const late = 9 + Math.round(Math.cos(i * 0.9) * 5 + (i % 3));
  return { date: d.toISOString().slice(0, 10), total, absent: Math.max(0, absent), late: Math.max(0, late) };
});

function AttendanceReportPage({ scope, openStudent }) {
  const [range, setRange] = useState(14);
  const [days, setDays] = useState(MOCK_ATT_DAYS);
  const [byStudent, setByStudent] = useState([]);

  useEffect(() => {
    if (!LIVE) return;
    window.storage.get(`attendance-report:${range}`)
      .then((r) => { if (r?.value) { setDays(r.value.days || []); setByStudent(r.value.students || []); } })
      .catch(() => {});
  }, [range]);

  const shown = days.slice(-range);
  const sum = shown.reduce((a, d) => ({
    total: a.total + d.total, absent: a.absent + d.absent, late: a.late + d.late,
  }), { total: 0, absent: 0, late: 0 });
  const rate = sum.total ? Math.round(((sum.total - sum.absent) / sum.total) * 1000) / 10 : 0;

  // อันดับห้องที่ขาดมากที่สุด คำนวณจากขอบเขตที่ผู้ใช้เห็น
  const rooms = useMemo(() => {
    const m = {};
    scope.forEach((s) => { m[s.room] = m[s.room] || { room: s.room, n: 0, risk: 0 }; m[s.room].n++; if (s.status !== "normal") m[s.room].risk++; });
    return Object.values(m).sort((a, b) => b.risk / b.n - a.risk / a.n).slice(0, 8);
  }, [scope]);

  const watchList = byStudent.length
    ? byStudent
    : scope.filter((s) => s.status !== "normal").slice(0, 8)
        .map((s) => ({ id: s.id, name: nameOf(s), room: s.room, absent_30d: 2 + (s.no % 4), late_30d: 1 + (s.no % 6) }));

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">รายงานการมาเรียน</h1>
          <p className="page-sub">สรุปจากการเช็คชื่อ {range} วันล่าสุด ยิ่งเช็คครบทุกวัน ตัวเลขยิ่งใช้อ้างอิงได้</p>
        </div>
        <div className="chips">
          {[7, 14, 30].map((n) => (
            <button key={n} className={`chip${range === n ? " on" : ""}`} onClick={() => setRange(n)}>{n} วัน</button>
          ))}
        </div>
      </div>

      <div className="stat-grid stagger">
        <div className="stat" style={{ cursor: "default" }}>
          <div className="stat-ic" style={{ background: "var(--green-bg)", color: "var(--green)" }}>{I.check}</div>
          <div className="stat-num">{rate}<small>%</small></div>
          <div className="stat-lab">อัตราการมาเรียนเฉลี่ย</div>
          <div style={{ marginTop: 10 }} className="pbar"><i style={{ width: `${rate}%`, background: "var(--green)" }} /></div>
        </div>
        <div className="stat" style={{ cursor: "default" }}>
          <div className="stat-ic" style={{ background: "var(--red-bg)", color: "var(--red)" }}>{I.users}</div>
          <div className="stat-num">{sum.absent.toLocaleString("th-TH")} <small>ครั้ง</small></div>
          <div className="stat-lab">การขาดเรียนรวม</div>
          <div className="stat-trend"><Spark points={shown.map((d) => d.absent)} color="var(--red)" /> แนวโน้ม</div>
        </div>
        <div className="stat" style={{ cursor: "default" }}>
          <div className="stat-ic" style={{ background: "var(--yellow-bg)", color: "var(--yellow)" }}>{I.clock}</div>
          <div className="stat-num">{sum.late.toLocaleString("th-TH")} <small>ครั้ง</small></div>
          <div className="stat-lab">การมาสายรวม</div>
          <div className="stat-trend"><Spark points={shown.map((d) => d.late)} color="var(--yellow)" /> แนวโน้ม</div>
        </div>
        <div className="stat" style={{ cursor: "default" }}>
          <div className="stat-ic" style={{ background: "var(--navy-soft)", color: "var(--navy)" }}>{I.doc}</div>
          <div className="stat-num">{shown.length} <small>วัน</small></div>
          <div className="stat-lab">จำนวนวันที่มีการเช็คชื่อ</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 6 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--navy)" }}>แนวโน้มรายวัน</div>
          <div style={{ display: "flex", gap: 14 }}>
            <span className="leg"><i className="leg-sw" style={{ background: "var(--red)" }} />ขาดเรียน</span>
            <span className="leg"><i className="leg-sw" style={{ background: "var(--yellow)" }} />มาสาย</span>
          </div>
        </div>
        <LineChart
          labels={shown.map((d) => new Date(d.date).toLocaleDateString("th-TH", { day: "numeric", month: "short" }))}
          series={[
            { color: "var(--red)", points: shown.map((d) => d.absent) },
            { color: "var(--yellow)", points: shown.map((d) => d.late) },
          ]} />
      </div>

      <div className="chart-grid" style={{ marginTop: 14 }}>
        <div className="card">
          <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--navy)", marginBottom: 14 }}>
            ห้องที่มีสัดส่วนนักเรียนต้องดูแลสูงสุด
          </div>
          <HBars rows={rooms.map((r) => ({
            label: r.room, value: Math.round((r.risk / r.n) * 100),
            color: r.risk / r.n > 0.3 ? "var(--red)" : r.risk / r.n > 0.15 ? "var(--orange)" : "var(--green)",
          }))} />
          <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 10 }}>หน่วยเป็นร้อยละของนักเรียนในห้องนั้น</p>
        </div>

        <div className="card">
          <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--navy)", marginBottom: 12 }}>
            นักเรียนที่ควรติดตามเรื่องการมาเรียน
          </div>
          {watchList.length === 0 ? (
            <Empty mood="happy" title="ยังไม่มีใครน่าห่วง" desc="ในช่วงที่ผ่านมาไม่มีนักเรียนที่ขาดเรียนถี่ผิดปกติ" />
          ) : watchList.map((w) => (
            <button key={w.id} className="stu" style={{ marginBottom: 9 }}
              onClick={() => { const st = scope.find((x) => x.id === w.id); if (st) openStudent(st); }}>
              <span className="stu-ava" style={{ background: "linear-gradient(145deg,var(--orange),var(--navy))" }}>
                {(w.name || "?").slice(0, 1)}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="stu-name" style={{ display: "block" }}>{w.name}</span>
                <span className="stu-meta" style={{ display: "block" }}>
                  {w.room} · ขาด {w.absent_30d} ครั้ง · สาย {w.late_30d} ครั้ง ใน 30 วัน
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn btn-sm" onClick={() => exportCSV("attendance-daily", shown.map((d) => ({
          วันที่: d.date, นักเรียนทั้งหมด: d.total, ขาดเรียน: d.absent, มาสาย: d.late,
          อัตรามาเรียน: `${Math.round(((d.total - d.absent) / d.total) * 1000) / 10}%`,
        })))}>{I.doc} ส่งออก Excel</button>
      </div>
    </>
  );
}

/* ==========================================================================
   PAGE — แบบฟอร์มรายงาน (พิมพ์หรือบันทึกเป็น PDF ได้)
   ========================================================================== */

const SCHOOL = "โรงเรียนเตรียมอุดมศึกษาพัฒนาการเขลางค์นคร";
const OFFICE = "สำนักงานเขตพื้นที่การศึกษามัธยมศึกษาลำปาง ลำพูน";
const YEAR_TH = "ปีการศึกษา 2569";

const FORM_LIST = [
  { key: "visit", title: "แบบสรุปการเยี่ยมบ้านนักเรียน", desc: "รายชื่อทั้งห้อง พร้อมสถานะการเยี่ยมและกลุ่มที่จัด" },
  { key: "screen", title: "แบบสรุปผลการคัดกรองนักเรียน", desc: "จำนวนนักเรียนกลุ่มปกติ เสี่ยง และมีปัญหา รายห้อง" },
  { key: "risk", title: "แบบรายงานนักเรียนกลุ่มเสี่ยงและกลุ่มมีปัญหา", desc: "รายบุคคล พร้อมประเด็นและการช่วยเหลือ" },
  { key: "steps", title: "แบบรายงานผลการดำเนินงานระบบดูแลช่วยเหลือนักเรียน", desc: "สรุปการดำเนินงานตาม 5 ขั้นตอน" },
];

function FormHeader({ title, sub }) {
  return (
    <div className="a4-head">
      <h2>{title}</h2>
      <p>{SCHOOL}</p>
      <p>{OFFICE}</p>
      <p>{sub}</p>
    </div>
  );
}

function FormSign({ roles }) {
  return (
    <div className="a4-sign">
      {roles.map((r) => (
        <div key={r}>
          <div className="line">ลงชื่อ ..............................................</div>
          <div>( .............................................. )</div>
          <div>{r}</div>
        </div>
      ))}
    </div>
  );
}

function FormsPage({ scope, role }) {
  const [kind, setKind] = useState("visit");
  const [room, setRoom] = useState("all");

  const rooms = useMemo(() => [...new Set(scope.map((s) => s.room))].sort(), [scope]);
  const list = room === "all" ? scope : scope.filter((s) => s.room === room);
  const label = room === "all" ? "ทุกห้องในความรับผิดชอบ" : `ห้อง ${room}`;

  const body = {
    visit: (
      <>
        <FormHeader title="แบบสรุปการเยี่ยมบ้านนักเรียน" sub={`${label} · ${YEAR_TH}`} />
        <p>
          ตามที่โรงเรียนได้ดำเนินงานตามระบบดูแลช่วยเหลือนักเรียน ขั้นที่ 1 การรู้จักนักเรียนเป็นรายบุคคล
          ครูที่ปรึกษาได้ออกเยี่ยมบ้านนักเรียนและบันทึกข้อมูลไว้ในระบบ สรุปผลได้ดังนี้
        </p>
        <p>
          นักเรียนทั้งหมด {list.length} คน เยี่ยมบ้านแล้ว {list.filter((s) => s.visited).length} คน
          คิดเป็นร้อยละ {Math.round((list.filter((s) => s.visited).length / (list.length || 1)) * 100)}
          ยังไม่ได้เยี่ยม {list.filter((s) => !s.visited).length} คน
        </p>
        <table>
          <thead>
            <tr><th style={{ width: 44 }}>ที่</th><th>ชื่อ - สกุล</th><th style={{ width: 76 }}>ห้อง</th>
              <th style={{ width: 96 }}>ผลการเยี่ยม</th><th style={{ width: 104 }}>กลุ่มที่จัด</th><th>หมายเหตุ</th></tr>
          </thead>
          <tbody>
            {list.slice(0, 60).map((s, i) => (
              <tr key={s.id}>
                <td className="c">{i + 1}</td>
                <td>{nameOf(s)}</td>
                <td className="c">{s.room}</td>
                <td className="c">{s.visited ? "เยี่ยมแล้ว" : "ยังไม่ได้เยี่ยม"}</td>
                <td className="c">{STATUS[s.status].label}</td>
                <td />
              </tr>
            ))}
          </tbody>
        </table>
        {list.length > 60 && <p className="a4-note">แสดง 60 รายชื่อแรก เลือกเฉพาะห้องเพื่อพิมพ์ให้ครบทุกคน</p>}
        <FormSign roles={["ครูที่ปรึกษา", "หัวหน้าระดับชั้น", "รองผู้อำนวยการกลุ่มกิจการนักเรียน"]} />
      </>
    ),

    screen: (
      <>
        <FormHeader title="แบบสรุปผลการคัดกรองนักเรียน" sub={`${label} · ${YEAR_TH}`} />
        <p>
          ขั้นที่ 2 การคัดกรองนักเรียน ดำเนินการด้วยแบบประเมินจุดแข็งและจุดอ่อน (SDQ) ฉบับครูประเมินนักเรียน
          ร่วมกับการสังเกตพฤติกรรมและข้อมูลจากการเยี่ยมบ้าน สรุปผลรายห้องดังนี้
        </p>
        <table>
          <thead>
            <tr><th style={{ width: 80 }}>ห้อง</th><th className="c">จำนวนนักเรียน</th>
              <th className="c">กลุ่มปกติ</th><th className="c">กลุ่มเสี่ยง</th><th className="c">กลุ่มมีปัญหา</th>
              <th className="c">ร้อยละกลุ่มปกติ</th></tr>
          </thead>
          <tbody>
            {rooms.map((r) => {
              const g = scope.filter((s) => s.room === r);
              const n = g.filter((s) => s.status === "normal").length;
              const w = g.filter((s) => s.status === "watch").length;
              const h = g.filter((s) => s.status !== "normal" && s.status !== "watch").length;
              return (
                <tr key={r}>
                  <td className="c">{r}</td><td className="c">{g.length}</td>
                  <td className="c">{n}</td><td className="c">{w}</td><td className="c">{h}</td>
                  <td className="c">{Math.round((n / (g.length || 1)) * 100)}</td>
                </tr>
              );
            })}
            <tr>
              <td className="c"><b>รวม</b></td>
              <td className="c"><b>{scope.length}</b></td>
              <td className="c"><b>{scope.filter((s) => s.status === "normal").length}</b></td>
              <td className="c"><b>{scope.filter((s) => s.status === "watch").length}</b></td>
              <td className="c"><b>{scope.filter((s) => s.status === "help" || s.status === "urgent").length}</b></td>
              <td className="c"><b>{Math.round((scope.filter((s) => s.status === "normal").length / (scope.length || 1)) * 100)}</b></td>
            </tr>
          </tbody>
        </table>
        <p className="a4-note">
          หมายเหตุ การจัดกลุ่มอ้างอิงเกณฑ์แปลผลที่ตั้งค่าไว้ในระบบ ต้องตรวจสอบให้ตรงกับคู่มือฉบับที่โรงเรียนใช้จริง
        </p>
        <FormSign roles={["ครูที่ปรึกษา", "หัวหน้าระดับชั้น", "รองผู้อำนวยการกลุ่มกิจการนักเรียน"]} />
      </>
    ),

    risk: (
      <>
        <FormHeader title="แบบรายงานนักเรียนกลุ่มเสี่ยงและกลุ่มมีปัญหา" sub={`${label} · ${YEAR_TH}`} />
        <p>
          ขั้นที่ 4 การป้องกันและแก้ไขปัญหา รายงานนักเรียนที่อยู่ในกลุ่มควรติดตาม กลุ่มต้องดำเนินการ
          และกลุ่มเร่งด่วน พร้อมแนวทางการช่วยเหลือที่ดำเนินการแล้ว
        </p>
        <table>
          <thead>
            <tr><th style={{ width: 44 }}>ที่</th><th>ชื่อ - สกุล</th><th style={{ width: 66 }}>ห้อง</th>
              <th style={{ width: 100 }}>กลุ่ม</th><th style={{ width: 74 }}>คะแนน</th>
              <th>ประเด็นที่พบและการช่วยเหลือ</th></tr>
          </thead>
          <tbody>
            {list.filter((s) => s.status !== "normal").slice(0, 40).map((s, i) => (
              <tr key={s.id}>
                <td className="c">{i + 1}</td><td>{nameOf(s)}</td><td className="c">{s.room}</td>
                <td className="c">{STATUS[s.status].label}</td><td className="c">{s.score}</td><td />
              </tr>
            ))}
          </tbody>
        </table>
        <p className="a4-note">
          เอกสารฉบับนี้มีข้อมูลส่วนบุคคลของนักเรียน ใช้เฉพาะในการประชุมทีมดูแลช่วยเหลือนักเรียนเท่านั้น
          ไม่เผยแพร่ต่อบุคคลภายนอกและไม่ติดประกาศ
        </p>
        <FormSign roles={["ครูที่ปรึกษา", "หัวหน้าระดับชั้น", "รองผู้อำนวยการกลุ่มกิจการนักเรียน"]} />
      </>
    ),

    steps: (
      <>
        <FormHeader title="แบบรายงานผลการดำเนินงานระบบดูแลช่วยเหลือนักเรียน" sub={`${label} · ${YEAR_TH}`} />
        <table>
          <thead>
            <tr><th style={{ width: 54 }}>ขั้นที่</th><th>การดำเนินงาน</th>
              <th className="c" style={{ width: 110 }}>ผลการดำเนินงาน</th><th style={{ width: 160 }}>หลักฐาน</th></tr>
          </thead>
          <tbody>
            <tr>
              <td className="c">1</td><td>การรู้จักนักเรียนเป็นรายบุคคล</td>
              <td className="c">เยี่ยมบ้าน {list.filter((s) => s.visited).length} จาก {list.length} คน</td>
              <td>แบบบันทึกการเยี่ยมบ้านและภาพถ่ายในระบบ</td>
            </tr>
            <tr>
              <td className="c">2</td><td>การคัดกรองนักเรียน</td>
              <td className="c">คัดกรองแล้ว {list.length} คน</td>
              <td>ผลการประเมิน SDQ รายบุคคล</td>
            </tr>
            <tr>
              <td className="c">3</td><td>การส่งเสริมและพัฒนา</td>
              <td className="c">กลุ่มปกติ {list.filter((s) => s.status === "normal").length} คน</td>
              <td>บันทึกกิจกรรมส่งเสริมและคะแนนความดี</td>
            </tr>
            <tr>
              <td className="c">4</td><td>การป้องกันและแก้ไขปัญหา</td>
              <td className="c">ช่วยเหลือ {list.filter((s) => s.status === "help" || s.status === "urgent").length} คน</td>
              <td>บันทึก Case และความคืบหน้าในระบบ</td>
            </tr>
            <tr>
              <td className="c">5</td><td>การส่งต่อ</td>
              <td className="c">ส่งต่อภายใน {CASES_SEED.filter((c) => c.stage === "referred").length} ราย</td>
              <td>บันทึกการส่งต่อครูแนะแนวและหน่วยงานภายนอก</td>
            </tr>
          </tbody>
        </table>
        <p className="a4-note">
          ข้อมูลในตารางดึงจากระบบ ณ วันที่พิมพ์ ผู้รายงานควรตรวจสอบความถูกต้องก่อนเสนอผู้บริหารลงนาม
        </p>
        <FormSign roles={["ผู้รายงาน", "รองผู้อำนวยการกลุ่มกิจการนักเรียน", "ผู้อำนวยการโรงเรียน"]} />
      </>
    ),
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">แบบฟอร์มรายงาน</h1>
          <p className="page-sub">เลือกแบบฟอร์มแล้วสั่งพิมพ์ หรือบันทึกเป็น PDF จากหน้าต่างพิมพ์ได้เลย</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => window.print()}>{I.doc} พิมพ์แบบฟอร์มนี้</button>
      </div>

      <div className="chips" style={{ marginBottom: 10 }}>
        {FORM_LIST.map((f) => (
          <button key={f.key} className={`chip${kind === f.key ? " on" : ""}`} onClick={() => setKind(f.key)}>{f.title}</button>
        ))}
      </div>
      <div className="chips" style={{ marginBottom: 20 }}>
        <button className={`chip${room === "all" ? " on" : ""}`} onClick={() => setRoom("all")}>ทุกห้อง</button>
        {rooms.map((r) => <button key={r} className={`chip${room === r ? " on" : ""}`} onClick={() => setRoom(r)}>{r}</button>)}
      </div>

      <div className="a4">{body[kind]}</div>

      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 16, maxWidth: "62ch", lineHeight: 1.6 }}>
        แบบฟอร์มเหล่านี้จัดวางตามโครงสร้างที่ใช้กันทั่วไป ถ้าเขตพื้นที่กำหนดแบบฟอร์มเฉพาะมาให้
        ส่งไฟล์แบบฟอร์มจริงมา แล้วจะปรับช่องให้ตรงทุกช่องได้
      </p>
    </>
  );
}


/* ==========================================================================
   หน้าผู้ปกครอง — เห็นเฉพาะบุตรหลานของตนเอง และเห็นน้อยที่สุดเท่าที่จำเป็น
   บันทึกการเยี่ยมบ้าน ผลการคัดกรอง และบันทึก Case ไม่แสดงที่นี่โดยตั้งใจ
   ========================================================================== */

function ParentHome({ user, onLogout }) {
  const kids = STUDENTS;
  const [sel, setSel] = useState(kids[0] || null);

  return (
    <div className="main" style={{ maxWidth: 760, margin: "0 auto", padding: "26px 18px 60px" }}>
      <div className="welcome" style={{ marginBottom: 18 }}>
        <div className="welcome-text">
          <h2>สวัสดีครับ คุณผู้ปกครอง</h2>
          <p>ดูความเคลื่อนไหวของบุตรหลานได้ที่นี่ หากมีข้อสงสัยกรุณาติดต่อครูที่ปรึกษาโดยตรง</p>
        </div>
        <div className="welcome-mascot"><Care mood="happy" size={108} /></div>
      </div>

      {kids.length > 1 && (
        <div className="chips" style={{ marginBottom: 16 }}>
          {kids.map((k) => (
            <button key={k.id} className={`chip${sel?.id === k.id ? " on" : ""}`} onClick={() => setSel(k)}>
              {nameOf(k)}
            </button>
          ))}
        </div>
      )}

      {!sel ? (
        <div className="card">
          <Empty mood="waiting" title="ยังไม่ได้ผูกข้อมูลนักเรียน"
            desc="กรุณาติดต่อครูที่ปรึกษาเพื่อขอรหัสเชิญ แล้วนำมากรอกในระบบหนึ่งครั้ง" />
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <span className="hero-ava" style={{ background: "var(--pink-mist)", color: "var(--pink)", border: "2px solid var(--pink-soft)" }}>
                {initialOf(sel)}
              </span>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 19, fontWeight: 700, color: "var(--navy)" }}>{nameOf(sel)}</div>
                <div style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{sel.room} · เลขที่ {sel.no}</div>
              </div>
              <Ring value={sel.score} label="คะแนนความประพฤติ" size={112}
                color={sel.score >= 90 ? "var(--green)" : sel.score >= 80 ? "var(--yellow)" : "var(--orange)"} />
            </div>
          </div>

          <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <div className="stat" style={{ cursor: "default" }}>
              <div className="stat-ic" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>{I.chart}</div>
              <div className="stat-num">{sel.gpa ?? "-"}</div>
              <div className="stat-lab">เกรดเฉลี่ยสะสม</div>
            </div>
            <div className="stat" style={{ cursor: "default" }}>
              <div className="stat-ic" style={{ background: "var(--orange-bg)", color: "var(--orange)" }}>{I.clock}</div>
              <div className="stat-num">{sel.absent90 ?? 0} <small>ครั้ง</small></div>
              <div className="stat-lab">ขาดเรียนใน 90 วัน</div>
            </div>
            <div className="stat" style={{ cursor: "default" }}>
              <div className="stat-ic" style={{ background: "var(--yellow-bg)", color: "var(--yellow)" }}>{I.bell}</div>
              <div className="stat-num">{sel.late90 ?? 0} <small>ครั้ง</small></div>
              <div className="stat-lab">มาสายใน 90 วัน</div>
            </div>
          </div>

          <div className="privacy" style={{ marginTop: 4 }}>{I.shield}
            <span>
              ระบบแสดงเฉพาะข้อมูลพื้นฐานของบุตรหลานท่านเท่านั้น บันทึกการเยี่ยมบ้าน ผลการคัดกรอง
              และบันทึกการช่วยเหลือเป็นเอกสารการทำงานภายในของครู หากต้องการทราบรายละเอียด
              กรุณานัดพบครูที่ปรึกษาโดยตรง
            </span>
          </div>
        </>
      )}

      <button className="btn btn-ghost btn-sm" style={{ marginTop: 22 }} onClick={onLogout}>{I.logout} ออกจากระบบ</button>
    </div>
  );
}

/* ==========================================================================
   ตัวดักข้อผิดพลาด — ถ้าหน้าจอพังจะได้ไม่กลายเป็นจอขาวเปล่า ๆ
   ครูจะได้รู้ว่าต้องทำอะไรต่อ และมีข้อความให้แจ้งกลับมาได้
   ========================================================================== */

class Boundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error("[care360] หน้าจอพัง", err, info); }

  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="c360">
        <style>{CSS}</style>
        <div className="crash">
          <Care mood="alert" size={104} look={false} />
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)", marginTop: 10 }}>
            หน้านี้ทำงานผิดพลาด
          </div>
          <p style={{ fontSize: 13.5, color: "var(--ink-mid)", lineHeight: 1.65, margin: "8px 0 0" }}>
            ข้อมูลที่บันทึกไปแล้วไม่หายครับ ลองโหลดหน้าใหม่อีกครั้ง
            ถ้ายังเป็นเหมือนเดิม ช่วยถ่ายภาพหน้าจอนี้ส่งให้กลุ่มบริหารกิจการนักเรียนด้วย
          </p>
          <div style={{ display: "flex", gap: 9, justifyContent: "center", marginTop: 20 }}>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>โหลดหน้าใหม่</button>
            <button className="btn" onClick={() => this.setState({ err: null })}>ลองอีกครั้ง</button>
          </div>
          <pre>{String(this.state.err?.stack || this.state.err).slice(0, 700)}</pre>
        </div>
      </div>
    );
  }
}

/* ==========================================================================
   ล็อกหน้าจอเมื่อไม่ได้ใช้งานนาน
   ครูในโรงเรียนยืมเครื่องกันใช้เป็นเรื่องปกติ ถ้าเปิดค้างไว้แล้วเดินไปสอน
   คนถัดไปจะเห็นข้อมูลนักเรียนทั้งห้องทันที จึงต้องล็อกเองอัตโนมัติ
   ========================================================================== */

const IDLE_MIN = 15;

function useIdle(minutes, onIdle, active) {
  const t = useRef(null);
  useEffect(() => {
    if (!active) return;
    const reset = () => {
      clearTimeout(t.current);
      t.current = setTimeout(onIdle, minutes * 60000);
    };
    const evts = ["pointerdown", "keydown", "wheel", "touchstart", "focus"];
    evts.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(t.current);
      evts.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [minutes, onIdle, active]);
}

function LockScreen({ user, onUnlock, onLogout }) {
  return (
    <div className="lock" role="dialog" aria-modal="true">
      <div className="lock-card">
        <Care mood="waiting" size={104} look={false} />
        <div style={{ fontSize: 17.5, fontWeight: 700, color: "var(--navy)", marginTop: 8 }}>
          ล็อกหน้าจอไว้ชั่วคราว
        </div>
        <p style={{ fontSize: 13.5, color: "var(--ink-mid)", lineHeight: 1.65, margin: "8px 0 0" }}>
          ไม่ได้ใช้งานมาสักพัก ระบบซ่อนข้อมูลนักเรียนไว้ก่อนเพื่อความปลอดภัย
          หากไม่ใช่ {user.title} กรุณากดออกจากระบบ
        </p>
        <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 20 }} onClick={onUnlock}>
          ใช่ ฉันเอง กลับเข้าหน้าจอ
        </button>
        <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 8 }} onClick={onLogout}>
          {I.logout} ออกจากระบบ
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   APP SHELL
   ========================================================================== */

const NAV = [
  { key: "overview", label: "ภาพรวม", icon: I.home },
  { key: "students", label: "นักเรียน", icon: I.users },
  { key: "conduct", label: "คะแนนความประพฤติ", icon: I.star },
  { key: "homevisit", label: "เยี่ยมบ้าน", icon: I.house },
  { key: "know", label: "รู้จักนักเรียน", icon: I.search },
  { key: "attendance", label: "เช็คชื่อ", icon: I.clock },
  { key: "attreport", label: "รายงานการมาเรียน", icon: I.chart },
  { key: "screening", label: "บันทึกผลคัดกรอง", icon: I.shield },
  { key: "cases", label: "การช่วยเหลือ", icon: I.hands },
  { key: "today", label: "วันนี้ควรติดตาม", icon: I.bell, badge: true },
  { key: "reports", label: "รายงาน", icon: I.chart },
  { key: "forms", label: "แบบฟอร์มรายงาน", icon: I.doc },
  { key: "audit", label: "บันทึกการใช้งาน", icon: I.shield, adminOnly: true },
  { key: "settings", label: "ตั้งค่า", icon: I.gear },
];

function AppInner() {
  const [user, setUser] = useState(null);
  // เปิดจากทางลัดบนหน้าจอโฮม เช่น /?go=attendance (ค่าถูกอ่านไว้แล้วใน src/pwa.js)
  const [page, setPage] = useState(
    (typeof window !== "undefined" && window.__care360_go) || "overview"
  );
  const [student, setStudent] = useState(null);
  const [doneIds, setDoneIds] = useState([]);
  const [scores, setScores] = useState({});
  const [cases, setCases] = useState(CASES_SEED);
  const [msg, setMsg] = useState("");
  const [fab, setFab] = useState(false);
  const [booting, setBooting] = useState(LIVE);
  const net = useNet();
  const [, bump] = useState(0);
  const timer = useRef(null);

  // ต่อ Supabase: กู้ session เดิม แล้วโหลดข้อมูลตามสิทธิ์ของผู้ใช้
  const boot = async () => {
    setBooting(true);
    try {
      const { me, cases: cs } = await loadAll();
      if (cs?.length) setCases(cs);
      setUser(me);
      bump((n) => n + 1);
    } catch (e) {
      console.error(e);
      setMsg("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    } finally { setBooting(false); }
  };

  useEffect(() => {
    if (!LIVE) return;
    let off;
    (async () => {
      const s = await window.auth.session();
      if (s) await boot(); else setBooting(false);
      off = window.auth.onChange((sess) => { if (!sess) { setUser(null); setPage("overview"); } });
    })();
    return () => off && off();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [bub, setBub] = useState(null);
  const [party, setParty] = useState(false);
  const [locked, setLocked] = useState(false);
  const [follow, setFollow] = useState(null);
  const [followNote, setFollowNote] = useState("");
  const said = useRef(new Set());

  // toast แบบสั้นใช้เหมือนเดิม ถ้าส่ง mood มาด้วยจะกลายเป็นน้อง CARE พูดแทน
  const toast = (t, mood, action) => {
    if (mood) { setBub({ text: t, mood, action, id: Date.now() }); return; }
    setMsg(t);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 2400);
  };
  const sayOnce = (key, text, mood, action) => {
    if (said.current.has(key)) return;
    said.current.add(key);
    setBub({ text, mood, action, id: Date.now() });
  };

  // ขอบเขตข้อมูลตามบทบาท — ต้นแบบของกฎ RLS ที่จะบังคับจริงในฐานข้อมูล
  const scope = useMemo(() => {
    if (!user) return [];
    // เมื่อต่อฐานข้อมูลจริง RLS กรองมาให้แล้ว ไม่ต้องกรองซ้ำที่หน้าจอ
    if (LIVE) return STUDENTS;
    if (user.all) return STUDENTS;
    if (user.levels) return STUDENTS.filter((s) => user.levels.includes(s.level));
    if (user.rooms) return STUDENTS.filter((s) => user.rooms.includes(s.room));
    return [];
  }, [user]);

  const attention = useMemo(
    () => ATTENTION_SEED.filter((a) => scope.some((s) => s.id === a.sid)),
    [scope]
  );

  useIdle(IDLE_MIN, () => setLocked(true), !!user && !locked);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page, student]);

  // ทักทายครั้งแรกของการเข้าใช้งาน แล้วเตือนเฉพาะกรณีมีเรื่องเร่งด่วนจริง ๆ
  useEffect(() => {
    if (!user) return;
    const open = ATTENTION_SEED.filter((a) => !doneIds.includes(a.id) && scope.some((x) => x.id === a.sid));
    const urgent = open.filter((a) => a.level === "urgent");
    const t1 = setTimeout(() => {
      if (open.length === 0) {
        sayOnce("hello", "สวัสดีครับ วันนี้ยังไม่มีรายการที่ต้องดูแลเลย เยี่ยมมาก", "happy");
      } else {
        sayOnce("hello", `สวัสดีครับ วันนี้มีนักเรียน ${open.length} คนที่ควรดูแล เริ่มจากรายการเร่งด่วนก่อนนะครับ`, "search",
          { label: "ดูรายการ", to: "today" });
      }
    }, 1400);

    const t2 = setTimeout(() => {
      if (urgent.length > 0) {
        sayOnce("urgent", `มีนักเรียน ${urgent.length} คนอยู่ในกลุ่มเร่งด่วน ควรดำเนินการภายในวันนี้ครับ`, "alert",
          { label: "เปิดดูเลย", to: "today" });
      }
    }, 14000);

    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, scope.length]);

  if (booting) {
    return (
      <div className="c360">
        <style>{CSS}</style>
        <div className="bg-deco"><i className="blob blob-a" /><i className="blob blob-b" /><i className="blob blob-c" /></div>
        <div className="login-wrap">
          <div style={{ textAlign: "center" }}>
            <Care mood="search" size={112} />
            <p style={{ color: "var(--ink-mid)", marginTop: 12 }}>กำลังเตรียมข้อมูลตามสิทธิ์ของคุณ…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="c360">
        <style>{CSS}</style>
        <div className="bg-deco"><i className="blob blob-a" /><i className="blob blob-b" /><i className="blob blob-c" /></div>
        <Login onLogin={(r) => {
          if (r) { setUser(r); toast(`เข้าสู่ระบบในบทบาท ${r.title}`); }
          else boot();
        }} />
      </div>
    );
  }

  // ผู้ปกครองใช้หน้าจอคนละชุด ไม่เห็นเมนูของครูเลยแม้แต่เมนูเดียว
  if (user.role === "parent") {
    return (
      <div className="c360">
        <style>{CSS}</style>
        <div className="bg-deco"><i className="blob blob-a" /><i className="blob blob-b" /><i className="blob blob-c" /></div>
        <ParentHome user={user} onLogout={async () => { if (LIVE) await window.auth.signOut(); setUser(null); }} />
        <Toast msg={msg} />
      </div>
    );
  }

  const goto = (p) => { setPage(p); setStudent(null); };
  const openStudent = (s) => { setStudent(s); if (s) setPage("student360"); };
  const askFollow = (a) => { setFollow(a); setFollowNote(""); };

  const markDone = (id, note) => {
    const next = [...doneIds, id];
    setDoneIds(next);
    save("attention", { id, note: note || "ติดตามจากหน้าจอ" });

    const remaining = attention.filter((a) => !next.includes(a.id)).length;
    if (remaining === 0) {
      setParty(true);
      setTimeout(() => setParty(false), 2900);
      setBub({ text: "เยี่ยมเลยครับ วันนี้ติดตามครบทุกรายการแล้ว ขอบคุณที่ดูแลนักเรียนนะครับ", mood: "success", id: Date.now() });
    } else if (remaining === 1) {
      setBub({ text: "เหลืออีกแค่รายการเดียวแล้วครับ", mood: "happy", id: Date.now() });
    } else {
      toast("บันทึกการติดตามแล้ว");
    }
  };

  const openCount = attention.filter((a) => !doneIds.includes(a.id)).length;

  let body;
  switch (page) {
    case "overview":
      body = <Dashboard scope={scope} role={user} attention={attention} doneIds={doneIds}
        onDone={askFollow} goto={goto} openStudent={openStudent} />; break;
    case "students":
      body = <StudentsPage scope={scope} openStudent={openStudent} />; break;
    case "know":
      body = <StudentsPage scope={scope} openStudent={openStudent} title="รู้จักนักเรียน"
        sub="ค้นหาและทำความรู้จักนักเรียนเป็นรายบุคคล ก่อนการคัดกรองและวางแผนช่วยเหลือ" />; break;
    case "student360":
      body = student ? (
        <Student360 student={student} onBack={() => goto("students")}
          goConduct={(s) => { setStudent(s); setPage("conduct"); }}
          goVisit={(s) => { setStudent(s); setPage("homevisit"); }}
          goCase={(st) => { setStudent(st); setPage("cases"); }}
          toast={toast} />
      ) : <StudentsPage scope={scope} openStudent={openStudent} />; break;
    case "conduct":
      body = <ConductPage student={student} scope={scope} openStudent={(s) => setStudent(s)}
        scores={scores} setScore={(id, v) => setScores((p) => ({ ...p, [id]: v }))} toast={toast} />; break;
    case "homevisit":
      body = <HomeVisitPage student={student} scope={scope} openStudent={(s) => setStudent(s)}
        toast={toast} onDone={(s) => { setStudent(s); setPage("student360"); }} />; break;
    case "cases":
      body = <CasesPage scope={scope} cases={cases} setCases={setCases} toast={toast}
        openStudent={openStudent} seedStudent={student} />; break;
    case "today":
      body = <TodayPage attention={attention} doneIds={doneIds} onDone={askFollow} openStudent={openStudent} />; break;
    case "screening":
      body = <ScreeningPage student={student} scope={scope} openStudent={(s) => setStudent(s)} toast={toast} />; break;
    case "attendance":
      body = <AttendancePage scope={scope} toast={toast} />; break;
    case "attreport":
      body = <AttendanceReportPage scope={scope} openStudent={openStudent} />; break;
    case "forms":
      body = <FormsPage scope={scope} role={user} />; break;
    case "audit":
      body = <AuditPage role={user} toast={toast} />; break;
    case "reports":
      body = <ReportsPage scope={scope} role={user} openStudent={openStudent} />; break;
    case "settings":
      body = <SettingsPage role={user} onRole={(r) => { setUser(r); setStudent(null); toast(`สลับบทบาทเป็น ${r.title}`); }} toast={toast} />; break;
    default:
      body = null;
  }

  const quick = [
    ["📝", "บันทึกพฤติกรรม", "conduct", "var(--orange-bg)", "var(--orange)"],
    ["🏡", "เยี่ยมบ้าน", "homevisit", "var(--green-bg)", "var(--green)"],
    ["🔔", "บันทึกการติดตาม", "today", "var(--yellow-bg)", "var(--yellow)"],
    ["🤝", "เปิด Case ช่วยเหลือ", "cases", "var(--pink-mist)", "var(--pink)"],
    ["🛡", "บันทึกผลคัดกรอง", "screening", "var(--blue-bg)", "var(--blue)"],
    ["✅", "เช็คชื่อ", "attendance", "var(--green-bg)", "var(--green)"],
  ];

  return (
    <div className="c360">
      <style>{CSS}</style>
      <div className="bg-deco"><i className="blob blob-a" /><i className="blob blob-b" /><i className="blob blob-c" /></div>

      <div className="shell">
        {/* ---------- Sidebar (desktop) ---------- */}
        <aside className="side">
          <div className="brand">
            <div className="brand-mark"><Care mood="idle" size={44} look={false} /></div>
            <div>
              <div className="brand-t1">TUPKLN CARE 360</div>
              <div className="brand-t2">ระบบดูแลช่วยเหลือนักเรียน</div>
            </div>
          </div>

          {NAV.filter((n) => !n.adminOnly || user.all || user.role === "executive" || user.role === "student_affairs").map((n) => (
            <button key={n.key} className={`nav-item${page === n.key || (n.key === "students" && page === "student360") ? " on" : ""}`}
              onClick={() => goto(n.key)}>
              <span className="nav-ic">{n.icon}</span>{n.label}
              {n.badge && openCount > 0 && <span className="nav-badge">{openCount}</span>}
            </button>
          ))}

          <div className="side-foot">
            <button className="me-card" onClick={() => goto("settings")}>
              <span className="avatar">{user.name.replace(/^(นาย|นาง|นางสาว)/, "").slice(0, 1)}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="me-name" style={{ display: "block" }}>{user.title}</span>
                <span className="me-role" style={{ display: "block" }}>{user.name}</span>
              </span>
            </button>
            <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 8 }}
              onClick={async () => { if (LIVE) await window.auth.signOut(); setUser(null); setPage("overview"); setStudent(null); }}>{I.logout} ออกจากระบบ</button>
          </div>
        </aside>

        {/* ---------- Main ---------- */}
        <main className="main">
          <div className="mobile-top">
            <Care mood="idle" size={34} look={false} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--navy)", lineHeight: 1.15 }}>TUPKLN CARE 360</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{user.title}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => goto("settings")}>{I.gear}</button>
          </div>

          {(!net.online || net.pending > 0) && (
            <div className="netbar" style={{
              background: net.online ? "var(--blue-bg)" : "var(--orange-bg)",
              color: net.online ? "var(--blue)" : "var(--orange)",
            }}>
              {net.online ? I.clock : I.info}
              <span>
                {!net.online
                  ? "ตอนนี้ไม่มีสัญญาณ ใช้งานต่อได้ ข้อมูลจะถูกเก็บไว้ในเครื่องก่อน"
                  : net.syncing
                    ? `กำลังส่งข้อมูลที่ค้างไว้ ${net.pending} รายการ`
                    : `มีข้อมูลรอส่ง ${net.pending} รายการ ระบบจะส่งให้อัตโนมัติ`}
              </span>
              {net.online && !net.syncing && (
                <button className="btn btn-sm" style={{ marginLeft: "auto" }}
                  onClick={() => window.offline.flush()}>ส่งเดี๋ยวนี้</button>
              )}
            </div>
          )}

          {page === "overview" && (
            <div className="page-head" style={{ marginBottom: 14 }}>
              <div>
                <h1 className="page-title">ภาพรวม</h1>
                <p className="page-sub">วันศุกร์ที่ 11 กันยายน 2569 · {user.scope}</p>
              </div>
            </div>
          )}

          <div className="page-enter" key={page + (student?.id || "")}>{body}</div>
        </main>
      </div>

      {/* ---------- Bottom nav (mobile) ---------- */}
      <nav className="bottomnav">
        <button className={`bn${page === "overview" ? " on" : ""}`} onClick={() => goto("overview")}>{I.home}หน้าแรก</button>
        <button className={`bn${page === "students" || page === "student360" ? " on" : ""}`} onClick={() => goto("students")}>{I.users}นักเรียน</button>
        <button className="bn" onClick={() => setFab(true)} aria-label="เมนูลัด">
          <span className="bn-fab">{I.plus}</span>
        </button>
        <button className={`bn${page === "today" ? " on" : ""}`} onClick={() => goto("today")}>
          <span style={{ position: "relative" }}>
            {I.bell}
            {openCount > 0 && <span style={{ position: "absolute", top: -3, right: -7, width: 8, height: 8, borderRadius: "50%", background: "var(--pink)" }} />}
          </span>
          ติดตาม
        </button>
        <button className={`bn${page === "settings" ? " on" : ""}`} onClick={() => goto("settings")}>{I.gear}ฉัน</button>
      </nav>

      <Sheet open={fab} onClose={() => setFab(false)} title="บันทึกอะไรดี" sub="เลือกรายการที่ต้องการบันทึกได้เลย">
        {quick.map(([e, label, target, bg, fg]) => (
          <button key={label} className="fab-sheet-item" onClick={() => { setFab(false); goto(target); }}>
            <span className="fab-ic" style={{ background: bg, color: fg }}>{e}</span>
            <span style={{ flex: 1, fontWeight: 600, color: "var(--navy)", fontSize: 14.5 }}>{label}</span>
            <span style={{ color: "var(--ink-soft)" }}>{I.arrow}</span>
          </button>
        ))}
      </Sheet>

      <Sheet open={!!follow} onClose={() => setFollow(null)}
        title={follow?.action}
        sub={follow ? (() => { const st = STUDENTS.find((x) => x.id === follow.sid); return st ? `${nameOf(st)} · ${st.room}` : ""; })() : ""}>
        {follow && (
          <>
            <div className="card" style={{ background: "var(--cream)", boxShadow: "none", marginBottom: 16 }}>
              <div style={{ fontSize: 13.5, color: "var(--ink-mid)", lineHeight: 1.6 }}>{follow.reason}</div>
            </div>
            <div className="field">
              <label>บันทึกสิ่งที่ดำเนินการ <span className="hint">จำเป็น</span></label>
              <textarea className="inp" autoFocus value={followNote}
                onChange={(e) => setFollowNote(e.target.value)}
                placeholder="เช่น โทรหาผู้ปกครองแล้ว ทราบว่านักเรียนป่วย นัดพบวันจันทร์" />
            </div>
            <div className="privacy" style={{ marginTop: 0, marginBottom: 16 }}>{I.shield}
              <span>บันทึกนี้จะถูกเก็บพร้อมชื่อผู้บันทึกและเวลา แก้ย้อนหลังไม่ได้ เขียนตามที่เกิดขึ้นจริง</span>
            </div>
            <div style={{ display: "flex", gap: 9 }}>
              <button className="btn btn-ghost" onClick={() => setFollow(null)}>ยกเลิก</button>
              <button className="btn btn-primary" style={{ flex: 1 }}
                disabled={followNote.trim().length < 5}
                onClick={() => { markDone(follow.id, followNote.trim()); setFollow(null); }}>
                บันทึกการติดตาม
              </button>
            </div>
          </>
        )}
      </Sheet>

      {locked && (
        <LockScreen user={user} onUnlock={() => setLocked(false)}
          onLogout={async () => { if (LIVE) await window.auth.signOut(); setLocked(false); setUser(null); setPage("overview"); setStudent(null); }} />
      )}
      <Confetti on={party} />
      <CareBubble bub={bub} onClose={() => setBub(null)} onAct={(to) => goto(to)} />
      <Toast msg={msg} />
    </div>
  );
}

export default function App() {
  return (
    <Boundary>
      <AppInner />
    </Boundary>
  );
}
