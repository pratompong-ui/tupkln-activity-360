import React, { useState, useEffect, useRef, useMemo } from "react";

/* ============================================================
   TUPKLN ACTIVITY 360 — ปฏิทินกิจกรรมและบันทึกผู้ไม่เข้าร่วม
   โรงเรียนเตรียมอุดมศึกษาพัฒนาการเขลางค์นคร
   ============================================================ */

const KEY = "tupkln_activity_v4";
const MYUNIT = "tupkln_my_unit";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap');

.tp *{box-sizing:border-box;}
.tp{
  --navy:#16205C; --navy-2:#243477; --ink:#101840;
  --pink:#E01B6E; --pink-2:#FF5E9D; --softpink:#FFE1EC;
  --cream:#FBF6F2; --lightblue:#E8EEFF; --gray:#7B819B; --line:#EDE6E1;
  --green:#17A673; --orange:#EF8033; --red:#E14848; --blue:#3B72E8;
  font-family:'IBM Plex Sans Thai',system-ui,sans-serif;
  color:var(--ink); background:var(--cream);
  min-height:100vh; display:flex; font-size:15px; line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
.tp button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit;}
.tp input,.tp textarea,.tp select{font-family:inherit;font-size:15px;color:inherit;}
.tp h1,.tp h2,.tp h3,.tp h4{margin:0;font-weight:600;letter-spacing:-.01em;}
.tp a{color:var(--pink);}

.sidebar{width:250px;flex-shrink:0;background:#fff;border-right:1px solid var(--line);
  padding:22px 14px;position:sticky;top:0;height:100vh;overflow-y:auto;}
.brandbox{display:flex;gap:11px;align-items:center;padding:0 8px 18px;}
.brandmark{width:42px;height:42px;border-radius:14px;background:linear-gradient(145deg,var(--navy),var(--navy-2));display:grid;place-items:center;flex-shrink:0;}
.brandname{font-weight:700;font-size:15px;line-height:1.25;color:var(--navy);}
.brandsub{font-size:11.5px;color:var(--gray);line-height:1.3;}
.navgroup{font-size:11.5px;color:var(--gray);padding:14px 12px 6px;font-weight:500;}
.navitem{display:flex;align-items:center;gap:11px;width:100%;padding:10px 12px;border-radius:14px;
  font-size:14.5px;color:#4A5069;transition:background .18s ease,color .18s ease,transform .18s ease;text-align:left;}
.navitem:hover{background:var(--cream);transform:translateX(2px);}
.navitem.on{background:var(--softpink);color:var(--pink);font-weight:600;}
.navitem .ic{width:22px;text-align:center;font-size:16px;}
.navbadge{margin-left:auto;background:var(--pink);color:#fff;font-size:11px;font-weight:600;border-radius:20px;padding:1px 8px;}

.main{flex:1;min-width:0;padding:26px 30px 120px;max-width:1180px;}
.topbar{display:flex;align-items:center;gap:12px;margin-bottom:22px;flex-wrap:wrap;}
.topbar .grow{flex:1;}
.mobilebrand{display:none;}

.card{background:#fff;border-radius:22px;padding:20px 22px;box-shadow:0 2px 14px rgba(22,32,92,.06);}
.sectitle{display:flex;align-items:center;gap:10px;margin:28px 0 14px;flex-wrap:wrap;}
.sectitle h2{font-size:18px;}
.sectitle .cnt{font-size:13px;color:var(--gray);font-weight:400;}

.hero{position:relative;overflow:hidden;border-radius:26px;padding:24px 28px;
  background:linear-gradient(120deg,#1A2569 0%,#2C3B8C 55%,#5C3A8E 100%);
  color:#fff;display:flex;align-items:center;gap:20px;}
.hero:after{content:"";position:absolute;right:-70px;top:-90px;width:260px;height:260px;border-radius:50%;
  background:radial-gradient(circle,rgba(255,94,157,.45),transparent 68%);}
.hero .htext{flex:1;position:relative;z-index:2;}
.hero h1{font-size:23px;font-weight:700;margin-bottom:6px;}
.hero p{margin:0;color:#D7DDFF;font-size:14.5px;max-width:54ch;}
.hero .hmascot{position:relative;z-index:2;flex-shrink:0;}
.herochips{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;}
.hchip{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);border-radius:20px;
  padding:5px 13px;font-size:13px;display:flex;gap:7px;align-items:center;}
.hchip.hot{background:var(--pink);border-color:var(--pink);font-weight:600;}

.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.stat{background:#fff;border-radius:20px;padding:17px 18px;box-shadow:0 2px 14px rgba(22,32,92,.06);
  transition:transform .2s ease,box-shadow .2s ease;}
.stat:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(22,32,92,.11);}
.stat .sic{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;font-size:18px;margin-bottom:11px;}
.stat .snum{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1;}
.stat .snum small{font-size:14px;font-weight:500;color:var(--gray);margin-left:3px;}
.stat .slab{font-size:13.5px;color:var(--gray);}

.calbar{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap;}
.calmonth{font-size:19px;font-weight:700;color:var(--navy);min-width:185px;}
.arrow{width:38px;height:38px;border-radius:13px;background:var(--cream);display:grid;place-items:center;
  color:var(--navy);font-size:17px;transition:background .18s ease,transform .14s ease;}
.arrow:hover{background:var(--softpink);color:var(--pink);}
.arrow:active{transform:scale(.92);}
.caldow{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px;}
.caldow span{text-align:center;font-size:12.5px;color:var(--gray);font-weight:600;padding:4px 0;}
.caldow span.we{color:var(--pink);}
.calgrid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}
.cday{min-height:108px;min-width:0;border-radius:16px;background:var(--cream);padding:7px 8px;text-align:left;
  display:flex;flex-direction:column;gap:4px;transition:background .18s ease,box-shadow .18s ease,transform .14s ease;
  border:2px solid transparent;overflow:hidden;}
.cday:hover{background:#F4EDE8;transform:translateY(-2px);}
.cday.out{opacity:.35;}
.cday.today{background:#fff;border-color:var(--pink-2);}
.cday.sel{background:#fff;border-color:var(--navy);box-shadow:0 6px 18px rgba(22,32,92,.14);}
.cday.has .cnum{color:var(--navy);font-weight:700;}
.daypanel{scroll-margin-top:14px;}
.cnum{font-size:13px;font-weight:600;color:#4A5069;}
.cday.today .cnum{color:var(--pink);}
.pill{font-size:11px;font-weight:600;border-radius:8px;padding:3px 6px;color:#fff;
  line-height:1.35;width:100%;max-width:100%;min-width:0;text-align:left;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;}
.pill.mine{outline:2px solid var(--navy);outline-offset:1px;}
.pmore{font-size:11px;color:var(--gray);padding-left:3px;}
.cdots{display:none;gap:3px;flex-wrap:wrap;}
.cdot{width:7px;height:7px;border-radius:50%;}
.legend{display:flex;gap:7px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--line);}
.lg{display:flex;align-items:center;gap:6px;font-size:12.5px;color:#4A5069;background:var(--cream);
  border-radius:20px;padding:4px 11px;}
.lg b{width:9px;height:9px;border-radius:50%;display:inline-block;}

.attgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px;}
.att{background:#fff;border-radius:22px;padding:18px 20px;box-shadow:0 2px 14px rgba(22,32,92,.06);
  border-left:5px solid var(--line);transition:transform .2s ease,box-shadow .2s ease;animation:rise .35s ease both;}
.att:hover{transform:translateY(-3px);box-shadow:0 12px 26px rgba(22,32,92,.10);}
.att.s-todo{border-left-color:var(--orange);}
.att.s-wait{border-left-color:var(--blue);}
.att.s-done{border-left-color:var(--green);}
.att.s-none{border-left-color:var(--gray);}
.attno{font-size:12px;font-weight:600;color:var(--pink);background:var(--softpink);
  border-radius:9px;padding:2px 9px;display:inline-block;}
.att h3{font-size:16px;margin:9px 0 8px;line-height:1.45;}
.attmeta{overflow-wrap:anywhere;font-size:13.5px;color:var(--gray);display:flex;gap:7px;align-items:flex-start;margin-bottom:4px;}
.attmeta b{color:#4A5069;font-weight:600;}
.attfoot{display:flex;gap:9px;margin-top:14px;flex-wrap:wrap;}

.badge{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;border-radius:20px;padding:4px 11px;}
.b-done{background:#E3F7EF;color:var(--green);}
.b-todo{background:#FDEEE2;color:#C4661F;}
.b-wait{background:var(--lightblue);color:#2C56B8;}
.b-none{background:#F1F1F4;color:#6A6F85;}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:14px;
  padding:9px 16px;font-size:14px;font-weight:600;transition:transform .14s ease,background .18s ease,box-shadow .18s ease;}
.btn:active{transform:scale(.96);}
.btn-p{background:var(--pink);color:#fff;box-shadow:0 4px 12px rgba(224,27,110,.26);}
.btn-p:hover{background:#C9185F;}
.btn-n{background:var(--navy);color:#fff;}
.btn-n:hover{background:var(--navy-2);}
.btn-g{background:var(--cream);color:#4A5069;border:1px solid var(--line);}
.btn-g:hover{background:#F3EBE5;}
.btn-sm{padding:7px 13px;font-size:13px;border-radius:12px;}
.btn-danger{background:#FBE6E6;color:var(--red);}
.btn:disabled{opacity:.45;cursor:not-allowed;}

.bar{height:9px;border-radius:20px;background:#F0EAE6;overflow:hidden;}
.bar span{display:block;height:100%;border-radius:20px;background:linear-gradient(90deg,var(--pink-2),var(--pink));
  transition:width .9s cubic-bezier(.22,1,.36,1);}

.urow{display:flex;align-items:center;gap:14px;padding:12px 4px;border-bottom:1px solid var(--line);}
.urow:last-child{border-bottom:none;}
.uav{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;font-weight:700;
  font-size:14px;color:#fff;flex-shrink:0;}
.uname{font-weight:600;font-size:14.5px;}
.usub{font-size:12.5px;color:var(--gray);}

.plist{display:flex;flex-direction:column;gap:9px;}
.prow{display:flex;align-items:center;gap:12px;background:var(--cream);border-radius:15px;padding:10px 14px;
  animation:rise .3s ease both;}
.pav{width:33px;height:33px;border-radius:11px;background:#fff;display:grid;place-items:center;
  font-weight:700;color:var(--pink);font-size:14px;flex-shrink:0;box-shadow:0 1px 4px rgba(22,32,92,.08);}

.field{margin-bottom:14px;}
.field label{display:block;font-size:13px;font-weight:600;color:#4A5069;margin-bottom:6px;}
.inp{width:100%;border:1.5px solid var(--line);border-radius:14px;padding:10px 14px;background:#fff;
  outline:none;transition:border-color .18s ease,box-shadow .18s ease;}
.inp:focus{border-color:var(--pink-2);box-shadow:0 0 0 4px rgba(255,94,157,.14);}
textarea.inp{min-height:70px;resize:vertical;}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

.ovl{position:fixed;inset:0;background:rgba(16,24,64,.42);backdrop-filter:blur(3px);
  display:flex;align-items:center;justify-content:center;padding:20px;z-index:60;animation:fade .2s ease;}
.modal{background:#fff;border-radius:26px;width:100%;max-width:560px;max-height:88vh;overflow-y:auto;
  padding:24px 26px;box-shadow:0 24px 60px rgba(16,24,64,.28);animation:pop .28s cubic-bezier(.22,1.2,.36,1);}
.mhead{display:flex;align-items:flex-start;gap:12px;margin-bottom:18px;}
.mhead h3{font-size:18px;}
.mhead p{margin:2px 0 0;font-size:13px;color:var(--gray);}
.x{margin-left:auto;width:34px;height:34px;border-radius:12px;background:var(--cream);display:grid;place-items:center;color:var(--gray);}
.x:hover{background:#F1E8E2;}

.empty{text-align:center;padding:34px 20px;}
.empty p{color:var(--gray);margin:10px 0 0;font-size:14px;}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
.chip{border:1.5px solid var(--line);background:#fff;border-radius:20px;padding:6px 14px;font-size:13.5px;
  color:#4A5069;transition:all .18s ease;display:inline-flex;align-items:center;gap:7px;}
.chip:hover{border-color:var(--pink-2);}
.chip.on{background:var(--navy);border-color:var(--navy);color:#fff;font-weight:600;}
.toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%);background:var(--navy);color:#fff;
  border-radius:18px;padding:12px 20px;font-size:14px;display:flex;gap:10px;align-items:center;z-index:90;
  box-shadow:0 12px 30px rgba(16,24,64,.3);animation:pop .3s cubic-bezier(.22,1.2,.36,1);}
.skel{background:linear-gradient(90deg,#F1EBE6,#F8F4F1,#F1EBE6);background-size:200% 100%;
  animation:shim 1.3s infinite;border-radius:18px;}
.roleTag{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);
  border-radius:16px;padding:7px 13px;font-size:13px;font-weight:600;}
.dot{width:8px;height:8px;border-radius:50%;}
.bnav{display:none;}

@keyframes rise{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
@keyframes pop{from{opacity:0;transform:scale(.94);}to{opacity:1;transform:scale(1);}}
@keyframes fade{from{opacity:0;}to{opacity:1;}}
@keyframes shim{from{background-position:200% 0;}to{background-position:-200% 0;}}
@keyframes draw{to{stroke-dashoffset:0;}}
.check circle{animation:pop .3s ease both;}
.check path{stroke-dasharray:30;stroke-dashoffset:30;animation:draw .45s .15s ease forwards;}

/* ---------- ลูกเล่นภาพและการเคลื่อนไหว ---------- */
@keyframes floaty{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
@keyframes floaty2{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-15px) rotate(7deg);}}
@keyframes pulsering{0%{box-shadow:0 0 0 0 rgba(224,27,110,.30);}70%{box-shadow:0 0 0 9px rgba(224,27,110,0);}100%{box-shadow:0 0 0 0 rgba(224,27,110,0);}}
@keyframes growbar{from{transform:scaleY(.2);opacity:0;}to{transform:scaleY(1);opacity:1;}}
@keyframes sheen{0%{transform:translateX(-130%);}55%,100%{transform:translateX(240%);}}
@keyframes popin{from{opacity:0;transform:translateY(14px) scale(.97);}to{opacity:1;transform:none;}}

.float{animation:floaty 5.5s ease-in-out infinite;}
.hero:before{content:"";position:absolute;inset:0;pointer-events:none;
  background-image:radial-gradient(rgba(255,255,255,.15) 1px,transparent 1px);background-size:22px 22px;opacity:.45;}
.hero .bubble{position:absolute;border-radius:50%;background:rgba(255,255,255,.10);pointer-events:none;z-index:1;}
.hero .b1{width:130px;height:130px;left:-38px;bottom:-56px;animation:floaty 9s ease-in-out infinite;}
.hero .b2{width:60px;height:60px;left:40%;top:-24px;animation:floaty2 12s ease-in-out infinite;}
.hero .b3{width:24px;height:24px;left:26%;bottom:16px;background:rgba(255,94,157,.40);animation:floaty 7s ease-in-out infinite;}
.hero h1,.hero p,.herochips{position:relative;z-index:2;}

.stat{position:relative;overflow:hidden;}
.stat .sic{transition:transform .26s cubic-bezier(.22,1.2,.36,1);}
.stat:hover .sic{transform:scale(1.1) rotate(-5deg);}
.stat:after{content:"";position:absolute;top:0;bottom:0;width:38%;left:0;pointer-events:none;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:translateX(-130%);}
.stat:hover:after{animation:sheen 1.1s ease;}

.cday.today{animation:pulsering 3.4s ease-out infinite;}
.pill{transition:transform .16s ease,filter .16s ease;}
.cday:hover .pill{transform:translateX(2px);filter:brightness(1.07);}

.att{animation:popin .42s cubic-bezier(.22,1,.36,1) both;}
.att:nth-child(2){animation-delay:.05s;} .att:nth-child(3){animation-delay:.10s;}
.att:nth-child(4){animation-delay:.15s;} .att:nth-child(5){animation-delay:.20s;}
.att:nth-child(6){animation-delay:.25s;} .att:nth-child(7){animation-delay:.30s;}
.att:nth-child(n+8){animation-delay:.34s;}
.prow{transition:transform .16s ease,background .18s ease;}
.prow:hover{transform:translateX(3px);background:#F5EDE7;}

.navitem.on{position:relative;}
.navitem.on:before{content:"";position:absolute;left:3px;top:9px;bottom:9px;width:3px;border-radius:3px;
  background:var(--pink);animation:growbar .3s ease both;}
.btn-p:hover,.btn-n:hover{transform:translateY(-1px);}
.arrow{transition:background .18s ease,transform .18s cubic-bezier(.22,1.2,.36,1);}
.arrow:hover{transform:scale(1.08);}
.chip{transition:all .18s cubic-bezier(.22,1.2,.36,1);}
.chip:hover{transform:translateY(-1px);}
.empty svg{animation:floaty 4.5s ease-in-out infinite;}

/* ---------- การ์ดกิจกรรมถัดไป / ฉลอง / ภาพประจำเดือน ---------- */
.nextcard{position:relative;overflow:hidden;border-radius:24px;padding:20px 22px;margin-top:16px;
  background:linear-gradient(120deg,#FFF1F6 0%,#FFE7F0 45%,#EEF2FF 100%);
  display:flex;gap:18px;align-items:center;box-shadow:0 2px 14px rgba(22,32,92,.06);}
.nextcard .nlab{font-size:12px;font-weight:700;color:var(--pink);letter-spacing:.04em;}
.nextcard h3{font-size:19px;line-height:1.4;margin:6px 0 8px;}
.nextcard .nmeta{font-size:13.5px;color:#4A5069;display:flex;gap:14px;flex-wrap:wrap;}
.countbox{flex-shrink:0;width:96px;height:96px;border-radius:26px;background:#fff;display:flex;
  flex-direction:column;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(224,27,110,.16);}
.countbox b{font-size:32px;line-height:1;color:var(--pink);}
.countbox span{font-size:12px;color:var(--gray);margin-top:3px;}
.monthemoji{font-size:20px;margin-left:2px;}

.confetti{position:fixed;inset:0;pointer-events:none;z-index:120;overflow:hidden;}
.confetti i{position:absolute;top:-14px;width:9px;height:14px;border-radius:2px;opacity:.95;
  animation:fall 2.6s cubic-bezier(.3,.7,.5,1) forwards;}
@keyframes fall{0%{transform:translateY(-10vh) rotate(0deg);}100%{transform:translateY(108vh) rotate(680deg);}}
.partybox{position:fixed;left:50%;top:34%;transform:translate(-50%,-50%);z-index:121;background:#fff;
  border-radius:26px;padding:24px 30px;text-align:center;box-shadow:0 24px 60px rgba(16,24,64,.26);
  animation:pop .35s cubic-bezier(.22,1.2,.36,1);}

/* ---------- กราฟและลูกเล่นเพิ่มเติม ---------- */
@keyframes gradmove{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
@keyframes growbarv{from{height:0;}}
@keyframes growbarh{from{width:0;}}
@keyframes bounce{0%,100%{transform:translateY(0);}30%{transform:translateY(-14px);}55%{transform:translateY(0);}75%{transform:translateY(-6px);}}
.hero{background-size:180% 180%;animation:gradmove 18s ease-in-out infinite;}
.pagewrap{animation:popin .34s cubic-bezier(.22,1,.36,1) both;}

.att:before{content:"";position:absolute;left:0;right:0;top:0;height:3px;opacity:0;transition:opacity .22s ease;
  background:linear-gradient(90deg,var(--pink-2),var(--navy));}
.att:hover:before{opacity:1;}

.hmascot{cursor:pointer;}
.hmascot.bounce{animation:bounce .9s cubic-bezier(.28,.9,.4,1);}
.bubble-say{position:absolute;right:8px;top:-6px;background:#fff;color:var(--ink);border-radius:16px 16px 4px 16px;
  padding:9px 14px;font-size:13.5px;max-width:230px;box-shadow:0 8px 22px rgba(16,24,64,.22);z-index:5;
  animation:pop .28s cubic-bezier(.22,1.2,.36,1);}

.chartcard{display:flex;gap:26px;flex-wrap:wrap;}
.mbars{display:flex;align-items:flex-end;gap:8px;height:130px;flex:1;min-width:280px;}
.mbar{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;justify-content:flex-end;height:100%;}
.mbar .bcol{width:100%;border-radius:9px 9px 4px 4px;background:linear-gradient(180deg,var(--pink-2),var(--pink));
  animation:growbarv .9s cubic-bezier(.22,1,.36,1) both;min-height:4px;position:relative;}
.mbar.zero .bcol{background:#EFE8E3;}
.mbar.now .bcol{background:linear-gradient(180deg,#4C63C9,var(--navy));}
.mbar small{font-size:10.5px;color:var(--gray);}
.mbar b{font-size:11.5px;color:var(--navy);}
.catrow{display:flex;align-items:center;gap:10px;margin-bottom:9px;}
.catrow .cname{font-size:13.5px;width:132px;flex-shrink:0;}
.catrow .ctrack{flex:1;height:14px;border-radius:20px;background:#F2ECE8;overflow:hidden;}
.catrow .cfill{height:100%;border-radius:20px;animation:growbarh 1s cubic-bezier(.22,1,.36,1) both;}
.catrow .cnum2{font-size:13px;font-weight:700;color:var(--navy);width:26px;text-align:right;}

/* ---------- แถบภาพประจำเดือน / ความคืบหน้าปีการศึกษา / ไทม์ไลน์ ---------- */
.monthbanner{position:relative;height:72px;border-radius:18px;margin-bottom:14px;overflow:hidden;
  display:flex;align-items:center;padding:0 20px;}
.monthbanner .mb-emoji{position:absolute;right:16px;bottom:-14px;font-size:74px;opacity:.28;
  animation:floaty 7s ease-in-out infinite;}
.monthbanner .mb-t{position:relative;z-index:2;color:#fff;font-weight:700;font-size:17px;
  text-shadow:0 1px 6px rgba(16,24,64,.28);}
.monthbanner .mb-s{position:relative;z-index:2;color:rgba(255,255,255,.92);font-size:12.5px;}
.monthbanner .mb-c{position:absolute;border-radius:50%;background:rgba(255,255,255,.16);}

.yearbar{margin-top:14px;position:relative;}
.yearbar .yt{height:8px;border-radius:20px;background:rgba(255,255,255,.22);overflow:hidden;}
.yearbar .yf{height:100%;border-radius:20px;background:linear-gradient(90deg,#FF9CC4,var(--pink));
  animation:growbarh 1.2s cubic-bezier(.22,1,.36,1) both;}
.yearbar .ylab{display:flex;justify-content:space-between;font-size:11.5px;color:#D7DDFF;margin-top:6px;}

.tl{position:relative;padding-left:26px;}
.tl:before{content:"";position:absolute;left:7px;top:6px;bottom:6px;width:3px;border-radius:3px;
  background:linear-gradient(180deg,var(--softpink),var(--lightblue));}
.tlmonth{font-size:13px;font-weight:700;color:var(--navy);margin:16px 0 8px;position:relative;}
.tlmonth:first-child{margin-top:0;}
.tlitem{position:relative;padding:9px 12px;border-radius:14px;background:var(--cream);margin-bottom:8px;
  animation:popin .4s cubic-bezier(.22,1,.36,1) both;}
.tlitem:hover{background:#F5EDE7;}
.tlitem .tdot{position:absolute;left:-24px;top:15px;width:13px;height:13px;border-radius:50%;
  border:3px solid #fff;box-shadow:0 0 0 2px rgba(22,32,92,.08);}
.tlitem .tt{font-weight:600;font-size:14px;line-height:1.4;}

/* ---------- หน้าจอเปิดระบบ ---------- */
.splash{min-height:100vh;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
  background:linear-gradient(140deg,#1A2569,#2C3B8C 55%,#5C3A8E);color:#fff;text-align:center;padding:24px;}
.splash h2{font-size:19px;font-weight:700;}
.splash p{margin:0;color:#D7DDFF;font-size:14px;}
.dots span{display:inline-block;width:9px;height:9px;border-radius:50%;background:#FF5E9D;margin:0 3px;
  animation:blink 1.1s infinite;}
.dots span:nth-child(2){animation-delay:.18s;} .dots span:nth-child(3){animation-delay:.36s;}
@keyframes blink{0%,80%,100%{opacity:.25;transform:translateY(0);}40%{opacity:1;transform:translateY(-5px);}}

/* ---------- โปสเตอร์ประชาสัมพันธ์ ---------- */
.posterbox{width:360px;max-width:100%;border-radius:26px;overflow:hidden;background:#fff;
  box-shadow:0 24px 60px rgba(16,24,64,.30);animation:pop .3s cubic-bezier(.22,1.2,.36,1);}
.ptop{position:relative;padding:22px 22px 26px;color:#fff;overflow:hidden;}
.ptop .pc{position:absolute;border-radius:50%;background:rgba(255,255,255,.15);}
.ptop .pcat{font-size:12.5px;font-weight:600;background:rgba(255,255,255,.2);border-radius:20px;
  padding:4px 12px;display:inline-block;position:relative;z-index:2;}
.ptop h3{font-size:21px;line-height:1.4;margin:12px 0 0;position:relative;z-index:2;text-shadow:0 1px 8px rgba(16,24,64,.25);}
.pdate{display:flex;align-items:center;gap:14px;padding:16px 22px;background:var(--cream);}
.pdate .pd{width:64px;height:64px;border-radius:20px;background:#fff;display:flex;flex-direction:column;
  align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 14px rgba(22,32,92,.12);}
.pdate .pd b{font-size:26px;line-height:1;color:var(--pink);}
.pdate .pd span{font-size:11.5px;color:var(--gray);}
.pbody{padding:16px 22px 8px;display:flex;flex-direction:column;gap:8px;font-size:14px;color:#4A5069;}
.pfoot{padding:14px 22px 18px;border-top:1px solid var(--line);display:flex;align-items:center;gap:10px;}
.pfoot div{font-size:12px;color:var(--gray);line-height:1.4;}
@media print{
  .tp.posteropen .sidebar,.tp.posteropen .main,.tp.posteropen .bnav,.tp.posteropen .noposter{display:none !important;}
  .tp.posteropen .ovl{position:static;background:none;backdrop-filter:none;padding:0;display:block;}
  .tp.posteropen .posterbox{box-shadow:none;width:100%;}
}

/* ---------- ขยายองค์ประกอบภาพให้เด่นขึ้น ---------- */
.hero{padding:30px 34px;}
.hero h1{font-size:26px;}
.hero .hmascot{transition:transform .3s cubic-bezier(.22,1.2,.36,1);}
.hero .hmascot:hover{transform:scale(1.06);}
.stat .sic{width:44px;height:44px;border-radius:15px;font-size:21px;}
.stat .snum{font-size:33px;}
.cday{min-height:120px;}
.pill{font-size:11.5px;}
.brandmark{width:48px;height:48px;border-radius:16px;}
.countbox{width:108px;height:108px;border-radius:30px;}
.countbox b{font-size:36px;}
.posterbox{width:390px;}
.ptop{padding:26px 24px 30px;}
.ptop h3{font-size:22px;}
.empty{padding:40px 20px;}
/* ---------- เช็กลิสต์เตรียมงาน ---------- */
.tkrow{display:flex;align-items:flex-start;gap:11px;background:var(--cream);border-radius:15px;padding:11px 14px;}
.tkrow.done{opacity:.6;}
.tkrow.done .tkt{text-decoration:line-through;}
.tkbox{width:22px;height:22px;border-radius:8px;border:2px solid var(--line);background:#fff;flex-shrink:0;
  display:grid;place-items:center;font-size:13px;color:#fff;transition:all .18s ease;margin-top:1px;}
.tkbox.on{background:var(--green);border-color:var(--green);}
.tkt{font-weight:600;font-size:14px;line-height:1.4;}
.tkmini{height:6px;border-radius:20px;background:#F0EAE6;overflow:hidden;width:110px;display:inline-block;
  vertical-align:middle;margin-left:8px;}
.tkmini span{display:block;height:100%;background:linear-gradient(90deg,#57C9A0,var(--green));
  transition:width .8s cubic-bezier(.22,1,.36,1);}
.duebad{font-size:11.5px;font-weight:700;border-radius:20px;padding:2px 9px;white-space:nowrap;}
.due-late{background:#FBE6E6;color:var(--red);}
.due-soon{background:#FDEEE2;color:#C4661F;}
.due-ok{background:var(--lightblue);color:#2C56B8;}

/* ---------- หนังสือเข้า / งานที่ได้รับมอบหมาย ---------- */
.doccard{background:#fff;border-radius:22px;padding:18px 20px;box-shadow:0 2px 14px rgba(22,32,92,.06);
  border-left:5px solid var(--line);animation:popin .4s cubic-bezier(.22,1,.36,1) both;position:relative;overflow:hidden;}
.doccard:hover{transform:translateY(-3px);box-shadow:0 12px 26px rgba(22,32,92,.10);}
.doccard{transition:transform .2s ease,box-shadow .2s ease;}
.d-new{border-left-color:var(--blue);} .d-assigned{border-left-color:#7B54D3;}
.d-doing{border-left-color:var(--orange);} .d-done{border-left-color:var(--green);}
.d-skip{border-left-color:var(--gray);}
.docno{font-size:12px;font-weight:600;color:var(--navy);background:var(--lightblue);
  border-radius:9px;padding:2px 9px;display:inline-block;}
.doccard h3{font-size:16px;line-height:1.45;margin:9px 0 8px;}
.steps{display:flex;align-items:center;gap:0;margin:14px 0 4px;}
.step{flex:1;display:flex;align-items:center;}
.step i{width:14px;height:14px;border-radius:50%;background:#E7E0DA;flex-shrink:0;transition:background .3s ease;}
.step.on i{background:var(--pink);box-shadow:0 0 0 4px rgba(224,27,110,.14);}
.step b{flex:1;height:3px;background:#EFE8E3;}
.step.on b{background:var(--pink-2);}
.steplab{display:flex;justify-content:space-between;font-size:10.5px;color:var(--gray);margin-top:2px;}

@media (max-width:900px){
  .hero{padding:22px;}
  .hero h1{font-size:22px;}
  .hero .hmascot svg{width:112px !important;height:112px !important;}
  .cday{min-height:60px;}
  .stat .snum{font-size:29px;}
  .countbox{width:88px;height:88px;border-radius:24px;}
  .countbox b{font-size:29px;}
}

@media (max-width:900px){
  .tp{flex-direction:column;}
  .sidebar{display:none;}
  .main{padding:16px 15px 120px;width:100%;}
  .mobilebrand{display:flex;gap:10px;align-items:center;width:100%;}
  .stats{grid-template-columns:1fr;gap:11px;}
  .hero{flex-direction:column;align-items:flex-start;padding:22px;}
  .hero .hmascot{align-self:flex-end;margin-top:-58px;}
  .attgrid{grid-template-columns:1fr;}
  .row2{grid-template-columns:1fr;}
  .card{padding:16px 14px;}
  .calgrid{gap:4px;}
  .cday{min-height:58px;padding:5px 4px;align-items:center;gap:3px;}
  .cnum{font-size:12.5px;}
  .pill,.pmore{display:none;}
  .cdots{display:flex;justify-content:center;}
  .calmonth{min-width:0;font-size:17px;}
  .bnav{display:flex;position:fixed;left:0;right:0;bottom:0;background:#fff;border-top:1px solid var(--line);
    padding:8px 6px calc(8px + env(safe-area-inset-bottom));justify-content:space-around;align-items:center;z-index:50;}
  .bitem{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px;color:var(--gray);padding:5px 0;}
  .bitem.on{color:var(--pink);font-weight:600;}
  .bplus{width:52px;height:52px;border-radius:20px;background:var(--pink);color:#fff;display:grid;place-items:center;
    font-size:26px;margin-top:-22px;box-shadow:0 8px 20px rgba(224,27,110,.36);}
}
@media print{
  .sidebar,.bnav,.noprint,.noprint-cal{display:none !important;}
  .calgrid{gap:4px;} .cday{min-height:82px;background:#fff;border:1px solid #ddd;}
  .pill{-webkit-line-clamp:3;}
  .tp{background:#fff;} .main{padding:0;max-width:none;}
  .card,.att,.stat{box-shadow:none;border:1px solid #ddd;break-inside:avoid;}
}
@media (prefers-reduced-motion:reduce){
  .tp *{animation-duration:.01ms !important;transition-duration:.01ms !important;}
}
`;

/* ===================== SEED ===================== */
const UNITS = [
  { id: "s1", name: "ภาษาไทย", short: "ทย", type: "กลุ่มสาระการเรียนรู้" },
  { id: "s2", name: "คณิตศาสตร์", short: "คณ", type: "กลุ่มสาระการเรียนรู้" },
  { id: "s3", name: "วิทยาศาสตร์และเทคโนโลยี", short: "วท", type: "กลุ่มสาระการเรียนรู้" },
  { id: "s4", name: "สังคมศึกษา ศาสนาและวัฒนธรรม", short: "สค", type: "กลุ่มสาระการเรียนรู้" },
  { id: "s5", name: "สุขศึกษาและพลศึกษา", short: "สข", type: "กลุ่มสาระการเรียนรู้" },
  { id: "s6", name: "ศิลปะ", short: "ศป", type: "กลุ่มสาระการเรียนรู้" },
  { id: "s7", name: "การงานอาชีพ", short: "กง", type: "กลุ่มสาระการเรียนรู้" },
  { id: "s8", name: "ภาษาต่างประเทศ", short: "ตป", type: "กลุ่มสาระการเรียนรู้" },
  { id: "s9", name: "กิจกรรมพัฒนาผู้เรียน", short: "กพ", type: "กลุ่มสาระการเรียนรู้" },
  { id: "b1", name: "กลุ่มบริหารวิชาการ", short: "วช", type: "กลุ่มบริหาร" },
  { id: "b2", name: "กลุ่มบริหารงบประมาณ", short: "งป", type: "กลุ่มบริหาร" },
  { id: "b3", name: "กลุ่มบริหารทั่วไป", short: "ทว", type: "กลุ่มบริหาร" },
  { id: "b4", name: "กลุ่มบริหารงานบุคคล", short: "บค", type: "กลุ่มบริหาร" },
];
/* แปลงรหัสกลุ่มเดิมให้ตรงโครงสร้างใหม่ เผื่อมีข้อมูลที่บันทึกไว้ก่อนหน้า */
const REMAP = { u1: "s6", u2: "s2", u3: "s4", u4: "s3", u5: "s8", u6: "s1",
  g1: "b1", g2: "", g3: "b2", g4: "b3", g5: "b4" };

const COLORS = ["#E01B6E", "#3B72E8", "#17A673", "#EF8033", "#7B54D3", "#0E9BA8",
  "#D9A208", "#B0468C", "#4B7A3F", "#16205C", "#C2410C", "#0F766E", "#7E1D5C"];

/* ประเภทกิจกรรม ใช้แสดงไอคอนและใช้กรองในรายงาน */
const CARE_SAYS = [
  "วันนี้มีอะไรให้ช่วยไหมครับ",
  "อย่าลืมกดเพิ่มลง Google ปฏิทินนะครับ",
  "กิจกรรมไหนจบแล้ว อย่าลืมสรุปด้วยนะครับ",
  "ขอบคุณคุณครูที่ดูแลนักเรียนครับ",
  "พักสายตาสักครู่ก็ได้นะครับ",
];

/* ประเภทหนังสือและสถานะการดำเนินการ */
const DOC_TYPES = [
  { id: "info", label: "แจ้งเพื่อทราบ", icon: "📄" },
  { id: "meet", label: "เชิญประชุม/อบรม", icon: "🎓" },
  { id: "contest", label: "เชิญแข่งขัน/ประกวด", icon: "🏆" },
  { id: "req", label: "ขอความอนุเคราะห์", icon: "🤲" },
  { id: "order", label: "สั่งการให้ดำเนินการ", icon: "📌" },
  { id: "other", label: "อื่น ๆ", icon: "🗂" },
];
const docTypeOf = (id) => DOC_TYPES.find((t) => t.id === id);
const DOC_STATUS = [
  { id: "new", label: "รับเรื่องแล้ว", cls: "b-wait" },
  { id: "assigned", label: "มอบหมายแล้ว", cls: "b-none" },
  { id: "doing", label: "กำลังดำเนินการ", cls: "b-todo" },
  { id: "done", label: "เสร็จสิ้น", cls: "b-done" },
  { id: "skip", label: "ไม่เข้าร่วม", cls: "b-none" },
];
const docStatusOf = (id) => DOC_STATUS.find((x) => x.id === id) || DOC_STATUS[0];
const STEP_FLOW = ["new", "assigned", "doing", "done"];

const CATS = [
  { id: "royal", label: "วันสำคัญของชาติ ศาสนา พระมหากษัตริย์", icon: "👑" },
  { id: "academic", label: "วิชาการและการเรียนการสอน", icon: "📚" },
  { id: "sport", label: "กีฬาและสุขภาพ", icon: "🏃" },
  { id: "moral", label: "คุณธรรม จริยธรรม ลูกเสือ", icon: "🤝" },
  { id: "art", label: "ศิลปะ ดนตรี วัฒนธรรม", icon: "🎨" },
  { id: "guide", label: "แนะแนว ศึกษาดูงาน", icon: "🧭" },
  { id: "admin", label: "ประชุม งานบริหาร งานประกัน", icon: "🗂" },
  { id: "other", label: "อื่น ๆ", icon: "📌" },
];
const isAdminUnit = (u) => /บริหาร/.test(u.type || "") || /^(กลุ่มบริหาร|หัวหน้าระดับ)/.test(u.name || "");
const unitsOfType = (units, t) => units.filter((u) => t === "กลุ่มบริหาร" ? isAdminUnit(u) : !isAdminUnit(u));
/* ชุดงานเตรียมมาตรฐานของโรงเรียน ตัวเลขคือจำนวนวันก่อนวันจัดกิจกรรม */
const TASK_TEMPLATE = [
  { title: "เสนอขออนุมัติโครงการ/กิจกรรม", before: 21 },
  { title: "จัดทำคำสั่งแต่งตั้งคณะกรรมการ", before: 14 },
  { title: "จองสถานที่และประสานฝ่ายอาคารสถานที่", before: 10 },
  { title: "จัดทำป้ายไวนิลและสื่อประชาสัมพันธ์", before: 7 },
  { title: "ประสานวิทยากร/แขกผู้มีเกียรติ", before: 7 },
  { title: "แจ้งกำหนดการให้คณะครูและนักเรียน", before: 3 },
  { title: "เตรียมเอกสารลงทะเบียนและอุปกรณ์", before: 1 },
  { title: "บันทึกภาพกิจกรรม", before: 0 },
  { title: "สรุปผลและรายงานผู้บริหาร", before: -7 },
];
const catOf = (id) => CATS.find((c) => c.id === id);
const MONTH_TONE = [
  ["#4C63C9","#7B54D3"], ["#E0558B","#F2856B"], ["#EF8033","#E8B14A"], ["#E14848","#EF8033"],
  ["#17A673","#57B96A"], ["#3B72E8","#4CA8D8"], ["#0E9BA8","#3B9BD8"], ["#2C56B8","#5C7BE0"],
  ["#B0468C","#E0558B"], ["#D9A208","#E8B14A"], ["#7B54D3","#9B6FD8"], ["#2B6FB8","#63A6D8"],
];
const MONTH_EMOJI = ["🎋","💐","🌸","🔥","🌱","☔","🕯","💙","🍂","🎗","🌾","❄"];

/* ปีการศึกษาไทย: เดือน พ.ค.–ธ.ค. = ปี พ.ศ. ปัจจุบัน, ม.ค.–เม.ย. = ปี พ.ศ. ก่อนหน้า */
const ACAD_YEAR = (() => {
  const d = new Date(), be = d.getFullYear() + 543;
  return d.getMonth() >= 4 ? be : be - 1;
})();

/* วันสำคัญที่โรงเรียนมักจัดพิธี ใช้เป็นปุ่มเลือกวันที่แบบเร็ว */
const KEY_DATES = [
  { md: "06-03", label: "3 มิ.ย. วันเฉลิมพระชนมพรรษา สมเด็จพระนางเจ้าฯ พระบรมราชินี" },
  { md: "07-04", label: "4 ก.ค. วันคล้ายวันประสูติ เจ้าฟ้าจุฬาภรณวลัยลักษณ์ฯ" },
  { md: "07-28", label: "28 ก.ค. วันเฉลิมพระชนมพรรษา พระบาทสมเด็จพระเจ้าอยู่หัว" },
  { md: "08-12", label: "12 ส.ค. วันเฉลิมพระชนมพรรษา สมเด็จพระบรมราชชนนีพันปีหลวง" },
  { md: "10-13", label: "13 ต.ค. วันนวมินทรมหาราช" },
  { md: "10-23", label: "23 ต.ค. วันปิยมหาราช" },
  { md: "12-05", label: "5 ธ.ค. วันคล้ายวันพระบรมราชสมภพ ร.9 / วันพ่อแห่งชาติ" },
  { md: "01-16", label: "16 ม.ค. วันครู" },
];

const SEED = {
  meta: { school: "โรงเรียนเตรียมอุดมศึกษาพัฒนาการเขลางค์นคร", year: `ปีการศึกษา ${ACAD_YEAR}` },
  units: UNITS,
  activities: [],
  docs: [],
};

/* ===================== helpers ===================== */
const uid = () => Math.random().toString(36).slice(2, 9);
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const TODAY = ymd(new Date());
const TOMORROW = ymd(new Date(Date.now() + 864e5));
const TH_M = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const TH_MS = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const DOW = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const thDate = (s) => {
  if (!s) return "";
  const p = s.split("-");
  return p.length === 3 ? `${Number(p[2])} ${TH_MS[Number(p[1]) - 1]} ${Number(p[0]) + 543}` : s;
};
const thFull = (s) => {
  if (!s) return "";
  const d = new Date(s + "T00:00:00");
  const dn = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"][d.getDay()];
  return `วัน${dn}ที่ ${d.getDate()} ${TH_M[d.getMonth()]} ${d.getFullYear() + 543}`;
};
/* ข้อความวันที่ รองรับกิจกรรมต่อเนื่องหลายวัน */
const spanText = (a) => {
  if (!a.date) return "";
  if (!a.dateEnd || a.dateEnd === a.date) return thDate(a.date);
  const p1 = a.date.split("-"), p2 = a.dateEnd.split("-");
  if (p1[0] === p2[0] && p1[1] === p2[1]) return `${Number(p1[2])}–${Number(p2[2])} ${TH_MS[Number(p2[1]) - 1]} ${Number(p2[0]) + 543}`;
  return `${thDate(a.date)} – ${thDate(a.dateEnd)}`;
};
const spanDays = (a) => {
  if (!a.date || !a.dateEnd || a.dateEnd <= a.date) return 1;
  return Math.round((new Date(a.dateEnd + "T00:00:00") - new Date(a.date + "T00:00:00")) / 864e5) + 1;
};
const lastDay = (a) => a.dateEnd && a.dateEnd > a.date ? a.dateEnd : a.date;

const taskStat = (a) => {
  const t = a.tasks || [];
  return { total: t.length, done: t.filter((x) => x.done).length,
    late: a.closed ? 0 : t.filter((x) => !x.done && x.due && x.due < TODAY).length };
};
const dueBadge = (due) => {
  if (!due) return null;
  const days = Math.round((new Date(due + "T00:00:00") - new Date(TODAY + "T00:00:00")) / 864e5);
  if (days < 0) return { cls: "due-late", text: `เลยกำหนด ${-days} วัน` };
  if (days === 0) return { cls: "due-late", text: "ครบกำหนดวันนี้" };
  if (days <= 7) return { cls: "due-soon", text: `อีก ${days} วัน` };
  return { cls: "due-ok", text: thDate(due) };
};

const statusOf = (a) => {
  if (!a.name) return "none";
  if (a.closed) return "done";
  if (!a.unitId) return "wait";
  return "todo";
};
const STATUS = {
  done: { label: "สรุปข้อมูลแล้ว", cls: "b-done", icon: "✓" },
  todo: { label: "รอบันทึกผู้ไม่เข้าร่วม", cls: "b-todo", icon: "●" },
  wait: { label: "ยังไม่มอบหมาย", cls: "b-wait", icon: "●" },
  none: { label: "ยังไม่ตั้งชื่องาน", cls: "b-none", icon: "○" },
};
const hhmm = (d) => `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;
/* ลิงก์เพิ่มกิจกรรมลง Google ปฏิทิน ใช้ได้ทั้งมือถือและคอมพิวเตอร์ */
const gcalUrl = (a, unitLabel) => {
  const end = new Date(lastDay(a) + "T00:00:00"); end.setDate(end.getDate() + 1);
  const details = [a.time ? "เวลา " + a.time : "", a.place ? "สถานที่ " + a.place : "",
    a.dress ? "การแต่งกาย " + a.dress : "", a.target ? "ผู้เข้าร่วม " + a.target : "",
    unitLabel ? "รับผิดชอบโดย " + unitLabel : "", a.docUrl ? "เอกสาร " + a.docUrl : ""]
    .filter(Boolean).join("\n");
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `งานที่ ${a.no} ${a.name || "กิจกรรมโรงเรียน"}`,
    dates: `${a.date.replace(/-/g, "")}/${ymd(end).replace(/-/g, "")}`,
    details,
    location: a.place || "",
  });
  return "https://calendar.google.com/calendar/render?" + q.toString();
};
/* ข้อความสรุปกิจกรรม สำหรับคัดลอกไปวางในไลน์ */
const lineText = (a, unitLabel) => [
  `📅 งานที่ ${a.no} ${a.name || "กิจกรรมโรงเรียน"}`,
  a.date ? `วันที่ ${spanText(a)}` : "",
  a.time ? `เวลา ${a.time} น.` : "",
  a.place ? `สถานที่ ${a.place}` : "",
  a.dress ? `การแต่งกาย ${a.dress}` : "",
  a.target ? `ผู้เข้าร่วม ${a.target}` : "",
  unitLabel ? `รับผิดชอบโดย ${unitLabel}` : "",
  a.docUrl ? `เอกสาร ${safeUrl(a.docUrl)}` : "",
].filter(Boolean).join("\n");

/* รับเฉพาะลิงก์ http/https กัน javascript: และเติม https:// ให้ลิงก์ที่พิมพ์มาไม่ครบ */
const safeUrl = (u) => {
  const v = String(u || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (/^(javascript|data|vbscript):/i.test(v)) return "";
  return "https://" + v.replace(/^\/+/, "");
};
const download = (name, text, mime) => {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
};
const icsOf = (list, unitName) => {
  const esc = (s) => String(s || "").replace(/\\/g, "\\\\").replace(/[,;]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const ev = list.filter((a) => a.date).map((a) => {
    const d = a.date.replace(/-/g, "");
    const end = new Date(lastDay(a) + "T00:00:00"); end.setDate(end.getDate() + 1);
    const desc = [a.time ? "เวลา " + a.time : "", a.dress ? "การแต่งกาย " + a.dress : "",
      a.target ? "กลุ่มเป้าหมาย " + a.target : "", unitName(a.unitId) ? "รับผิดชอบโดย " + unitName(a.unitId) : ""]
      .filter(Boolean).join(" / ");
    return ["BEGIN:VEVENT", `UID:${a.id}@tupkln`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${ymd(end).replace(/-/g, "")}`,
      `SUMMARY:${esc("งานที่ " + a.no + " " + (a.name || "กิจกรรมโรงเรียน"))}`,
      `DESCRIPTION:${esc(desc)}`, a.place ? `LOCATION:${esc(a.place)}` : "", "END:VEVENT"]
      .filter(Boolean).join("\r\n");
  });
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//TUPKLN//ACTIVITY360//TH", "CALSCALE:GREGORIAN",
    ...ev, "END:VCALENDAR"].join("\r\n");
};

/* ===================== visuals ===================== */
function Care({ size = 92, mood = "hello" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id="cbody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2B3A86" /><stop offset="1" stopColor="#16205C" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="108" rx="30" ry="6" fill="rgba(16,24,64,.16)" />
      {mood === "search" && <circle cx="97" cy="34" r="13" fill="none" stroke="#FF5E9D" strokeWidth="5" />}
      {mood === "search" && <line x1="105" y1="44" x2="114" y2="54" stroke="#FF5E9D" strokeWidth="5" strokeLinecap="round" />}
      <path d="M60 22c-18 0-33 13-33 32 0 18 14 32 33 32s33-14 33-32c0-19-15-32-33-32z" fill="url(#cbody)" />
      <path d="M60 12c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7z" fill="#FF5E9D" />
      <rect x="58.5" y="24" width="3" height="8" rx="1.5" fill="#FF5E9D" />
      <ellipse cx="60" cy="60" rx="25" ry="22" fill="#FFF3F7" />
      {mood === "happy" ? (
        <>
          <path d="M46 58 q5 -7 10 0" stroke="#16205C" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <path d="M64 58 q5 -7 10 0" stroke="#16205C" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="51" cy="57" r="4.2" fill="#16205C" />
          <circle cx="69" cy="57" r="4.2" fill="#16205C" />
          <circle cx="52.4" cy="55.6" r="1.5" fill="#fff" />
          <circle cx="70.4" cy="55.6" r="1.5" fill="#fff" />
        </>
      )}
      <circle cx="42" cy="66" r="4.6" fill="#FFC6DB" opacity=".85" />
      <circle cx="78" cy="66" r="4.6" fill="#FFC6DB" opacity=".85" />
      <path d={mood === "alert" ? "M53 70 q7 -5 14 0" : "M53 68 q7 7 14 0"} stroke="#16205C" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M60 92c-6-5-13-9-13-15 0-4 3-6 6-6 3 0 5 2 7 4 2-2 4-4 7-4 3 0 6 2 6 6 0 6-7 10-13 15z" fill="#E01B6E" />
      {mood === "alert" && <text x="96" y="40" fontSize="30" fill="#EF8033" fontWeight="700">!</text>}
    </svg>
  );
}
function CheckMark({ size = 54 }) {
  return (
    <svg className="check" width={size} height={size} viewBox="0 0 52 52">
      <circle cx="26" cy="26" r="24" fill="#E3F7EF" />
      <path d="M15 27l8 8 15-16" stroke="#17A673" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CountUp({ n, dur = 900 }) {
  const [v, setV] = useState(0);
  const ref = useRef(0);
  useEffect(() => {
    const from = ref.current, start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setV(Math.round(from + (n - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick); else ref.current = n;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n, dur]);
  return <>{v.toLocaleString("th-TH")}</>;
}

/* ===================== App ===================== */
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("cal");
  const [admin, setAdmin] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [docQ, setDocQ] = useState("");
  const [docFilter, setDocFilter] = useState("open");
  const [myUnit, setMyUnit] = useState("");
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [sel, setSel] = useState(TODAY);
  const [syncAt, setSyncAt] = useState(null);
  const [party, setParty] = useState(false);
  const [offline, setOffline] = useState(typeof navigator !== "undefined" && navigator.onLine === false);
  useEffect(() => {
    const on = () => setOffline(false), off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  const [saying, setSaying] = useState(null);
  const [bouncing, setBouncing] = useState(false);
  const pokeCare = () => {
    setBouncing(true);
    setSaying(CARE_SAYS[Math.floor(Math.random() * CARE_SAYS.length)]);
    setTimeout(() => setBouncing(false), 950);
    setTimeout(() => setSaying(null), 3200);
  };
  const dataRef = useRef(null);
  const baseRef = useRef(null);
  const modalRef = useRef(null);
  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { modalRef.current = modal; }, [modal]);

  useEffect(() => {
    let alive = true;
    const check = async () => {
      try {
        const ok = await window.activityAuth?.isAdmin?.();
        if (alive) setAdmin(!!ok);
      } catch (e) {}
    };
    check();
    const offAuth = window.activityAuth?.onChange?.(async (ok) => {
      if (!alive) return;
      setAdmin(!!ok);
      try {
        const r = await window.storage.get(KEY, true);
        if (r?.value) { setData(JSON.parse(r.value)); setSyncAt(new Date()); }
      } catch (e) {}
    });
    const offRealtime = window.activityRealtime?.subscribe?.(async () => {
      if (!alive || modalRef.current) return;
      try {
        const r = await window.storage.get(KEY, true);
        if (r?.value) { setData(JSON.parse(r.value)); setSyncAt(new Date()); }
      } catch (e) {}
    });
    return () => { alive = false; if (offAuth) offAuth(); if (offRealtime) offRealtime(); };
  }, []);

  /* ดึงข้อมูลล่าสุดเองทุก 45 วินาที และทุกครั้งที่กลับมาที่หน้าจอ
     ข้ามการดึงระหว่างที่เปิดหน้าต่างกรอกข้อมูลอยู่ เพื่อไม่ให้ข้อมูลที่กำลังพิมพ์หาย */
  useEffect(() => {
    let stopped = false;
    const pull = async () => {
      if (document.hidden || modalRef.current || stopped) return;
      try {
        const r = await window.storage.get(KEY, true);
        if (!r || !r.value || stopped) return;
        baseRef.current = r.value;
        if (JSON.stringify(dataRef.current) !== r.value) setData(JSON.parse(r.value));
        setSyncAt(new Date());
      } catch (e) {}
    };
    const id = setInterval(pull, 45000);
    const onBack = () => { if (!document.hidden) pull(); };
    document.addEventListener("visibilitychange", onBack);
    window.addEventListener("focus", onBack);
    return () => {
      stopped = true; clearInterval(id);
      document.removeEventListener("visibilitychange", onBack);
      window.removeEventListener("focus", onBack);
    };
  }, []);

  useEffect(() => {
    (async () => {
      let d = null;
      try { const r = await window.storage.get(KEY, true); if (r && r.value) d = JSON.parse(r.value); } catch (e) {}
      if (!d) { d = SEED; try { await window.storage.set(KEY, JSON.stringify(SEED), true); } catch (e) {} }
      else {
        d = {
          ...d,
          meta: { ...SEED.meta, ...d.meta, year: d.meta && d.meta.year === "ปีการศึกษา 2568" ? SEED.meta.year : (d.meta || {}).year || SEED.meta.year },
          activities: d.activities.map((a) => ({ target: "", contact: "", docUrl: "", result: "", dateEnd: "",
            cat: "", albumUrl: "", joinCount: "", tasks: [], ...a,
            unitId: REMAP[a.unitId] !== undefined ? REMAP[a.unitId] : a.unitId })),
          docs: Array.isArray(d.docs) ? d.docs : [],
        };
      }
      setData(d); baseRef.current = JSON.stringify(d); setSyncAt(new Date());
      try { const m = await window.storage.get(MYUNIT, false); if (m && m.value) setMyUnit(m.value); } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const say = (msg, icon = "✓") => { setToast({ msg, icon }); setTimeout(() => setToast(null), 2400); };
  /* ถ้ามีผู้ดูแลอีกคนแก้ไขระหว่างที่เรากำลังทำงานอยู่ ให้รวมข้อมูลทีละกิจกรรม
     แทนการเขียนทับทั้งก้อน โดยยึดรายการที่แก้ล่าสุดเป็นหลัก */
  const mergeRemote = (mine, remote, base) => {
    const idx = (arr) => Object.fromEntries((arr || []).map((a) => [a.id, a]));
    const M = idx(mine.activities), R = idx(remote.activities), B = idx((base || {}).activities);
    const out = [];
    new Set([...Object.keys(M), ...Object.keys(R)]).forEach((id) => {
      const m = M[id], r = R[id];
      if (m && r) out.push((r.updatedAt || "") > (m.updatedAt || "") ? r : m);
      else if (m) out.push(m);
      else if (!B[id]) out.push(r);        // คนอื่นเพิ่งเพิ่มเข้ามา เก็บไว้
    });                                     // ถ้าอยู่ใน base แต่หายจากของเรา แปลว่าเราลบเอง
    const MD = idx(mine.docs), RD = idx(remote.docs), BD = idx((base || {}).docs);
    const outDocs = [];
    new Set([...Object.keys(MD), ...Object.keys(RD)]).forEach((id) => {
      const m = MD[id], r = RD[id];
      if (m && r) outDocs.push((r.updatedAt || "") > (m.updatedAt || "") ? r : m);
      else if (m) outDocs.push(m);
      else if (!BD[id]) outDocs.push(r);
    });
    return { ...mine, activities: out.sort((a, b) => a.no - b.no), docs: outDocs };
  };

  const save = async (next, msg) => {
    setData(next);
    try {
      let payload = next;
      try {
        const cur0 = await window.storage.get(KEY, true);
        if (cur0 && cur0.value && baseRef.current && cur0.value !== baseRef.current) {
          payload = mergeRemote(next, JSON.parse(cur0.value), JSON.parse(baseRef.current));
          setData(payload);
          say("มีผู้ดูแลอีกคนแก้ไขพร้อมกัน ระบบรวมข้อมูลให้แล้ว", "⚠");
        }
      } catch (e) { /* อ่านไม่ได้ก็บันทึกตามปกติ */ }
      const body = JSON.stringify(payload);
      await window.storage.set(KEY, body, true);
      baseRef.current = body;
      setSyncAt(new Date());
      if (msg) say(msg);
      celebrate(payload);
    }
    catch (e) {
      const m = (e && e.message) ? String(e.message) : "";
      say(m ? "บันทึกไม่สำเร็จ: " + m.slice(0, 90) : "บันทึกไม่สำเร็จ ลองอีกครั้ง", "!");
      console.error("save failed:", e);
    }
  };
  const celebrate = (next) => {
    const A = next.activities || [];
    const named = A.filter((a) => a.name);
    if (named.length >= 2 && named.every((a) => a.closed)) {
      setParty(true);
      setTimeout(() => setParty(false), 3200);
    }
  };
  const patchAct = (id, patch, msg) =>
    save({ ...data, activities: data.activities.map((a) => a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a) }, msg);
  const patchDoc = (id, patch, msg) =>
    save({ ...data, docs: (data.docs || []).map((d) => d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d) }, msg);
  const pickUnit = async (id) => { setMyUnit(id); try { await window.storage.set(MYUNIT, id, false); } catch (e) {} };
  const refresh = async () => {
    try { const r = await window.storage.get(KEY, true); if (r && r.value) { baseRef.current = r.value; setData(JSON.parse(r.value)); setSyncAt(new Date()); say("อัปเดตข้อมูลล่าสุดแล้ว"); } }
    catch (e) { say("ดึงข้อมูลไม่สำเร็จ", "!"); }
  };

  const stats = useMemo(() => {
    if (!data) return {};
    const A = data.activities;
    return {
      total: A.length,
      done: A.filter((a) => statusOf(a) === "done").length,
      todo: A.filter((a) => statusOf(a) === "todo").length,
      nodate: A.filter((a) => a.name && !a.date).length,
      taskLate: A.reduce((n, a) => n + taskStat(a).late, 0),
      docOpen: (data.docs || []).filter((x) => x.status !== "done" && x.status !== "skip").length,
      docLate: (data.docs || []).filter((x) => x.status !== "done" && x.status !== "skip"
        && x.due && x.due < TODAY).length,
      absent: A.reduce((s, a) => s + a.absentees.length, 0),
      pct: A.length ? Math.round((A.filter((a) => statusOf(a) === "done").length / A.length) * 100) : 0,
    };
  }, [data]);

  if (loading || !data) {
    return (
      <div className="tp"><style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="splash">
          <div className="float"><Care size={168} mood="hello" /></div>
          <h2>TUPKLN ACTIVITY 360</h2>
          <p>กำลังเตรียมปฏิทินกิจกรรมของโรงเรียน</p>
          <div className="dots"><span /><span /><span /></div>
        </div>
      </div>
    );
  }

  const unitOf = (id) => data.units.find((u) => u.id === id);
  const unitName = (id) => (unitOf(id) || {}).name || "";
  const colorOf = (id) => { const i = data.units.findIndex((u) => u.id === id); return i < 0 ? "#9AA0B5" : COLORS[i % COLORS.length]; };
  const acts = [...data.activities].sort((a, b) => a.no - b.no);
  const dated = acts.filter((a) => a.date);
  const datedView = myUnit ? dated.filter((a) => a.unitId === myUnit) : dated;
  const onDay = (d) => datedView.filter((a) => a.date <= d && d <= lastDay(a));
  const upcoming = datedView.filter((a) => lastDay(a) >= TODAY).sort((a, b) => a.date.localeCompare(b.date));
  const tomorrowList = onDay(TOMORROW);
  const myActs = myUnit ? acts.filter((a) => a.unitId === myUnit) : [];

  const NAV = [
    { id: "cal", ic: "📅", label: "ปฏิทินกิจกรรม" },
    { id: "acts", ic: "📋", label: "กิจกรรมทั้งหมด", badge: admin ? stats.todo || null : null },
    { id: "docs", ic: "📨", label: "หนังสือ / งานมอบหมาย", badge: stats.docLate || null },
    { id: "tasks", ic: "✅", label: "ติดตามงานเตรียม", badge: stats.taskLate || null },
    { id: "report", ic: "📊", label: "รายงาน / พิมพ์" },
  ];

  /* ---------- activity card ---------- */
  const ActCard = ({ a }) => {
    const s = statusOf(a), u = unitOf(a.unitId);
    return (
      <div className={"att s-" + s}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span className="attno">งานที่ {a.no}</span>
          {catOf(a.cat) && <span className="badge b-none" title={catOf(a.cat).label}>{catOf(a.cat).icon} {catOf(a.cat).label.split(" ")[0]}</span>}
          {u && <span className="badge" style={{ background: colorOf(a.unitId) + "1F", color: colorOf(a.unitId) }}>{u.name}</span>}
          {admin && <span className={"badge " + STATUS[s].cls} style={{ marginLeft: "auto" }}>{STATUS[s].icon} {STATUS[s].label}</span>}
        </div>
        <h3>{a.name || "ยังไม่ได้ตั้งชื่อกิจกรรม"}</h3>
        {a.date && (a.date <= TODAY && TODAY <= lastDay(a)
          ? <span className="badge" style={{ background: "var(--softpink)", color: "var(--pink)", marginBottom: 8 }}>🔔 จัดวันนี้</span>
          : lastDay(a) < TODAY
            ? <span className="badge b-none" style={{ marginBottom: 8 }}>ผ่านไปแล้ว</span>
            : null)}
        <div className="attmeta"><span>📅</span><span>
          {a.date ? spanText(a) + (spanDays(a) > 1 ? ` (${spanDays(a)} วัน)` : "") + (a.time ? " · " + a.time + " น." : "") : "ยังไม่กำหนดวันที่"}
        </span></div>
        {a.place && <div className="attmeta"><span>📍</span><span>{a.place}</span></div>}
        {a.target && <div className="attmeta"><span>👥</span><span><b>ผู้เข้าร่วม</b> {a.target}</span></div>}
        {a.dress && <div className="attmeta"><span>👔</span><span>{a.dress}</span></div>}
        {taskStat(a).total > 0 && (
          <div className="attmeta"><span>✅</span><span>
            เตรียมงาน {taskStat(a).done}/{taskStat(a).total}
            <span className="tkmini"><span style={{ width: (taskStat(a).done / taskStat(a).total) * 100 + "%" }} /></span>
            {taskStat(a).late > 0 && <span className="duebad due-late" style={{ marginLeft: 8 }}>เลยกำหนด {taskStat(a).late}</span>}
          </span></div>
        )}
        <div className="attfoot">
          <button className="btn btn-g btn-sm" onClick={() => setModal({ type: "view", id: a.id })}>ดูรายละเอียด</button>
          {a.date && <a className="btn btn-g btn-sm" href={gcalUrl(a, unitName(a.unitId))}
            target="_blank" rel="noreferrer">+ Google ปฏิทิน</a>}
          {a.docUrl && <a className="btn btn-g btn-sm" href={safeUrl(a.docUrl)} target="_blank" rel="noreferrer">📎 เปิดเอกสาร</a>}
          {a.date && <button className="btn btn-g btn-sm" onClick={() => setModal({ type: "poster", id: a.id })}>🖼 โปสเตอร์</button>}
          <button className="btn btn-g btn-sm" onClick={() => {
            const t = lineText(a, unitName(a.unitId));
            if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => say("คัดลอกข้อความแล้ว วางในไลน์ได้เลย"), () => say("คัดลอกไม่สำเร็จ", "!"));
            else say("อุปกรณ์นี้คัดลอกอัตโนมัติไม่ได้", "!");
          }}>📋 คัดลอกข้อความ</button>
          {admin && <button className="btn btn-p btn-sm" onClick={() => setModal({ type: "absent", id: a.id })}>บันทึกผู้ไม่เข้าร่วม</button>}
          {admin && <button className="btn btn-g btn-sm" onClick={() => setModal({ type: "tasks", id: a.id })}>✅ เช็กลิสต์</button>}
          {admin && <button className="btn btn-g btn-sm" onClick={() => setModal({ type: "edit", id: a.id })}>แก้ไข</button>}
        </div>
      </div>
    );
  };

  /* ---------- calendar ---------- */
  const Calendar = () => {
    const first = new Date(cursor.y, cursor.m, 1);
    const start = new Date(first); start.setDate(1 - first.getDay());
    const cells = Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i);
      return { key: ymd(d), day: d.getDate(), out: d.getMonth() !== cursor.m };
    });
    const move = (n) => { const d = new Date(cursor.y, cursor.m + n, 1); setCursor({ y: d.getFullYear(), m: d.getMonth() }); };
    const selList = onDay(sel);
    const mKey = `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}`;
    const monthList = datedView.filter((a) => a.date.slice(0, 7) === mKey || lastDay(a).slice(0, 7) === mKey);

    return (
      <>
        <div className="hero noprint-cal">
          <span className="bubble b1" /><span className="bubble b2" /><span className="bubble b3" />
          <div className="htext">
            <h1>ปฏิทินกิจกรรมโรงเรียน</h1>
            <p>{myUnit
              ? `${unitName(myUnit)} รับผิดชอบ ${myActs.length} กิจกรรม กรอบสีน้ำเงินเข้มในปฏิทินคืองานของกลุ่มคุณครู`
              : "เลือกกลุ่มของคุณครูด้านล่าง ระบบจะเน้นกิจกรรมที่กลุ่มคุณครูรับผิดชอบให้เห็นชัด"}</p>
            <div className="herochips">
              <span className="hchip">📅 {data.meta.year}</span>
              {tomorrowList.length > 0 && <span className="hchip hot">🔔 พรุ่งนี้ {tomorrowList.length} กิจกรรม</span>}
              {stats.docOpen > 0 && <span className="hchip">📨 หนังสือรอดำเนินการ {stats.docOpen} ฉบับ</span>}
              <span className="hchip">🗓 เดือนนี้ {monthList.length} กิจกรรม</span>
            </div>
            {(() => {
              const y = ACAD_YEAR - 543;
              const start = new Date(y, 4, 1), end = new Date(y + 1, 3, 30);
              const now = new Date();
              const pct = Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
              return (
                <div className="yearbar">
                  <div className="yt"><div className="yf" style={{ width: pct + "%" }} /></div>
                  <div className="ylab"><span>พ.ค. {ACAD_YEAR}</span>
                    <span>ผ่านมาแล้ว {pct}% ของปีการศึกษา</span>
                    <span>มี.ค. {ACAD_YEAR + 1}</span></div>
                </div>
              );
            })()}
          </div>
          <div className={"hmascot float" + (bouncing ? " bounce" : "")} onClick={pokeCare}
            title="แตะน้อง CARE ดูสิครับ">
            {saying && <div className="bubble-say">{saying}</div>}
            <Care size={158} mood={saying ? "happy" : tomorrowList.length ? "alert" : "hello"} />
          </div>
        </div>

        {acts.length === 0 && (
          <div className="card empty" style={{ marginTop: 18 }}>
            <Care size={122} mood="hello" />
            <h3 style={{ marginTop: 8 }}>ยังไม่มีกิจกรรมในระบบ</h3>
            <p>{admin ? "กดปุ่มด้านล่างเพื่อเพิ่มกิจกรรมแรก ใส่วันที่แล้วจะขึ้นบนปฏิทินทันที"
              : "ผู้ดูแลกำลังจัดทำข้อมูล เปิดดูใหม่อีกครั้งได้เลยครับ"}</p>
            {admin && <button className="btn btn-p" style={{ marginTop: 14 }}
              onClick={() => setModal({ type: "edit", id: null, date: sel })}>+ เพิ่มกิจกรรมแรก</button>}
          </div>
        )}

        {upcoming[0] && (() => {
          const a = upcoming[0];
          const d = Math.round((new Date(a.date + "T00:00:00") - new Date(TODAY + "T00:00:00")) / 864e5);
          return (
            <div className="nextcard noprint-cal">
              <div className="countbox">
                <b>{d <= 0 ? "วันนี้" : d}</b>
                <span>{d <= 0 ? "ถึงกำหนดแล้ว" : "วันข้างหน้า"}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="nlab">กิจกรรมถัดไป</div>
                <h3>{catOf(a.cat) ? catOf(a.cat).icon + " " : ""}{a.name || "ยังไม่ตั้งชื่อกิจกรรม"}</h3>
                <div className="nmeta">
                  <span>📅 {spanText(a)}{a.time ? " · " + a.time + " น." : ""}</span>
                  {a.place && <span>📍 {a.place}</span>}
                  {a.dress && <span>👔 {a.dress}</span>}
                  <span>👥 {unitName(a.unitId) || "ยังไม่มอบหมาย"}</span>
                  {taskStat(a).total > 0 && <span>✅ เตรียมงาน {taskStat(a).done}/{taskStat(a).total}
                    {taskStat(a).late > 0 ? ` (เลยกำหนด ${taskStat(a).late})` : ""}</span>}
                </div>
                <div style={{ display: "flex", gap: 9, marginTop: 13, flexWrap: "wrap" }}>
                  <button className="btn btn-p btn-sm" onClick={() => setModal({ type: "view", id: a.id })}>ดูรายละเอียด</button>
                  <a className="btn btn-g btn-sm" href={gcalUrl(a, unitName(a.unitId))} target="_blank" rel="noreferrer">+ Google ปฏิทิน</a>
                </div>
              </div>
            </div>
          );
        })()}

        <div style={{ marginTop: 18 }} className="noprint-cal">
          <div className="usub" style={{ marginBottom: 8 }}>แตะกลุ่มเพื่อกรองปฏิทินเฉพาะงานของกลุ่มนั้น</div>
          <div className="chips" style={{ marginBottom: 10 }}>
            <button className={"chip" + (myUnit === "" ? " on" : "")} onClick={() => pickUnit("")}>ดูทุกกลุ่ม</button>
          </div>
          {["กลุ่มสาระการเรียนรู้", "กลุ่มบริหาร"].map((t) => (
            <div key={t} style={{ marginBottom: 10 }}>
              <div className="usub" style={{ marginBottom: 6 }}>{t}</div>
              <div className="chips" style={{ marginBottom: 0 }}>
                {unitsOfType(data.units, t).map((u) => (
                  <button key={u.id} className={"chip" + (myUnit === u.id ? " on" : "")} onClick={() => pickUnit(u.id)}>
                    <span className="dot" style={{ background: colorOf(u.id) }} />{u.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {myUnit && (
          <div className="card noprint-cal" style={{ display: "flex", alignItems: "center", gap: 12,
            padding: "12px 18px", marginBottom: 12, flexWrap: "wrap" }}>
            <span className="dot" style={{ background: colorOf(myUnit) }} />
            <span style={{ fontSize: 14 }}>
              กำลังแสดงเฉพาะกิจกรรมของ <b>{unitName(myUnit)}</b> ({myActs.length} งาน)
            </span>
            <button className="btn btn-g btn-sm" style={{ marginLeft: "auto" }} onClick={() => pickUnit("")}>
              แสดงทุกกลุ่ม
            </button>
          </div>
        )}

        <div className="card">
          <div className="monthbanner" style={{
            background: `linear-gradient(120deg, ${MONTH_TONE[cursor.m][0]}, ${MONTH_TONE[cursor.m][1]})` }}>
            <span className="mb-c" style={{ width: 90, height: 90, left: -22, top: -30 }} />
            <span className="mb-c" style={{ width: 44, height: 44, left: "34%", bottom: -18 }} />
            <div>
              <div className="mb-t">{TH_M[cursor.m]} {cursor.y + 543}</div>
              <div className="mb-s">{monthList.length ? `มี ${monthList.length} กิจกรรมในเดือนนี้` : "ยังไม่มีกิจกรรมในเดือนนี้"}</div>
            </div>
            <span className="mb-emoji">{MONTH_EMOJI[cursor.m]}</span>
          </div>
          <div className="calbar">
            <button className="arrow" aria-label="เดือนก่อนหน้า" onClick={() => move(-1)}>‹</button>
            <div className="calmonth">{TH_M[cursor.m]} {cursor.y + 543}
              <span className="monthemoji">{MONTH_EMOJI[cursor.m]}</span></div>
            <button className="arrow" aria-label="เดือนถัดไป" onClick={() => move(1)}>›</button>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button className="btn btn-g btn-sm"
                onClick={() => { const d = new Date(); setCursor({ y: d.getFullYear(), m: d.getMonth() }); setSel(TODAY); }}>วันนี้</button>
              <button className="btn btn-g btn-sm" onClick={() => window.print()}>🖨 พิมพ์ปฏิทิน</button>
              {monthList.length > 0 && <button className="btn btn-g btn-sm" onClick={() => {
                const t = [`📅 ปฏิทินกิจกรรมเดือน${TH_M[cursor.m]} ${cursor.y + 543}`, data.meta.school, ""]
                  .concat([...monthList].sort((a, b) => a.date.localeCompare(b.date))
                    .map((a) => `• ${spanText(a)} ${a.name || "ยังไม่ตั้งชื่อ"}${a.time ? " (" + a.time + " น.)" : ""}${a.place ? " @" + a.place : ""}`))
                  .join("\n");
                if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => say("คัดลอกสรุปทั้งเดือนแล้ว"), () => say("คัดลอกไม่สำเร็จ", "!"));
              }}>📋 สรุปทั้งเดือน</button>}
              {monthList.length > 0 && <button className="btn btn-g btn-sm"
                onClick={() => { download(`ปฏิทิน-${TH_M[cursor.m]}.ics`, icsOf(monthList, unitName), "text/calendar;charset=utf-8"); say("บันทึกปฏิทินทั้งเดือนแล้ว"); }}>
                ⬇ .ics เดือนนี้</button>}
              {dated.length > 0 && <button className="btn btn-g btn-sm"
                onClick={() => { download(`ปฏิทิน-${data.meta.year}.ics`, icsOf(dated, unitName), "text/calendar;charset=utf-8"); say("บันทึกปฏิทินทั้งปีแล้ว"); }}>
                ⬇ .ics ทั้งปี</button>}
            </div>
          </div>
          <div className="caldow">{DOW.map((d, i) => <span key={d} className={i === 0 || i === 6 ? "we" : ""}>{d}</span>)}</div>
          <div className="calgrid">
            {cells.map((c) => {
              const list = onDay(c.key);
              return (
                <button key={c.key}
                  className={"cday" + (c.out ? " out" : "") + (c.key === TODAY ? " today" : "")
                    + (c.key === sel ? " sel" : "") + (list.length ? " has" : "")}
                  onClick={() => {
                    setSel(c.key);
                    setTimeout(() => {
                      const el = document.getElementById("daypanel");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 60);
                  }}>
                  <span className="cnum">{c.day}</span>
                  {list.slice(0, 2).map((a) => (
                    <span key={a.id} className={"pill" + (myUnit && a.unitId === myUnit ? " mine" : "")}
                      style={{ background: colorOf(a.unitId) }} title={a.name}>
                      {a.date === c.key ? (catOf(a.cat) ? catOf(a.cat).icon + " " : a.no + ". ") : "↳ "}{a.name || "รอตั้งชื่อ"}</span>
                  ))}
                  {list.length > 2 && <span className="pmore">+{list.length - 2} กิจกรรม</span>}
                  <span className="cdots">
                    {list.slice(0, 4).map((a) => <span key={a.id} className="cdot" style={{ background: colorOf(a.unitId) }} />)}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="legend">
            {data.units.filter((u) => datedView.some((a) => a.unitId === u.id)).map((u) => (
              <span className="lg" key={u.id}><b style={{ background: colorOf(u.id) }} />{u.name}</span>
            ))}
            {datedView.length === 0 && <span className="usub">ยังไม่มีกิจกรรมที่กำหนดวันที่ในมุมมองนี้</span>}
          </div>
        </div>

        <div className="noprint-cal">
        <div className="sectitle daypanel" id="daypanel">
          <h2>{thFull(sel)}</h2>
          <span className="cnt">{selList.length ? `${selList.length} กิจกรรม` : "ไม่มีกิจกรรม"}</span>
          {admin && <button className="btn btn-n btn-sm" style={{ marginLeft: "auto" }}
            onClick={() => setModal({ type: "edit", id: null, date: sel })}>+ เพิ่มกิจกรรมวันนี้</button>}
        </div>
        {selList.length === 0 ? (
          <div className="card empty"><Care size={112} mood="happy" />
            <h3 style={{ marginTop: 8 }}>วันนี้ไม่มีกิจกรรม</h3>
            <p>แตะวันอื่นในปฏิทินเพื่อดูกิจกรรม หรือดูรายการที่กำลังจะถึงด้านล่าง</p></div>
        ) : <div className="attgrid">{selList.map((a) => <ActCard key={a.id} a={a} />)}</div>}

        </div>

        <div className="sectitle">
          <h2>{monthList.length ? `กิจกรรมเดือน${TH_M[cursor.m]}` : "กิจกรรมที่กำลังจะถึง"}</h2>
          <span className="cnt">{(monthList.length ? monthList : upcoming).length} รายการ · แตะเพื่อดูรายละเอียด</span>
        </div>
        {(monthList.length ? monthList : upcoming).length === 0 ? (
          <div className="card" style={{ color: "var(--gray)", fontSize: 14 }}>ยังไม่มีกิจกรรมที่กำหนดวันที่ล่วงหน้า</div>
        ) : (
          <div className="card"><div className="plist">
            {(monthList.length
              ? [...monthList].sort((a, b) => a.date.localeCompare(b.date) || a.no - b.no)
              : upcoming.slice(0, 6)).map((a) => (
              <button className="prow" key={a.id} style={{ textAlign: "left", width: "100%" }}
                onClick={() => setModal({ type: "view", id: a.id })}>
                <div className="pav" style={{ background: colorOf(a.unitId), color: "#fff", fontSize: 12 }}>{Number(a.date.slice(8))}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, lineHeight: 1.45 }}>{a.name || "ยังไม่ตั้งชื่อกิจกรรม"}</div>
                  <div className="usub">{spanText(a)}{a.time ? " · " + a.time + " น." : ""} · {unitName(a.unitId) || "ยังไม่มอบหมาย"}</div>
                </div>
                {myUnit && a.unitId === myUnit && <span className="badge b-todo">กลุ่มของคุณครู</span>}
              </button>
            ))}
          </div></div>
        )}

        {admin && stats.nodate > 0 && (
          <>
            <div className="sectitle"><h2>ยังไม่กำหนดวันที่</h2><span className="cnt">{stats.nodate} กิจกรรม</span></div>
            <div className="card"><div className="plist">
              {acts.filter((a) => a.name && !a.date).map((a) => (
                <div className="prow" key={a.id}>
                  <div className="pav" style={{ background: colorOf(a.unitId), color: "#fff" }}>{a.no}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{a.name}</div>
                    <div className="usub">{unitName(a.unitId) || "ยังไม่มอบหมาย"}</div>
                  </div>
                  <button className="btn btn-g btn-sm" onClick={() => setModal({ type: "edit", id: a.id })}>กำหนดวันที่</button>
                </div>
              ))}
            </div></div>
          </>
        )}
      </>
    );
  };

  /* ---------- all activities ---------- */
  const Acts = () => {
    const list = acts.filter((a) => filter === "all" ? true
      : filter === "mine" ? (myUnit && a.unitId === myUnit)
      : statusOf(a) === filter)
      .filter((a) => !catFilter || a.cat === catFilter)
      .filter((a) => {
        const k = q.trim().toLowerCase();
        if (!k) return true;
        return `${a.no} ${a.name} ${a.place} ${a.target} ${unitName(a.unitId)} ${(catOf(a.cat) || {}).label || ""}`
          .toLowerCase().includes(k);
      })
      .sort((a, b) => sortBy === "no" ? a.no - b.no
        : (a.date || "9999").localeCompare(b.date || "9999") || a.no - b.no);
    return (
      <>
        <div className="sectitle" style={{ marginTop: 0 }}>
          <h2>กิจกรรมทั้งหมด</h2><span className="cnt">{list.length} จาก {acts.length} งาน</span>
          {admin && <button className="btn btn-n btn-sm" style={{ marginLeft: "auto" }}
            onClick={() => setModal({ type: "edit", id: null })}>+ เพิ่มกิจกรรม</button>}
        </div>
        <div className="search" style={{ maxWidth: 420, marginBottom: 14 }}>
          <span style={{ color: "var(--gray)" }}>🔍</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาชื่อกิจกรรม สถานที่ หรือกลุ่ม" />
          {q && <button className="btn btn-g btn-sm" onClick={() => setQ("")}>ล้าง</button>}
        </div>
        <div className="chips">
          <button className={"chip" + (filter === "all" ? " on" : "")} onClick={() => setFilter("all")}>ทั้งหมด</button>
          {myUnit && <button className={"chip" + (filter === "mine" ? " on" : "")} onClick={() => setFilter("mine")}>
            กลุ่มของคุณครู ({myActs.length})</button>}
          {admin && <>
            <button className={"chip" + (filter === "todo" ? " on" : "")} onClick={() => setFilter("todo")}>
              รอบันทึก ({stats.todo})</button>
            <button className={"chip" + (filter === "done" ? " on" : "")} onClick={() => setFilter("done")}>
              สรุปแล้ว ({stats.done})</button>
          </>}
          <button className="chip" style={{ marginLeft: "auto" }}
            onClick={() => setSortBy(sortBy === "no" ? "date" : "no")}
            data-sort>
            ⇅ {sortBy === "no" ? "เรียงตามเลขงาน" : "เรียงตามวันที่"}
          </button>
        </div>
        <div className="chips" style={{ marginTop: -6 }}>
          {CATS.filter((c) => acts.some((a) => a.cat === c.id)).map((c) => (
            <button key={c.id} className={"chip" + (catFilter === c.id ? " on" : "")}
              onClick={() => setCatFilter(catFilter === c.id ? "" : c.id)}>
              {c.icon} {c.label.split(" ")[0]} ({acts.filter((a) => a.cat === c.id).length})
            </button>
          ))}
        </div>
        {list.length === 0 ? (
          <div className="card empty"><Care size={112} mood="search" />
            <h3 style={{ marginTop: 8 }}>{acts.length === 0 ? "ยังไม่มีกิจกรรมในระบบ" : "ไม่มีกิจกรรมในกลุ่มนี้"}</h3>
            <p>{acts.length === 0 ? "เริ่มจากการเพิ่มกิจกรรมแรกของปีการศึกษา" : "ลองเลือกตัวกรองอื่น"}</p>
            {admin && acts.length === 0 && <button className="btn btn-p" style={{ marginTop: 14 }}
              onClick={() => setModal({ type: "edit", id: null })}>+ เพิ่มกิจกรรม</button>}</div>
        ) : <div className="attgrid">{list.map((a) => <ActCard key={a.id} a={a} />)}</div>}
      </>
    );
  };

  /* ---------- report ---------- */
  const Tasks = () => {
    const rows = [];
    acts.forEach((a) => (a.tasks || []).forEach((t) => rows.push({ ...t, act: a })));
    const docDue = (data.docs || [])
      .filter((d) => d.due && d.status !== "done" && d.status !== "skip")
      .filter((d) => !myUnit || d.unitId === myUnit)
      .sort((a, b) => a.due.localeCompare(b.due));
    const mine = myUnit ? rows.filter((r) => r.act.unitId === myUnit) : rows;
    const open = mine.filter((r) => !r.done);
    const in7 = ymd(new Date(Date.now() + 7 * 864e5));
    const late = open.filter((r) => r.due && r.due < TODAY).sort((x, y) => x.due.localeCompare(y.due));
    const soon = open.filter((r) => r.due && r.due >= TODAY && r.due <= in7).sort((x, y) => x.due.localeCompare(y.due));
    const later = open.filter((r) => !r.due || r.due > in7).sort((x, y) => (x.due || "9999").localeCompare(y.due || "9999"));
    const fin = mine.filter((r) => r.done);

    const Row = ({ r }) => {
      const b = dueBadge(r.due);
      return (
        <div className={"tkrow" + (r.done ? " done" : "")} style={{ marginBottom: 9 }}>
          <button className={"tkbox" + (r.done ? " on" : "")} disabled={!admin}
            aria-label={r.done ? "ยกเลิกเครื่องหมายเสร็จ" : "ทำเครื่องหมายว่าเสร็จ"}
            onClick={() => patchAct(r.act.id, {
              tasks: (r.act.tasks || []).map((x) => x.id === r.id ? { ...x, done: !x.done } : x),
            }, r.done ? "ยกเลิกเครื่องหมายแล้ว" : "ทำเครื่องหมายเสร็จแล้ว")}>{r.done ? "✓" : ""}</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="tkt">{r.title}</div>
            <div className="usub">งานที่ {r.act.no} {r.act.name || "ยังไม่ตั้งชื่อ"}
              {r.owner ? " · ผู้รับผิดชอบ " + r.owner : ""}</div>
          </div>
          {b && !r.done && <span className={"duebad " + b.cls}>{b.text}</span>}
        </div>
      );
    };
    const Block = ({ title, list }) => list.length === 0 ? null : (
      <>
        <div className="sectitle"><h2>{title}</h2><span className="cnt">{list.length} รายการ</span></div>
        <div className="card">{list.map((r) => <Row key={r.id} r={r} />)}</div>
      </>
    );

    return (
      <>
        <div className="sectitle" style={{ marginTop: 0 }}>
          <h2>ติดตามงานเตรียมกิจกรรม</h2>
          <span className="cnt">ค้างอยู่ {open.length} รายการ · เสร็จแล้ว {fin.length}</span>
        </div>
        {mine.length === 0 && docDue.length === 0 ? (
          <div className="card empty"><Care size={112} mood="happy" />
            <h3 style={{ marginTop: 8 }}>
              {rows.length > 0 ? "กลุ่มของคุณครูยังไม่มีงานเตรียม" : "ยังไม่มีรายการงานเตรียม"}</h3>
            <p>{rows.length > 0
              ? `ทั้งระบบมีอยู่ ${rows.length} รายการ กดปุ่มด้านล่างเพื่อดูของทุกกลุ่ม`
              : admin ? "เปิดกิจกรรมแล้วกดปุ่มเช็กลิสต์ เพื่อเพิ่มงานย่อยที่ต้องทำก่อนถึงวันจัด"
              : "เมื่อผู้ดูแลกำหนดงานเตรียม รายการจะมาแสดงที่นี่"}</p>
            {rows.length > 0 && <button className="btn btn-g" style={{ marginTop: 14 }}
              onClick={() => pickUnit("")}>ดูงานเตรียมทุกกลุ่ม</button>}</div>
        ) : (
          <>
            <Block title="เลยกำหนดแล้ว" list={late} />
            {docDue.length > 0 && (
              <>
                <div className="sectitle"><h2>กำหนดส่งจากหนังสือเข้า</h2>
                  <span className="cnt">{docDue.length} เรื่อง</span></div>
                <div className="card"><div className="plist">
                  {docDue.map((d) => {
                    const b = dueBadge(d.due);
                    return (
                      <button className="prow" key={d.id} style={{ textAlign: "left", width: "100%" }}
                        onClick={() => setPage("docs")}>
                        <div className="pav" style={{ background: colorOf(d.unitId), color: "#fff" }}>
                          {(docTypeOf(d.type) || {}).icon || "📨"}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600 }}>{d.subject}</div>
                          <div className="usub">{unitName(d.unitId) || "ยังไม่มอบหมาย"}
                            {d.owner ? " · " + d.owner : ""} · กำหนด {thDate(d.due)}</div>
                        </div>
                        {b && <span className={"duebad " + b.cls}>{b.text}</span>}
                      </button>
                    );
                  })}
                </div></div>
              </>
            )}
            <Block title="ครบกำหนดใน 7 วัน" list={soon} />
            <Block title="กำหนดถัดไป" list={later} />
            <Block title="เสร็จแล้ว" list={fin} />
          </>
        )}
      </>
    );
  };

  const Docs = () => {
    const all = [...(data.docs || [])].sort((a, b) =>
      (a.due || "9999").localeCompare(b.due || "9999") || (b.recvDate || "").localeCompare(a.recvDate || ""));
    const list = all
      .filter((d) => docFilter === "all" ? true
        : docFilter === "open" ? (d.status !== "done" && d.status !== "skip")
        : docFilter === "mine" ? (myUnit && d.unitId === myUnit)
        : d.status === docFilter)
      .filter((d) => {
        const k = docQ.trim().toLowerCase();
        if (!k) return true;
        return `${d.docNo} ${d.subject} ${d.from} ${d.owner} ${unitName(d.unitId)}`.toLowerCase().includes(k);
      });

    const Card = ({ d }) => {
      const st = docStatusOf(d.status);
      const ty = docTypeOf(d.type);
      const b = dueBadge(d.due);
      const stepIdx = STEP_FLOW.indexOf(d.status);
      return (
        <div className={"doccard d-" + d.status}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {d.docNo && <span className="docno">{d.docNo}</span>}
            {ty && <span className="badge b-none">{ty.icon} {ty.label}</span>}
            <span className={"badge " + st.cls} style={{ marginLeft: "auto" }}>{st.label}</span>
          </div>
          <h3>{d.subject || "ไม่ระบุเรื่อง"}</h3>
          <div className="attmeta"><span>🏛</span><span>{d.from || "ไม่ระบุหน่วยงาน"}
            {d.docDate ? ` · ลงวันที่ ${thDate(d.docDate)}` : ""}</span></div>
          <div className="attmeta"><span>👥</span><span>
            {unitName(d.unitId) || "ยังไม่ได้มอบหมายกลุ่ม"}{d.owner ? " · " + d.owner : ""}</span></div>
          {d.due && <div className="attmeta"><span>⏰</span><span>
            กำหนดส่ง/สมัคร {thDate(d.due)} {b && <span className={"duebad " + b.cls}>{b.text}</span>}</span></div>}
          {d.eventDate && <div className="attmeta"><span>📅</span><span>วันจัด/แข่งขัน {thDate(d.eventDate)}</span></div>}
          {d.note && <div className="attmeta"><span>📝</span><span>{d.note}</span></div>}
          {d.result && <div className="attmeta"><span>🏅</span><span><b>ผล</b> {d.result}</span></div>}

          {d.status !== "skip" && (
            <>
              <div className="steps">
                {STEP_FLOW.map((k, i) => (
                  <div className={"step" + (i <= stepIdx ? " on" : "")} key={k}>
                    <i />{i < 3 && <b />}
                  </div>
                ))}
              </div>
              <div className="steplab"><span>รับเรื่อง</span><span>มอบหมาย</span><span>ดำเนินการ</span><span>เสร็จสิ้น</span></div>
            </>
          )}

          <div className="attfoot">
            {d.fileUrl && <a className="btn btn-g btn-sm" href={safeUrl(d.fileUrl)} target="_blank" rel="noreferrer">📎 เปิดหนังสือ</a>}
            {admin && stepIdx >= 0 && stepIdx < 3 && (
              <button className="btn btn-p btn-sm" onClick={() => patchDoc(d.id, { status: STEP_FLOW[stepIdx + 1] },
                "อัปเดตเป็น " + docStatusOf(STEP_FLOW[stepIdx + 1]).label)}>
                → {docStatusOf(STEP_FLOW[stepIdx + 1]).label}
              </button>
            )}
            {admin && <button className="btn btn-g btn-sm" onClick={() => setModal({ type: "doc", docId: d.id })}>แก้ไข</button>}
            {admin && !d.activityId && d.eventDate && (
              <button className="btn btn-n btn-sm" onClick={() => {
                const no = Math.max(0, ...data.activities.map((a) => a.no)) + 1;
                const act = { id: "a" + uid(), no, name: d.subject, unitId: d.unitId,
                  cat: d.type === "contest" ? "academic" : "", date: d.eventDate, dateEnd: "", time: "",
                  place: "", dress: "", target: "", contact: d.owner || "", docUrl: d.fileUrl || "",
                  albumUrl: "", joinCount: "", result: "", tasks: [], closed: false, absentees: [],
                  updatedAt: new Date().toISOString() };
                save({ ...data, activities: [...data.activities, act],
                  docs: data.docs.map((x) => x.id === d.id ? { ...x, activityId: act.id } : x) },
                  "สร้างเป็นกิจกรรมในปฏิทินแล้ว");
              }}>+ สร้างเป็นกิจกรรม</button>
            )}
            {d.activityId && data.activities.some((a) => a.id === d.activityId) && (
              <button className="btn btn-g btn-sm" onClick={() => setModal({ type: "view", id: d.activityId })}>
                📅 ดูกิจกรรมที่ผูกไว้</button>
            )}
          </div>
        </div>
      );
    };

    return (
      <>
        <div className="sectitle" style={{ marginTop: 0 }}>
          <h2>หนังสือเข้าและงานที่ได้รับมอบหมาย</h2>
          <span className="cnt">{list.length} จาก {all.length} ฉบับ · รอดำเนินการ {stats.docOpen}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {all.length > 0 && <button className="btn btn-g btn-sm" onClick={() => {
              const head = ["ลำดับ", "เลขที่หนังสือ", "ลงวันที่", "วันที่รับ", "จากหน่วยงาน", "เรื่อง", "ประเภท",
                "กลุ่มที่รับผิดชอบ", "ครูผู้รับผิดชอบ", "กำหนดส่ง", "วันจัด/แข่ง", "สถานะ", "ผลการดำเนินการ"];
              const rows2 = all.map((d, i) => [i + 1, d.docNo, thDate(d.docDate), thDate(d.recvDate), d.from, d.subject,
                (docTypeOf(d.type) || {}).label || "", unitName(d.unitId), d.owner, thDate(d.due), thDate(d.eventDate),
                docStatusOf(d.status).label, d.result]);
              const body = [head, ...rows2].map((r) => r.map((c) =>
                `"${String(c == null ? "" : c).replace(/"/g, '""')}"`).join(",")).join("\n");
              download(`ทะเบียนหนังสือ-${data.meta.year}.csv`, "\uFEFF" + body, "text/csv;charset=utf-8;");
              say("ดาวน์โหลดทะเบียนหนังสือแล้ว");
            }}>⬇ CSV</button>}
            {admin && <button className="btn btn-n btn-sm"
              onClick={() => setModal({ type: "doc", docId: null })}>+ ลงรับหนังสือ</button>}
          </div>
        </div>
        <div className="search" style={{ maxWidth: 420, marginBottom: 14 }}>
          <span style={{ color: "var(--gray)" }}>🔍</span>
          <input value={docQ} onChange={(e) => setDocQ(e.target.value)} placeholder="ค้นหาเรื่อง เลขที่หนังสือ หรือหน่วยงาน" />
        </div>
        <div className="chips">
          <button className={"chip" + (docFilter === "open" ? " on" : "")} onClick={() => setDocFilter("open")}>
            รอดำเนินการ ({stats.docOpen})</button>
          <button className={"chip" + (docFilter === "all" ? " on" : "")} onClick={() => setDocFilter("all")}>ทั้งหมด ({all.length})</button>
          {myUnit && <button className={"chip" + (docFilter === "mine" ? " on" : "")} onClick={() => setDocFilter("mine")}>
            ของกลุ่มคุณครู ({all.filter((d) => d.unitId === myUnit).length})</button>}
          {DOC_STATUS.map((st) => (
            <button key={st.id} className={"chip" + (docFilter === st.id ? " on" : "")} onClick={() => setDocFilter(st.id)}>
              {st.label} ({all.filter((d) => d.status === st.id).length})</button>
          ))}
        </div>
        {list.length === 0 ? (
          <div className="card empty"><Care size={112} mood="search" />
            <h3 style={{ marginTop: 8 }}>{all.length === 0 ? "ยังไม่มีหนังสือในระบบ" : "ไม่พบหนังสือตามเงื่อนไข"}</h3>
            <p>{all.length === 0
              ? (admin ? "กดปุ่มลงรับหนังสือเพื่อบันทึกฉบับแรก" : "เมื่อฝ่ายบริหารลงรับหนังสือ รายการจะมาแสดงที่นี่")
              : "ลองเปลี่ยนคำค้นหรือตัวกรอง"}</p>
            {admin && all.length === 0 && <button className="btn btn-p" style={{ marginTop: 14 }}
              onClick={() => setModal({ type: "doc", docId: null })}>+ ลงรับหนังสือ</button>}</div>
        ) : (
          <div className="attgrid">{list.map((d) => <Card key={d.id} d={d} />)}</div>
        )}
      </>
    );
  };

  const Report = () => {
    const csv = () => {
      const head = ["ลำดับ", "งานที่", "ชื่อกิจกรรม", "ผู้รับผิดชอบ", "ครูผู้ประสานงาน", "วันที่", "ถึงวันที่", "เวลา", "สถานที่",
        "กลุ่มเป้าหมาย", "ประเภทกิจกรรม", "สถานะ", "ผู้เข้าร่วมจริง", "จำนวนผู้ไม่เข้าร่วม", "รายชื่อผู้ไม่เข้าร่วม", "ผลการดำเนินงาน", "อัลบั้มภาพ", "งานเตรียมทั้งหมด", "เตรียมเสร็จแล้ว", "เลยกำหนด"];
      const rows = acts.map((a, i) => [i + 1, a.no, a.name, unitName(a.unitId), a.contact, thDate(a.date), thDate(a.dateEnd), a.time, a.place,
        a.target, (catOf(a.cat) || {}).label || "", STATUS[statusOf(a)].label, a.joinCount, a.absentees.length,
        a.absentees.map((p) => p.name + (p.unit ? `(${p.unit})` : "")).join(" / "), a.result, a.albumUrl,
        taskStat(a).total, taskStat(a).done, taskStat(a).late]);
      const body = [head, ...rows].map((r) => r.map((c) => `"${String(c == null ? "" : c).replace(/"/g, '""')}"`).join(",")).join("\n");
      download(`สรุปกิจกรรม-${data.meta.year}.csv`, "\uFEFF" + body, "text/csv;charset=utf-8;");
      say("ดาวน์โหลดไฟล์ CSV แล้ว");
    };
    return (
      <>
        <div className="sectitle" style={{ marginTop: 0 }}>
          <h2>รายงานสรุป</h2>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }} className="noprint">
            {admin && <button className="btn btn-g btn-sm" onClick={csv}>ดาวน์โหลด CSV</button>}
            <button className="btn btn-n btn-sm" onClick={() => window.print()}>พิมพ์รายงาน</button>
          </div>
        </div>

        <div className="stats" style={{ marginBottom: 16 }}>
          <div className="stat">
            <div className="sic" style={{ background: "var(--lightblue)", color: "#2C56B8" }}>📋</div>
            <div className="snum"><CountUp n={stats.total} /> <small>งาน</small></div>
            <div className="slab">กิจกรรมทั้งปีการศึกษา</div>
          </div>
          <div className="stat">
            <div className="sic" style={{ background: "#E3F7EF", color: "var(--green)" }}>✓</div>
            <div className="snum"><CountUp n={stats.pct} /><small>%</small></div>
            <div className="slab">สรุปข้อมูลแล้ว {stats.done} งาน</div>
          </div>
          <div className="stat">
            <div className="sic" style={{ background: "var(--softpink)", color: "var(--pink)" }}>🙋</div>
            <div className="snum"><CountUp n={stats.absent} /> <small>คน</small></div>
            <div className="slab">บันทึกผู้ไม่เข้าร่วมสะสม</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>ภาพรวมกิจกรรมทั้งปีการศึกษา</h3>
          <div className="chartcard">
            <div style={{ flex: 1, minWidth: 300 }}>
              <div className="usub" style={{ marginBottom: 10 }}>จำนวนกิจกรรมรายเดือน</div>
              {(() => {
                const order = [4,5,6,7,8,9,10,11,0,1,2,3];
                const counts = order.map((m) => acts.filter((a) => a.date && Number(a.date.slice(5, 7)) - 1 === m).length);
                const max = Math.max(1, ...counts);
                const nowM = new Date().getMonth();
                return (
                  <div className="mbars">
                    {order.map((m, i) => (
                      <div className={"mbar" + (counts[i] === 0 ? " zero" : "") + (m === nowM ? " now" : "")} key={m}>
                        <b>{counts[i] || ""}</b>
                        <div className="bcol" style={{ height: Math.max(4, (counts[i] / max) * 96) + "px",
                          animationDelay: (i * 0.04).toFixed(2) + "s" }} />
                        <small>{TH_MS[m].replace(".", "")}</small>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            <div style={{ flex: 1, minWidth: 290 }}>
              <div className="usub" style={{ marginBottom: 10 }}>แยกตามประเภทกิจกรรม</div>
              {(() => {
                const rows = CATS.map((c) => ({ ...c, n: acts.filter((a) => a.cat === c.id).length }))
                  .filter((c) => c.n > 0).sort((a, b) => b.n - a.n);
                const max = Math.max(1, ...rows.map((r) => r.n));
                if (!rows.length) return <div className="usub">ยังไม่ได้ระบุประเภทกิจกรรม</div>;
                return rows.map((r, i) => (
                  <div className="catrow" key={r.id}>
                    <span className="cname">{r.icon} {r.label.split(" ")[0]}</span>
                    <span className="ctrack">
                      <span className="cfill" style={{ width: (r.n / max) * 100 + "%",
                        background: COLORS[i % COLORS.length], animationDelay: (i * 0.06).toFixed(2) + "s" }} />
                    </span>
                    <span className="cnum2">{r.n}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {stats.docLate > 0 && (
          <div className="card" style={{ marginBottom: 14, borderLeft: "5px solid var(--orange)" }}>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>หนังสือที่เลยกำหนดส่ง {stats.docLate} เรื่อง</h3>
            <div className="plist">
              {(data.docs || []).filter((d) => d.due && d.due < TODAY && d.status !== "done" && d.status !== "skip")
                .sort((a, b) => a.due.localeCompare(b.due)).slice(0, 8).map((d) => (
                  <div className="prow" key={d.id}>
                    <div className="pav" style={{ background: "var(--orange)", color: "#fff" }}>!</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600 }}>{d.subject}</div>
                      <div className="usub">{unitName(d.unitId) || "ยังไม่มอบหมาย"}
                        {d.owner ? " · " + d.owner : ""} · กำหนด {thDate(d.due)}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {stats.taskLate > 0 && (
          <div className="card" style={{ marginBottom: 14, borderLeft: "5px solid var(--red)" }}>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>งานเตรียมที่เลยกำหนด {stats.taskLate} รายการ</h3>
            <div className="plist">
              {acts.flatMap((a) => (a.tasks || [])
                .filter((t) => !t.done && t.due && t.due < TODAY)
                .map((t) => ({ ...t, act: a })))
                .sort((x, y) => x.due.localeCompare(y.due))
                .slice(0, 8)
                .map((t) => (
                  <div className="prow" key={t.id}>
                    <div className="pav" style={{ background: "var(--red)", color: "#fff" }}>!</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600 }}>{t.title}</div>
                      <div className="usub">งานที่ {t.act.no} {t.act.name}
                        {t.owner ? " · " + t.owner : ""} · กำหนด {thDate(t.due)}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>ไทม์ไลน์กิจกรรมตลอดปีการศึกษา</h3>
          {dated.length === 0 ? <div className="usub">ยังไม่มีกิจกรรมที่กำหนดวันที่</div> : (
            <div className="tl">
              {(() => {
                const sorted = [...dated].sort((a, b) => a.date.localeCompare(b.date));
                const out = []; let cur = "";
                sorted.forEach((a, i) => {
                  const k = a.date.slice(0, 7);
                  if (k !== cur) {
                    cur = k;
                    out.push(<div className="tlmonth" key={"m" + k}>
                      {TH_M[Number(k.slice(5, 7)) - 1]} {Number(k.slice(0, 4)) + 543}</div>);
                  }
                  out.push(
                    <div className="tlitem" key={a.id} style={{ animationDelay: (i * 0.04).toFixed(2) + "s" }}>
                      <span className="tdot" style={{ background: colorOf(a.unitId) }} />
                      <div className="tt">{catOf(a.cat) ? catOf(a.cat).icon + " " : ""}{a.name || "ยังไม่ตั้งชื่อกิจกรรม"}</div>
                      <div className="usub">{spanText(a)} · {unitName(a.unitId) || "ยังไม่มอบหมาย"}</div>
                    </div>
                  );
                });
                return out;
              })()}
            </div>
          )}
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>ภาระงานรายกลุ่ม</h3>
          {data.units.filter((u) => acts.some((a) => a.unitId === u.id)).map((u) => {
            const l = acts.filter((a) => a.unitId === u.id);
            const d = l.filter((a) => a.closed).length;
            return (
              <div className="urow" key={u.id}>
                <div className="uav" style={{ background: colorOf(u.id) }}>{u.short}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="uname">{u.name}</div>
                  <div className="usub">งานที่ {l.map((a) => a.no).join(", ")}{admin ? ` · สรุปแล้ว ${d}/${l.length}` : ""}</div>
                  {admin && <div className="bar" style={{ marginTop: 6, maxWidth: 300 }}>
                    <span style={{ width: (l.length ? (d / l.length) * 100 : 0) + "%" }} /></div>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 4 }}>{data.meta.school}</h3>
          <p style={{ margin: "0 0 14px", color: "var(--gray)", fontSize: 13.5 }}>
            สรุปการมอบหมายกิจกรรม · {data.meta.year}
          </p>
          {acts.map((a) => (
            <div key={a.id} style={{ padding: "13px 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span className="attno" style={{ marginTop: 2 }}>งานที่ {a.no}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{a.name || "— ยังไม่ตั้งชื่อกิจกรรม —"}</div>
                  <div className="usub">{unitName(a.unitId) || "ยังไม่ได้มอบหมาย"}{a.date ? " · " + spanText(a) : ""}{a.place ? " · " + a.place : ""}</div>
                  {a.result && <div style={{ fontSize: 13.5, marginTop: 6, color: "#4A5069" }}>ผลการดำเนินงาน: {a.result}</div>}
                  {admin && a.absentees.length > 0 && (
                    <div style={{ fontSize: 13.5, marginTop: 6, color: "#4A5069" }}>
                      ผู้ไม่เข้าร่วม: {a.absentees.map((p) => p.name + (p.unit ? ` (${p.unit})` : "")).join(", ")}
                    </div>
                  )}
                  {!admin && a.absentees.length > 0 &&
                    <div className="usub" style={{ marginTop: 6 }}>ผู้ไม่เข้าร่วม {a.absentees.length} คน</div>}
                  {a.closed && a.absentees.length === 0 &&
                    <div style={{ fontSize: 13.5, marginTop: 6, color: "var(--green)" }}>เข้าร่วมครบทุกคน</div>}
                </div>
                {admin && <span className={"badge " + STATUS[statusOf(a)].cls}>{STATUS[statusOf(a)].label}</span>}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  /* ---------- modals ---------- */
  const cur = modal && modal.id ? data.activities.find((a) => a.id === modal.id) : null;

  const ViewModal = () => {
    const u = unitOf(cur.unitId), s = statusOf(cur);
    return (
      <div className="ovl" onClick={() => setModal(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="mhead">
            <div>
              <span className="attno">งานที่ {cur.no}</span>
              <h3 style={{ marginTop: 8 }}>{cur.name || "ยังไม่ได้ตั้งชื่อกิจกรรม"}</h3>
              <p>{u ? "รับผิดชอบโดย " + u.name : "ยังไม่ได้มอบหมายผู้รับผิดชอบ"}</p>
            </div>
            <button className="x" aria-label="ปิดหน้าต่าง" onClick={() => setModal(null)}>✕</button>
          </div>
          <div style={{ fontSize: 14, color: "#4A5069", display: "flex", flexDirection: "column", gap: 7 }}>
            <div>📅 {cur.date
              ? (spanDays(cur) > 1 ? `${thFull(cur.date)} ถึง ${thFull(cur.dateEnd)} รวม ${spanDays(cur)} วัน` : thFull(cur.date))
              : "ยังไม่กำหนดวันที่"}{cur.time ? ` · ${cur.time} น.` : ""}</div>
            {cur.place && <div>📍 {cur.place}</div>}
            {cur.target && <div>👥 ผู้เข้าร่วม: {cur.target}</div>}
            {cur.dress && <div>👔 การแต่งกาย: {cur.dress}</div>}
            {cur.contact && <div>📞 ผู้ประสานงาน: {cur.contact}</div>}
            {catOf(cur.cat) && <div>{catOf(cur.cat).icon} ประเภท: {catOf(cur.cat).label}</div>}
            {cur.joinCount && <div>🙋 ผู้เข้าร่วมจริง {cur.joinCount} คน</div>}
            {cur.docUrl && <div>📎 <a href={safeUrl(cur.docUrl)} target="_blank" rel="noreferrer">เปิดคำสั่ง / เอกสารแนบ</a></div>}
            {cur.albumUrl && <div>🖼 <a href={safeUrl(cur.albumUrl)} target="_blank" rel="noreferrer">ดูอัลบั้มภาพกิจกรรม</a></div>}
            {cur.result && <div>📝 ผลการดำเนินงาน: {cur.result}</div>}
          </div>

          {admin ? (
            <>
              <h4 style={{ fontSize: 14.5, margin: "18px 0 10px" }}>ผู้ไม่เข้าร่วม ({cur.absentees.length} คน)</h4>
              {cur.absentees.length === 0 ? (
                <div style={{ background: "var(--cream)", borderRadius: 16, padding: 18, textAlign: "center" }}>
                  {cur.closed ? <><CheckMark size={44} /><div style={{ marginTop: 6, color: "var(--green)", fontWeight: 600 }}>เข้าร่วมครบทุกคน</div></>
                    : <span style={{ color: "var(--gray)", fontSize: 14 }}>ยังไม่มีการบันทึกข้อมูล</span>}
                </div>
              ) : (
                <div className="plist">
                  {cur.absentees.map((p) => (
                    <div className="prow" key={p.id}>
                      <div className="pav">{p.name.trim().charAt(0) || "?"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        {(p.unit || p.reason) && <div className="usub">{[p.unit, p.reason].filter(Boolean).join(" · ")}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ marginTop: 16, fontSize: 13.5, color: "var(--gray)" }}>
              {cur.closed && cur.absentees.length === 0 ? "บันทึกแล้ว: เข้าร่วมครบทุกคน"
                : cur.absentees.length > 0 ? `บันทึกผู้ไม่เข้าร่วมไว้ ${cur.absentees.length} คน (รายชื่อเปิดดูได้เฉพาะผู้ดูแล)`
                : ""}
            </div>
          )}

          <div style={{ display: "flex", gap: 9, marginTop: 20, flexWrap: "wrap" }}>
            {cur.date && <a className="btn btn-n" href={gcalUrl(cur, unitName(cur.unitId))}
              target="_blank" rel="noreferrer">+ Google ปฏิทิน</a>}
            {admin && <button className="btn btn-p" onClick={() => setModal({ type: "absent", id: cur.id })}>บันทึกผู้ไม่เข้าร่วม</button>}
            {admin && <button className="btn btn-g" onClick={() => setModal({ type: "edit", id: cur.id })}>แก้ไขกิจกรรม</button>}
            <button className="btn btn-g" onClick={() => setModal(null)}>ปิด</button>
          </div>
        </div>
      </div>
    );
  };

  const AbsentModal = () => {
    const [list, setList] = useState(cur.absentees);
    const [name, setName] = useState("");
    const [unitTxt, setUnitTxt] = useState("");
    const [reason, setReason] = useState("");
    const [result, setResult] = useState(cur.result || "");
    const [albumUrl, setAlbumUrl] = useState(cur.albumUrl || "");
    const [joinCount, setJoinCount] = useState(cur.joinCount || "");
    const [ok, setOk] = useState(false);
    const add = () => {
      if (!name.trim()) return;
      setList([...list, { id: uid(), name: name.trim(), unit: unitTxt.trim(), reason: reason.trim() }]);
      setName(""); setReason("");
    };
    const submit = async (closed) => {
      await patchAct(cur.id, { absentees: list, result, albumUrl, joinCount, closed }, closed ? "ส่งข้อมูลเรียบร้อย" : "บันทึกร่างแล้ว");
      if (closed) { setOk(true); setTimeout(() => setModal(null), 1100); } else setModal(null);
    };
    return (
      <div className="ovl" onClick={() => setModal(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          {ok ? (
            <div className="empty"><CheckMark />
              <h3 style={{ marginTop: 10 }}>ส่งข้อมูลเรียบร้อย</h3>
              <p>งานที่ {cur.no} · ผู้ไม่เข้าร่วม {list.length} คน</p></div>
          ) : (
            <>
              <div className="mhead">
                <Care size={64} mood="search" />
                <div><h3>สรุปหลังกิจกรรม</h3>
                  <p>งานที่ {cur.no} · {cur.name || "ยังไม่ตั้งชื่อกิจกรรม"}</p></div>
                <button className="x" aria-label="ปิดหน้าต่าง" onClick={() => setModal(null)}>✕</button>
              </div>
              <div className="row2">
                <div className="field"><label>จำนวนผู้เข้าร่วม (คน)</label>
                  <input className="inp" type="number" value={joinCount} onChange={(e) => setJoinCount(e.target.value)} placeholder="เช่น 780" /></div>
                <div className="field"><label>ลิงก์อัลบั้มภาพกิจกรรม</label>
                  <input className="inp" value={albumUrl} onChange={(e) => setAlbumUrl(e.target.value)} placeholder="วางลิงก์ Google Photos หรือ Drive" /></div>
              </div>
              <div className="field"><label>ผลการดำเนินงานโดยย่อ</label>
                <textarea className="inp" value={result} onChange={(e) => setResult(e.target.value)}
                  placeholder="เช่น จัดกิจกรรม ณ หอประชุม ครูและนักเรียนเข้าร่วม 780 คน บรรลุวัตถุประสงค์" /></div>
              <div className="row2">
                <div className="field"><label>ชื่อ–สกุลผู้ไม่เข้าร่วม</label>
                  <input className="inp" value={name} onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && add()} placeholder="เช่น นางสาวเกตุฤดี ราชไชยา" /></div>
                <div className="field"><label>กลุ่มสาระ / ตำแหน่ง</label>
                  <input className="inp" value={unitTxt} onChange={(e) => setUnitTxt(e.target.value)} placeholder="เช่น คณิตศาสตร์" /></div>
              </div>
              <div className="field"><label>เหตุผล (ถ้ามี)</label>
                <input className="inp" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="เช่น ลาป่วย / ไปราชการ" /></div>
              <button className="btn btn-n" onClick={add} disabled={!name.trim()}>+ เพิ่มรายชื่อ</button>

              <h4 style={{ fontSize: 14.5, margin: "20px 0 10px" }}>รายชื่อที่บันทึกไว้ ({list.length})</h4>
              {list.length === 0 ? (
                <div style={{ background: "var(--cream)", borderRadius: 16, padding: 16, textAlign: "center", color: "var(--gray)", fontSize: 14 }}>
                  ยังไม่มีรายชื่อ ถ้าทุกคนเข้าร่วมครบ กด “เข้าร่วมครบทุกคน” ได้เลย
                </div>
              ) : (
                <div className="plist">
                  {list.map((p) => (
                    <div className="prow" key={p.id}>
                      <div className="pav">{p.name.trim().charAt(0)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        {(p.unit || p.reason) && <div className="usub">{[p.unit, p.reason].filter(Boolean).join(" · ")}</div>}
                      </div>
                      <button className="btn btn-danger btn-sm" onClick={() => setList(list.filter((x) => x.id !== p.id))}>ลบ</button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 9, marginTop: 20, flexWrap: "wrap" }}>
                <button className="btn btn-p" onClick={() => submit(true)}>
                  {list.length === 0 ? "เข้าร่วมครบทุกคน" : "ส่งข้อมูล " + list.length + " รายชื่อ"}
                </button>
                <button className="btn btn-g" onClick={() => submit(false)}>บันทึกร่าง</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const EditModal = () => {
    const isNew = !cur;
    const nextNo = Math.max(0, ...data.activities.map((a) => a.no)) + 1;
    const [f, setF] = useState(cur || { no: nextNo, name: "", unitId: "", cat: "", albumUrl: "", joinCount: "", date: modal.date || "", dateEnd: "", time: "", place: "", dress: "", target: "", contact: "", docUrl: "" });
    const set = (k, v) => setF({ ...f, [k]: v });
    const submit = () => {
      const noVal = Number(f.no) > 0 ? Number(f.no) : nextNo;
      const body = { no: noVal, name: f.name, unitId: f.unitId, cat: f.cat || "", date: f.date,
        dateEnd: f.dateEnd && f.dateEnd > f.date ? f.dateEnd : "", time: f.time,
        place: f.place, dress: f.dress, target: f.target, contact: f.contact, docUrl: f.docUrl };
      if (isNew) save({ ...data, activities: [...data.activities, { id: "a" + uid(), ...body, result: "", closed: false, absentees: [], updatedAt: new Date().toISOString() }] }, "เพิ่มกิจกรรมแล้ว");
      else patchAct(cur.id, body, "บันทึกการแก้ไขแล้ว");
      if (f.date) { const d = new Date(f.date + "T00:00:00"); setCursor({ y: d.getFullYear(), m: d.getMonth() }); setSel(f.date); }
      setModal(null);
    };
    const [askDel, setAskDel] = useState(false);
    const del = () => { save({ ...data, activities: data.activities.filter((a) => a.id !== cur.id) }, "ลบกิจกรรมแล้ว"); setModal(null); };
    return (
      <div className="ovl" onClick={() => setModal(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="mhead">
            <div><h3>{isNew ? "เพิ่มกิจกรรม" : "แก้ไขกิจกรรม"}</h3>
              <p>ใส่วันที่เพื่อให้กิจกรรมขึ้นบนปฏิทินหน้าแรก</p></div>
            <button className="x" aria-label="ปิดหน้าต่าง" onClick={() => setModal(null)}>✕</button>
          </div>
          <div className="row2">
            <div className="field"><label>งานที่ (ระบบใส่ให้ ไม่ต้องแก้ก็ได้)</label>
              <input className="inp" type="number" value={f.no} onChange={(e) => set("no", e.target.value)} />
              {data.activities.some((x) => x.id !== (cur || {}).id && Number(x.no) === Number(f.no)) &&
                <div style={{ color: "#C4661F", fontSize: 12.5, marginTop: 6 }}>
                  เลขงานนี้ซ้ำกับกิจกรรมอื่น ใช้ได้แต่จะสับสนตอนอ้างอิง
                </div>}
            </div>
            <div className="field"><label>กลุ่มผู้รับผิดชอบ</label>
              <select className="inp" value={f.unitId} onChange={(e) => set("unitId", e.target.value)}>
                <option value="">— ยังไม่มอบหมาย —</option>
                {["กลุ่มสาระการเรียนรู้", "กลุ่มบริหาร"].map((t) => (
                  <optgroup key={t} label={t}>
                    {unitsOfType(data.units, t).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </optgroup>
                ))}
              </select></div>
          </div>
          <div className="field"><label>ประเภทกิจกรรม</label>
            <select className="inp" value={f.cat || ""} onChange={(e) => set("cat", e.target.value)}>
              <option value="">— ไม่ระบุ —</option>
              {CATS.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </select></div>
          <div className="field"><label>ชื่อกิจกรรม</label>
            <textarea className="inp" value={f.name} onChange={(e) => set("name", e.target.value)}
              placeholder="เช่น พิธีลงนามถวายพระพรชัยมงคล ..." /></div>
          <div className="row2">
            <div className="field"><label>วันที่จัดกิจกรรม</label>
              <input className="inp" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} />
              <select className="inp" style={{ marginTop: 8, fontSize: 13 }} value=""
                onChange={(e) => e.target.value && set("date", e.target.value)}>
                <option value="">เลือกจากวันสำคัญของปีการศึกษานี้</option>
                {KEY_DATES.map((k) => {
                  const m = Number(k.md.slice(0, 2));
                  const y = (m >= 5 ? ACAD_YEAR : ACAD_YEAR + 1) - 543;
                  return <option key={k.md} value={`${y}-${k.md}`}>{k.label}</option>;
                })}
              </select></div>
            <div className="field"><label>ถึงวันที่ (เว้นว่างถ้าจัดวันเดียว)</label>
              <input className="inp" type="date" value={f.dateEnd || ""} min={f.date}
                onChange={(e) => set("dateEnd", e.target.value)} disabled={!f.date} />
              {f.date && (() => {
                const clash = data.activities.filter((x) => x.id !== (cur || {}).id && x.date && x.name
                  && x.date <= f.date && f.date <= lastDay(x));
                return clash.length ? (
                  <div style={{ color: "#C4661F", fontSize: 12.5, marginTop: 6 }}>
                    วันนี้มีกิจกรรมอยู่แล้ว {clash.length} รายการ: {clash.map((x) => x.name).join(", ").slice(0, 60)}
                  </div>
                ) : null;
              })()}
              {f.dateEnd && f.date && f.dateEnd < f.date &&
                <div style={{ color: "var(--red)", fontSize: 12.5, marginTop: 6 }}>วันสิ้นสุดต้องไม่ก่อนวันเริ่ม</div>}
            </div>
          </div>
          <div className="field"><label>เวลา</label>
            <input className="inp" value={f.time} onChange={(e) => set("time", e.target.value)} placeholder="เช่น 08.00–09.30" /></div>
          <div className="row2">
            <div className="field"><label>สถานที่</label>
              <input className="inp" value={f.place} onChange={(e) => set("place", e.target.value)} placeholder="เช่น หอประชุมโรงเรียน" /></div>
            <div className="field"><label>การแต่งกาย</label>
              <input className="inp" value={f.dress} onChange={(e) => set("dress", e.target.value)} placeholder="เช่น ชุดปกติขาว" /></div>
          </div>
          <div className="row2">
            <div className="field"><label>ผู้เข้าร่วม / กลุ่มเป้าหมาย</label>
              <input className="inp" value={f.target} onChange={(e) => set("target", e.target.value)} placeholder="เช่น ครูทุกคน + นักเรียน ม.ต้น" /></div>
            <div className="field"><label>ครูผู้ประสานงาน</label>
              <input className="inp" value={f.contact} onChange={(e) => set("contact", e.target.value)} placeholder="ชื่อ + เบอร์ / ไลน์" /></div>
          </div>
          <div className="field"><label>ลิงก์คำสั่ง / เอกสารแนบ</label>
            <input className="inp" value={f.docUrl} onChange={(e) => set("docUrl", e.target.value)} placeholder="วางลิงก์ Google Drive หรือไฟล์คำสั่ง" /></div>
          <div style={{ display: "flex", gap: 9, marginTop: 6, flexWrap: "wrap" }}>
            <button className="btn btn-p" onClick={submit}>{isNew ? "เพิ่มกิจกรรม" : "บันทึกการแก้ไข"}</button>
            <button className="btn btn-g" onClick={() => setModal(null)}>ยกเลิก</button>
            {!isNew && <button className="btn btn-g" onClick={() => {
              const copy = { ...cur, id: "a" + uid(), no: nextNo, name: (cur.name || "") + " (สำเนา)",
                date: "", dateEnd: "", result: "", albumUrl: "", joinCount: "", closed: false, absentees: [],
                tasks: (cur.tasks || []).map((t) => ({ ...t, id: uid(), done: false, due: "" })),
                updatedAt: new Date().toISOString() };
              save({ ...data, activities: [...data.activities, copy] }, "ทำสำเนาแล้ว เหลือใส่วันที่");
              setModal({ type: "edit", id: copy.id });
            }}>⧉ ทำสำเนา</button>}
            {!isNew && (askDel
              ? <span style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--red)" }}>ลบถาวร แน่ใจไหม</span>
                  <button className="btn btn-danger" onClick={del}>ยืนยันลบ</button>
                  <button className="btn btn-g" onClick={() => setAskDel(false)}>ยกเลิก</button>
                </span>
              : <button className="btn btn-danger" style={{ marginLeft: "auto" }} onClick={() => setAskDel(true)}>ลบกิจกรรม</button>)}
          </div>
        </div>
      </div>
    );
  };

  const PinModal = () => {
    const [email, setEmail] = useState("pratompong@tup-kln.ac.th");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    const go = async () => {
      const e = email.trim();
      if (!e || !e.includes("@")) { setErr("กรุณากรอกอีเมลให้ถูกต้อง"); return; }
      if (!password) { setErr("กรุณากรอกรหัสผ่าน"); return; }
      setErr(""); setBusy(true);
      try {
        const { error } = await window.activityAuth.signIn(e, password);
        if (error) throw error;
        const ok = await window.activityAuth.isAdmin();
        if (!ok) {
          await window.activityAuth.signOut();
          throw new Error("บัญชีนี้ไม่มีสิทธิ์ผู้ดูแล Activity 360");
        }
        setAdmin(true);
        try {
          const r = await window.storage.get(KEY, true);
          if (r?.value) { setData(JSON.parse(r.value)); setSyncAt(new Date()); }
        } catch (e) {}
        setModal(null);
        say("เข้าสู่ระบบผู้ดูแลแล้ว");
      } catch (ex) {
        const m = ex?.message || "เข้าสู่ระบบไม่สำเร็จ";
        setErr(m === "Invalid login credentials" ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : m);
      } finally { setBusy(false); }
    };
    return (
      <div className="ovl" onClick={() => setModal(null)}>
        <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
          <div className="mhead"><Care size={64} mood="alert" />
            <div><h3>เข้าสู่ระบบผู้ดูแล</h3><p>ใช้อีเมลและรหัสผ่านของบัญชีผู้ดูแล</p></div>
            <button className="x" aria-label="ปิดหน้าต่าง" onClick={() => setModal(null)}>✕</button></div>
          <div className="field"><label>อีเมลผู้ดูแล</label>
            <input className="inp" type="email" value={email} autoFocus
              onChange={(e) => { setEmail(e.target.value); setErr(""); }}
              autoComplete="username" placeholder="name@example.com" /></div>
          <div className="field"><label>รหัสผ่าน</label>
            <input className="inp" type="password" value={password}
              onChange={(e) => { setPassword(e.target.value); setErr(""); }}
              onKeyDown={(e) => e.key === "Enter" && !busy && go()}
              autoComplete="current-password" placeholder="••••••••" /></div>
          {err && <div style={{ color: "var(--red)", fontSize: 13, marginTop: -6, marginBottom: 10 }}>{err}</div>}
          <button className="btn btn-p" style={{ width: "100%" }} onClick={go} disabled={busy}>
            {busy ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
          <p style={{ fontSize: 12.5, color: "var(--gray)", marginTop: 12, textAlign: "center" }}>
            ระบบไม่เก็บรหัสผ่านไว้ในเว็บไซต์ และไม่ต้องส่ง Magic Link ทางอีเมลทุกครั้ง
          </p>
        </div>
      </div>
    );
  };

  const SettingsModal = () => {
    const [m, setM] = useState(data.meta);
    const [confirm, setConfirm] = useState(false);
    const newYear = () => {
      save({
        ...data,
        meta: { ...m, year: `ปีการศึกษา ${ACAD_YEAR}` },
        activities: data.activities.map((a) => ({ ...a, date: "", dateEnd: "", time: "", place: "", dress: "", target: "", contact: "", docUrl: "", result: "", albumUrl: "", joinCount: "",
          tasks: (a.tasks || []).map((t) => ({ ...t, done: false, due: "" })), closed: false, absentees: [] })),
        docs: (data.docs || []).filter((x) => x.status !== "done" && x.status !== "skip"),
      }, "เริ่มปีการศึกษาใหม่แล้ว");
      setModal(null);
    };
    const renumber = () => {
      const sorted = [...data.activities].sort((a, b) =>
        (a.date || "9999").localeCompare(b.date || "9999") || a.no - b.no);
      save({ ...data, activities: sorted.map((a, i) => ({ ...a, no: i + 1 })) }, "จัดเลขงานใหม่ตามวันที่แล้ว");
      setModal(null);
    };
    const wipeAll = () => {
      save({ ...data, meta: m, activities: [] }, "ลบงานทั้งหมดแล้ว");
      setModal(null);
    };
    return (
      <div className="ovl" onClick={() => setModal(null)}>
        <div className="modal" style={{ maxWidth: 430 }} onClick={(e) => e.stopPropagation()}>
          <div className="mhead"><div><h3>ตั้งค่าระบบ</h3><p>ครูที่เปิดลิงก์จะเห็นข้อมูลแบบอ่านอย่างเดียว</p></div>
            <button className="x" aria-label="ปิดหน้าต่าง" onClick={() => setModal(null)}>✕</button></div>
          <div className="field"><label>ชื่อโรงเรียน</label>
            <input className="inp" value={m.school} onChange={(e) => setM({ ...m, school: e.target.value })} /></div>
          <div className="field"><label>ปีการศึกษา</label>
            <input className="inp" value={m.year} onChange={(e) => setM({ ...m, year: e.target.value })} /></div>
          <button className="btn btn-p" style={{ width: "100%" }}
            onClick={() => { save({ ...data, meta: m }, "บันทึกการตั้งค่าแล้ว"); setModal(null); }}>บันทึกการตั้งค่า</button>

          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <h4 style={{ fontSize: 14.5 }}>จัดเลขงานใหม่ตามวันที่</h4>
            <p style={{ fontSize: 13, color: "var(--gray)", margin: "4px 0 12px" }}>
              เพิ่มงานแทรกทีหลังแล้วเลขสลับกัน กดปุ่มนี้ครั้งเดียวระบบจะไล่เลข 1 ถึง {data.activities.length} ใหม่
              ตามวันที่จัดจริง งานที่ยังไม่กำหนดวันที่จะไปอยู่ท้ายสุด
            </p>
            <button className="btn btn-g" onClick={renumber} disabled={data.activities.length === 0}>
              ⇅ จัดเลขงานใหม่ตามวันที่
            </button>
          </div>

          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <h4 style={{ fontSize: 14.5 }}>สำรองและกู้คืนข้อมูล</h4>
            <p style={{ fontSize: 13, color: "var(--gray)", margin: "4px 0 12px" }}>
              ดาวน์โหลดไฟล์สำรองเก็บไว้ในเครื่อง หากข้อมูลเสียหายให้เลือกไฟล์เดิมกลับเข้ามาได้
            </p>
            <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center" }}>
              <button className="btn btn-g" onClick={() => {
                download(`สำรองข้อมูล-${data.meta.year}.json`, JSON.stringify(data, null, 2), "application/json");
                say("ดาวน์โหลดไฟล์สำรองแล้ว");
              }}>⬇ ดาวน์โหลดไฟล์สำรอง</button>
              <label className="btn btn-g" style={{ cursor: "pointer" }}>
                ⬆ กู้คืนจากไฟล์
                <input type="file" accept="application/json" style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    const fr = new FileReader();
                    fr.onload = () => {
                      try {
                        const j = JSON.parse(fr.result);
                        if (!j || !Array.isArray(j.activities)) throw new Error("bad");
                        const ok = window.confirm(
                          `ไฟล์นี้มี ${j.activities.length} กิจกรรม การกู้คืนจะเขียนทับข้อมูลปัจจุบันทั้งหมด (${data.activities.length} กิจกรรม) ยืนยันหรือไม่`);
                        if (!ok) return;
                        save({ ...SEED, ...j, units: Array.isArray(j.units) && j.units.length ? j.units : SEED.units }, "กู้คืนข้อมูลแล้ว");
                        setModal(null);
                      } catch (err) { say("ไฟล์ไม่ถูกต้อง", "!"); }
                    };
                    fr.readAsText(file);
                  }} />
              </label>
            </div>
          </div>


          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <h4 style={{ fontSize: 14.5 }}>เริ่มปีการศึกษาใหม่</h4>
            <p style={{ fontSize: 13, color: "var(--gray)", margin: "4px 0 12px" }}>
              เก็บรายการงานและกลุ่มผู้รับผิดชอบไว้ แต่ล้างวันที่ ผลการดำเนินงาน และรายชื่อผู้ไม่เข้าร่วมทั้งหมด
              แนะนำให้ดาวน์โหลด CSV เก็บไว้ก่อน เพราะย้อนคืนไม่ได้
            </p>
            {confirm
              ? <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                  <button className="btn btn-danger" onClick={newYear}>ล้างข้อมูล เก็บรายการงานไว้</button>
                  <button className="btn btn-danger" onClick={wipeAll}>ลบงานทั้งหมด เริ่มจากศูนย์</button>
                  <button className="btn btn-g" onClick={() => setConfirm(false)}>ยกเลิก</button>
                </div>
              : <button className="btn btn-g" onClick={() => setConfirm(true)}>ล้างข้อมูลเพื่อเริ่มปีใหม่</button>}
          </div>
        </div>
      </div>
    );
  };

  const BulkModal = () => {
    const [txt, setTxt] = useState("");
    const lines = txt.split("\n").map((l) => l.trim())
      .filter((l) => l && l.replace(/\|/g, "").trim());
    const add = () => {
      let no = Math.max(0, ...data.activities.map((a) => a.no));
      const added = lines.map((l) => {
        const [name, unitTxt] = l.split("|").map((x) => (x || "").trim());
        const u = data.units.find((x) => unitTxt && (x.name === unitTxt || x.name.includes(unitTxt)));
        no += 1;
        return { id: "a" + uid(), no, name, unitId: u ? u.id : "", cat: "", albumUrl: "", joinCount: "", tasks: [], date: "", dateEnd: "", time: "", place: "",
          dress: "", target: "", contact: "", docUrl: "", result: "", closed: false, absentees: [], updatedAt: new Date().toISOString() };
      });
      save({ ...data, activities: [...data.activities, ...added] }, `เพิ่ม ${added.length} กิจกรรมแล้ว`);
      setModal(null);
    };
    return (
      <div className="ovl" onClick={() => setModal(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="mhead"><div><h3>เพิ่มหลายงานพร้อมกัน</h3>
            <p>พิมพ์หรือวางทีละบรรทัด ระบบจะไล่เลขงานให้เอง แล้วค่อยเข้าไปใส่วันที่ทีหลัง</p></div>
            <button className="x" aria-label="ปิดหน้าต่าง" onClick={() => setModal(null)}>✕</button></div>
          <div className="field"><label>หนึ่งบรรทัดต่อหนึ่งกิจกรรม ใส่กลุ่มผู้รับผิดชอบต่อท้ายด้วย | ได้</label>
            <textarea className="inp" style={{ minHeight: 170 }} value={txt} onChange={(e) => setTxt(e.target.value)}
              placeholder={"กิจกรรมวันไหว้ครู | ภาษาไทย\nกิจกรรมกีฬาสี | ศิลปะ\nกิจกรรมวันวิทยาศาสตร์ | วิทยาศาสตร์"} /></div>
          <button className="btn btn-p" style={{ width: "100%" }} onClick={add} disabled={lines.length === 0}>
            เพิ่ม {lines.length} กิจกรรม
          </button>
        </div>
      </div>
    );
  };

  const UnitsModal = () => {
    const [list, setList] = useState(data.units);
    const [name, setName] = useState("");
    const [type, setType] = useState("กลุ่มสาระการเรียนรู้");
    const used = (id) => data.activities.filter((a) => a.unitId === id).length;
    const add = () => {
      if (!name.trim()) return;
      setList([...list, { id: "x" + uid(), name: name.trim(), short: name.trim().slice(0, 2), type }]);
      setName("");
    };
    return (
      <div className="ovl" onClick={() => setModal(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="mhead"><div><h3>จัดการกลุ่มผู้รับผิดชอบ</h3>
            <p>แก้ชื่อและเพิ่มกลุ่มได้ที่นี่ ส่วนการลบกลุ่มต้องทำในตาราง activity360_units บน Supabase</p></div>
            <button className="x" aria-label="ปิดหน้าต่าง" onClick={() => setModal(null)}>✕</button></div>
          {["กลุ่มสาระการเรียนรู้", "กลุ่มบริหาร"].map((t) => (
            <div key={t} style={{ marginBottom: 14 }}>
              <div className="usub" style={{ marginBottom: 6 }}>{t}</div>
              <div className="plist">
                {unitsOfType(list, t).map((u) => (
                  <div className="prow" key={u.id}>
                    <div className="pav" style={{ background: colorOf(u.id), color: "#fff" }}>{u.short}</div>
                    <input className="inp" style={{ flex: 1, padding: "6px 10px" }} value={u.name}
                      onChange={(e) => setList(list.map((x) => x.id === u.id ? { ...x, name: e.target.value, short: e.target.value.slice(0, 2) } : x))} />
                    <span className="usub" style={{ whiteSpace: "nowrap" }}>{used(u.id)} งาน</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="row2">
            <div className="field"><label>เพิ่มกลุ่มใหม่</label>
              <input className="inp" value={name} onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()} placeholder="ชื่อกลุ่ม" /></div>
            <div className="field"><label>ประเภท</label>
              <select className="inp" value={type} onChange={(e) => setType(e.target.value)}>
                <option>กลุ่มสาระการเรียนรู้</option>
                <option>กลุ่มบริหาร</option>
              </select></div>
          </div>
          <button className="btn btn-n" onClick={add} disabled={!name.trim()}>+ เพิ่มกลุ่ม</button>
          <div style={{ display: "flex", gap: 9, marginTop: 20 }}>
            <button className="btn btn-p" onClick={() => { save({ ...data, units: list }, "บันทึกรายชื่อกลุ่มแล้ว"); setModal(null); }}>
              บันทึก {list.length} กลุ่ม</button>
            <button className="btn btn-g" onClick={() => setModal(null)}>ยกเลิก</button>
          </div>
        </div>
      </div>
    );
  };

  const PosterModal = () => {
    const a = cur;
    const tone = MONTH_TONE[a.date ? Number(a.date.slice(5, 7)) - 1 : 0];
    const d = a.date ? a.date.split("-") : null;
    return (
      <div className="ovl" onClick={() => setModal(null)}>
        <div onClick={(e) => e.stopPropagation()}>
          <div className="posterbox">
            <div className="ptop" style={{ background: `linear-gradient(130deg, ${tone[0]}, ${tone[1]})` }}>
              <span className="pc" style={{ width: 120, height: 120, right: -34, top: -44 }} />
              <span className="pc" style={{ width: 46, height: 46, left: "42%", bottom: -22 }} />
              <span className="pcat">{catOf(a.cat) ? `${catOf(a.cat).icon} ${catOf(a.cat).label}` : "กิจกรรมโรงเรียน"}</span>
              <h3>{a.name || "ยังไม่ตั้งชื่อกิจกรรม"}</h3>
            </div>
            <div className="pdate">
              <div className="pd">
                <b>{d ? Number(d[2]) : "-"}</b>
                <span>{d ? TH_MS[Number(d[1]) - 1] : ""}</span>
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{a.date ? thFull(a.date) : "ยังไม่กำหนดวันที่"}</div>
                <div className="usub">{spanDays(a) > 1 ? `ต่อเนื่อง ${spanDays(a)} วัน ถึง ${thDate(a.dateEnd)}` : ""}
                  {a.time ? (spanDays(a) > 1 ? " · " : "") + "เวลา " + a.time + " น." : ""}</div>
              </div>
            </div>
            <div className="pbody">
              {a.place && <div>📍 {a.place}</div>}
              {a.target && <div>👥 {a.target}</div>}
              {a.dress && <div>👔 การแต่งกาย {a.dress}</div>}
              <div>🏫 รับผิดชอบโดย {unitName(a.unitId) || "ยังไม่มอบหมาย"}</div>
            </div>
            <div className="pfoot">
              <Care size={58} mood="happy" />
              <div><b>{data.meta.school}</b><br />{data.meta.year}</div>
            </div>
          </div>
          <div className="noposter" style={{ display: "flex", gap: 9, marginTop: 14, justifyContent: "center" }}>
            <button className="btn btn-p" onClick={() => window.print()}>🖨 พิมพ์ / บันทึกเป็น PDF</button>
            <button className="btn btn-g" onClick={() => setModal(null)}>ปิด</button>
          </div>
        </div>
      </div>
    );
  };

  const TasksModal = () => {
    const [list, setList] = useState(cur.tasks || []);
    const [title, setTitle] = useState("");
    const [owner, setOwner] = useState("");
    const [due, setDue] = useState("");
    const add = () => {
      if (!title.trim()) return;
      setList([...list, { id: uid(), title: title.trim(), owner: owner.trim(), due, done: false }]);
      setTitle(""); setDue("");
    };
    return (
      <div className="ovl" onClick={() => setModal(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="mhead">
            <div><h3>เช็กลิสต์เตรียมงาน</h3>
              <p>งานที่ {cur.no} · {cur.name || "ยังไม่ตั้งชื่อกิจกรรม"}
                {cur.date ? ` · จัดวันที่ ${thDate(cur.date)}` : ""}</p></div>
            <button className="x" aria-label="ปิดหน้าต่าง" onClick={() => setModal(null)}>✕</button>
          </div>
          <div className="field"><label>งานที่ต้องเตรียม</label>
            <input className="inp" value={title} onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()} placeholder="เช่น จองหอประชุม / ทำป้ายไวนิล / ขออนุมัติงบ" /></div>
          <div className="row2">
            <div className="field"><label>ผู้รับผิดชอบ</label>
              <input className="inp" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="ชื่อครูหรือกลุ่มงาน" /></div>
            <div className="field"><label>กำหนดเสร็จ</label>
              <input className="inp" type="date" value={due} onChange={(e) => setDue(e.target.value)} /></div>
          </div>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
            <button className="btn btn-n" onClick={add} disabled={!title.trim()}>+ เพิ่มรายการ</button>
            <button className="btn btn-g" disabled={!cur.date} title={cur.date ? "" : "ต้องกำหนดวันจัดกิจกรรมก่อน"}
              onClick={() => {
                const base = new Date(cur.date + "T00:00:00");
                const add9 = TASK_TEMPLATE.map((t) => {
                  const d = new Date(base); d.setDate(d.getDate() - t.before);
                  return { id: uid(), title: t.title, owner: "", due: ymd(d), done: false };
                }).filter((t) => !list.some((x) => x.title === t.title));
                setList([...list, ...add9]);
              }}>⚡ ใช้ชุดงานมาตรฐาน 9 ขั้น</button>
          </div>

          <h4 style={{ fontSize: 14.5, margin: "20px 0 10px" }}>
            รายการทั้งหมด ({list.filter((x) => x.done).length}/{list.length})</h4>
          {list.length === 0 ? (
            <div style={{ background: "var(--cream)", borderRadius: 16, padding: 16, textAlign: "center",
              color: "var(--gray)", fontSize: 14 }}>ยังไม่มีรายการ เพิ่มงานย่อยที่ต้องทำก่อนถึงวันจัดกิจกรรม</div>
          ) : (
            <div className="plist">
              {list.map((t) => {
                const b = dueBadge(t.due);
                return (
                  <div className={"tkrow" + (t.done ? " done" : "")} key={t.id}>
                    <button className={"tkbox" + (t.done ? " on" : "")}
                      aria-label={t.done ? "ยกเลิกเครื่องหมายเสร็จ" : "ทำเครื่องหมายว่าเสร็จ"}
                      onClick={() => setList(list.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}>
                      {t.done ? "✓" : ""}</button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="tkt">{t.title}</div>
                      {(t.owner || t.due) && <div className="usub">
                        {t.owner || ""}{t.owner && t.due ? " · " : ""}{t.due ? "กำหนด " + thDate(t.due) : ""}</div>}
                    </div>
                    {b && !t.done && <span className={"duebad " + b.cls}>{b.text}</span>}
                    <button className="btn btn-danger btn-sm"
                      onClick={() => setList(list.filter((x) => x.id !== t.id))}>ลบ</button>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ display: "flex", gap: 9, marginTop: 20 }}>
            <button className="btn btn-p" onClick={() => { patchAct(cur.id, { tasks: list }, "บันทึกเช็กลิสต์แล้ว"); setModal(null); }}>
              บันทึก {list.length} รายการ</button>
            <button className="btn btn-g" onClick={() => setModal(null)}>ยกเลิก</button>
          </div>
        </div>
      </div>
    );
  };

  const DocModal = () => {
    const isNew = !modal.docId;
    const d0 = isNew ? null : (data.docs || []).find((x) => x.id === modal.docId);
    const [f, setF] = useState(d0 || { docNo: "", docDate: "", recvDate: TODAY, from: "", subject: "",
      type: "info", unitId: "", owner: "", due: "", eventDate: "", status: "new", note: "", fileUrl: "", result: "" });
    const set = (k, v) => setF({ ...f, [k]: v });
    const [askDel, setAskDel] = useState(false);
    const submit = () => {
      if (isNew) {
        save({ ...data, docs: [...(data.docs || []),
          { ...f, id: "d" + uid(), activityId: "", updatedAt: new Date().toISOString() }] }, "ลงรับหนังสือแล้ว");
      } else patchDoc(d0.id, f, "บันทึกการแก้ไขแล้ว");
      setModal(null);
    };
    return (
      <div className="ovl" onClick={() => setModal(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="mhead">
            <div><h3>{isNew ? "ลงรับหนังสือเข้า" : "แก้ไขหนังสือ"}</h3>
              <p>บันทึกหนังสือจากหน่วยงานภายนอก แล้วมอบหมายกลุ่มผู้รับผิดชอบ</p></div>
            <button className="x" aria-label="ปิดหน้าต่าง" onClick={() => setModal(null)}>✕</button>
          </div>
          <div className="field"><label>เรื่อง</label>
            <textarea className="inp" value={f.subject} onChange={(e) => set("subject", e.target.value)}
              placeholder="เช่น ขอเชิญส่งนักเรียนเข้าร่วมการแข่งขันทักษะภาษาไทย" /></div>
          <div className="row2">
            <div className="field"><label>เลขที่หนังสือ</label>
              <input className="inp" value={f.docNo} onChange={(e) => set("docNo", e.target.value)} placeholder="เช่น ศธ 04266/1234" /></div>
            <div className="field"><label>จากหน่วยงาน</label>
              <input className="inp" value={f.from} onChange={(e) => set("from", e.target.value)} placeholder="เช่น สพม.ลำปาง ลำพูน" /></div>
          </div>
          <div className="row2">
            <div className="field"><label>ลงวันที่</label>
              <input className="inp" type="date" value={f.docDate} onChange={(e) => set("docDate", e.target.value)} /></div>
            <div className="field"><label>วันที่รับเรื่อง</label>
              <input className="inp" type="date" value={f.recvDate} onChange={(e) => set("recvDate", e.target.value)} /></div>
          </div>
          <div className="row2">
            <div className="field"><label>ประเภทหนังสือ</label>
              <select className="inp" value={f.type} onChange={(e) => set("type", e.target.value)}>
                {DOC_TYPES.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
              </select></div>
            <div className="field"><label>สถานะ</label>
              <select className="inp" value={f.status} onChange={(e) => set("status", e.target.value)}>
                {DOC_STATUS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select></div>
          </div>
          <div className="row2">
            <div className="field"><label>มอบหมายให้กลุ่ม</label>
              <select className="inp" value={f.unitId} onChange={(e) => set("unitId", e.target.value)}>
                <option value="">— ยังไม่มอบหมาย —</option>
                {["กลุ่มสาระการเรียนรู้", "กลุ่มบริหาร"].map((t) => (
                  <optgroup key={t} label={t}>
                    {unitsOfType(data.units, t).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </optgroup>
                ))}
              </select></div>
            <div className="field"><label>ครูผู้รับผิดชอบ</label>
              <input className="inp" value={f.owner} onChange={(e) => set("owner", e.target.value)} placeholder="ชื่อครู" /></div>
          </div>
          <div className="row2">
            <div className="field"><label>กำหนดส่ง / สมัครภายใน</label>
              <input className="inp" type="date" value={f.due} onChange={(e) => set("due", e.target.value)} /></div>
            <div className="field"><label>วันจัด / วันแข่งขัน</label>
              <input className="inp" type="date" value={f.eventDate} onChange={(e) => set("eventDate", e.target.value)} /></div>
          </div>
          <div className="field"><label>ลิงก์ไฟล์หนังสือ</label>
            <input className="inp" value={f.fileUrl} onChange={(e) => set("fileUrl", e.target.value)} placeholder="วางลิงก์ Google Drive ของไฟล์สแกน" /></div>
          <div className="field"><label>หมายเหตุ</label>
            <input className="inp" value={f.note} onChange={(e) => set("note", e.target.value)} placeholder="ข้อสั่งการของผู้บริหาร หรือรายละเอียดเพิ่มเติม" /></div>
          <div className="field"><label>ผลการดำเนินการ / รางวัลที่ได้รับ</label>
            <input className="inp" value={f.result} onChange={(e) => set("result", e.target.value)} placeholder="เช่น ได้รับรางวัลเหรียญทอง ระดับเขตพื้นที่" /></div>
          <div style={{ display: "flex", gap: 9, marginTop: 6, flexWrap: "wrap" }}>
            <button className="btn btn-p" onClick={submit} disabled={!f.subject.trim()}>
              {isNew ? "ลงรับหนังสือ" : "บันทึกการแก้ไข"}</button>
            <button className="btn btn-g" onClick={() => setModal(null)}>ยกเลิก</button>
            {!isNew && (askDel
              ? <span style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--red)" }}>ลบถาวร แน่ใจไหม</span>
                  <button className="btn btn-danger" onClick={() => {
                    save({ ...data, docs: data.docs.filter((x) => x.id !== d0.id) }, "ลบหนังสือแล้ว");
                    setModal(null);
                  }}>ยืนยันลบ</button>
                  <button className="btn btn-g" onClick={() => setAskDel(false)}>ยกเลิก</button>
                </span>
              : <button className="btn btn-danger" style={{ marginLeft: "auto" }} onClick={() => setAskDel(true)}>ลบหนังสือ</button>)}
          </div>
        </div>
      </div>
    );
  };

  const MoreModal = () => {
    const go = (id) => { setPage(id); setModal(null); };
    const Item = ({ ic, label, onClick, badge }) => (
      <button className="prow" style={{ textAlign: "left", width: "100%" }} onClick={onClick}>
        <div className="pav" style={{ background: "#fff" }}>{ic}</div>
        <div style={{ flex: 1, fontWeight: 600 }}>{label}</div>
        {badge ? <span className="navbadge">{badge}</span> : null}
      </button>
    );
    return (
      <div className="ovl" onClick={() => setModal(null)} style={{ alignItems: "flex-end" }}>
        <div className="modal" style={{ maxWidth: 480, borderRadius: "26px 26px 0 0", marginBottom: -20 }}
          onClick={(e) => e.stopPropagation()}>
          <div className="mhead"><div><h3>เมนูทั้งหมด</h3><p>{data.meta.school}</p></div>
            <button className="x" aria-label="ปิดหน้าต่าง" onClick={() => setModal(null)}>✕</button></div>
          <div className="plist">
            {NAV.map((n) => <Item key={n.id} ic={n.ic} label={n.label} badge={n.badge} onClick={() => go(n.id)} />)}
          </div>
          <h4 style={{ fontSize: 14.5, margin: "20px 0 10px" }}>ผู้ดูแล</h4>
          <div className="plist">
            {admin ? (
              <>
                <Item ic="➕" label="เพิ่มกิจกรรม" onClick={() => setModal({ type: "edit", id: null })} />
                <Item ic="📨" label="ลงรับหนังสือ" onClick={() => setModal({ type: "doc", docId: null })} />
                <Item ic="📝" label="สรุปหลังกิจกรรม" onClick={() => setModal({ type: "quick" })} />
                <Item ic="📥" label="เพิ่มหลายงานพร้อมกัน" onClick={() => setModal({ type: "bulk" })} />
                <Item ic="👥" label="จัดการกลุ่ม" onClick={() => setModal({ type: "units" })} />
                <Item ic="⚙" label="ตั้งค่าระบบ" onClick={() => setModal({ type: "settings" })} />
                <Item ic="🚪" label="ออกจากโหมดผู้ดูแล" onClick={() => { leaveAdmin(); setModal(null); }} />
              </>
            ) : (
              <Item ic="🔒" label="เข้าสู่โหมดผู้ดูแล" onClick={() => setModal({ type: "pin" })} />
            )}
          </div>
        </div>
      </div>
    );
  };

  const QuickModal = () => (
    <div className="ovl" onClick={() => setModal(null)} style={{ alignItems: "flex-end" }}>
      <div className="modal" style={{ maxWidth: 480, borderRadius: "26px 26px 0 0", marginBottom: -20 }} onClick={(e) => e.stopPropagation()}>
        <div className="mhead"><div><h3>เลือกงานที่จะสรุป</h3><p>แตะงานเพื่อบันทึกผลและผู้ไม่เข้าร่วม</p></div>
          <button className="x" aria-label="ปิดหน้าต่าง" onClick={() => setModal(null)}>✕</button></div>
        <div className="plist">
          {acts.filter((a) => a.name).map((a) => (
            <button className="prow" key={a.id} style={{ textAlign: "left", width: "100%" }}
              onClick={() => setModal({ type: "absent", id: a.id })}>
              <div className="pav" style={{ background: colorOf(a.unitId), color: "#fff" }}>{a.no}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</div>
                <div className="usub">{unitName(a.unitId) || "ยังไม่มอบหมาย"}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const leaveAdmin = async () => {
    try { await window.activityAuth?.signOut?.(); } catch (e) {}
    setAdmin(false);
    try {
      const r = await window.storage.get(KEY, true);
      if (r?.value) setData(JSON.parse(r.value));
    } catch (e) {}
    say("ออกจากระบบผู้ดูแลแล้ว");
  };

  return (
    <div className={"tp" + (modal && modal.type === "poster" ? " posteropen" : "")}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <aside className="sidebar">
        <div className="brandbox">
          <div className="brandmark"><Care size={34} /></div>
          <div><div className="brandname">TUPKLN<br />ACTIVITY 360</div>
            <div className="brandsub">ปฏิทินกิจกรรมโรงเรียน</div></div>
        </div>
        <div className="navgroup">เมนูหลัก</div>
        {NAV.map((n) => (
          <button key={n.id} className={"navitem" + (page === n.id ? " on" : "")} onClick={() => setPage(n.id)}>
            <span className="ic">{n.ic}</span>{n.label}
            {n.badge ? <span className="navbadge">{n.badge}</span> : null}
          </button>
        ))}
        <div className="navgroup">ผู้ดูแล</div>
        {admin ? (
          <>
            <button className="navitem" onClick={() => setModal({ type: "edit", id: null })}><span className="ic">➕</span>เพิ่มกิจกรรม</button>
            <button className="navitem" onClick={() => setModal({ type: "quick" })}><span className="ic">📝</span>สรุปหลังกิจกรรม</button>
            <button className="navitem" onClick={() => setModal({ type: "bulk" })}><span className="ic">📥</span>เพิ่มหลายงานพร้อมกัน</button>
            <button className="navitem" onClick={() => setModal({ type: "units" })}><span className="ic">👥</span>จัดการกลุ่ม</button>
            <button className="navitem" onClick={() => setModal({ type: "settings" })}><span className="ic">⚙</span>ตั้งค่าระบบ</button>
            <button className="navitem" onClick={leaveAdmin}><span className="ic">🚪</span>ออกจากระบบผู้ดูแล</button>
          </>
        ) : (
          <button className="navitem" onClick={() => setModal({ type: "pin" })}><span className="ic">🔒</span>เข้าสู่ระบบผู้ดูแล</button>
        )}
        <div style={{ marginTop: 20, padding: "14px 12px", background: "var(--cream)", borderRadius: 16, fontSize: 12.5, color: "var(--gray)" }}>
          {data.meta.school}<br />{data.meta.year}
        </div>
      </aside>

      <main className="main">
        <div className="topbar noprint">
          <div className="mobilebrand">
            <div className="brandmark" style={{ width: 38, height: 38 }}><Care size={26} /></div>
            <div><div className="brandname" style={{ fontSize: 14 }}>TUPKLN ACTIVITY 360</div>
              <div className="brandsub">{data.meta.year}</div></div>
          </div>
          <div className="grow" />
          <button className="btn btn-g btn-sm" onClick={refresh} title="ดึงข้อมูลล่าสุดทันที">
            ↻ {syncAt ? "อัปเดต " + hhmm(syncAt) + " น." : "อัปเดต"}
          </button>
          <div className="roleTag" onClick={() => !admin && setModal({ type: "pin" })} style={{ cursor: admin ? "default" : "pointer" }}>
            <span className="dot" style={{ background: admin ? "var(--pink)" : "var(--green)" }} />
            {admin ? "ผู้ดูแลระบบ" : "มุมมองคุณครู"}
          </div>
        </div>

        <div className="pagewrap" key={page}>
          {page === "cal" && <Calendar />}
          {page === "acts" && <Acts />}
          {page === "tasks" && <Tasks />}
          {page === "docs" && <Docs />}
          {page === "report" && <Report />}
        </div>
      </main>

      <nav className="bnav">
        {[["cal", "📅", "ปฏิทิน"], ["acts", "📋", "กิจกรรม"]].map(([id, ic, l]) => (
          <button key={id} className={"bitem" + (page === id ? " on" : "")} onClick={() => setPage(id)}>
            <span style={{ fontSize: 19 }}>{ic}</span>{l}</button>
        ))}
        <button className="bplus" aria-label="เพิ่มหรือสรุปกิจกรรม" onClick={() => admin ? setModal({ type: "quick" }) : setModal({ type: "pin" })}>+</button>
        <button className={"bitem" + (page === "docs" ? " on" : "")} onClick={() => setPage("docs")}>
          <span style={{ fontSize: 19 }}>📨</span>หนังสือ</button>
        <button className="bitem" onClick={() => setModal({ type: "more" })}>
          <span style={{ fontSize: 19 }}>⋯</span>เมนูทั้งหมด</button>
      </nav>

      {modal && modal.type === "view" && cur && <ViewModal />}
      {modal && modal.type === "absent" && cur && <AbsentModal />}
      {modal && modal.type === "edit" && <EditModal />}
      {modal && modal.type === "pin" && <PinModal />}
      {modal && modal.type === "settings" && <SettingsModal />}
      {modal && modal.type === "quick" && <QuickModal />}
      {modal && modal.type === "bulk" && <BulkModal />}
      {modal && modal.type === "units" && <UnitsModal />}
      {modal && modal.type === "poster" && cur && <PosterModal />}
      {modal && modal.type === "tasks" && cur && <TasksModal />}
      {modal && modal.type === "doc" && <DocModal />}
      {modal && modal.type === "more" && <MoreModal />}

      {party && (
        <>
          <div className="confetti">
            {Array.from({ length: 46 }).map((_, i) => (
              <i key={i} style={{
                left: (i * 2.2 + Math.random() * 2) + "%",
                background: COLORS[i % COLORS.length],
                animationDelay: (Math.random() * 0.7).toFixed(2) + "s",
              }} />
            ))}
          </div>
          <div className="partybox">
            <Care size={112} mood="happy" />
            <h3 style={{ marginTop: 6 }}>สรุปครบทุกกิจกรรมแล้ว</h3>
            <p style={{ color: "var(--gray)", fontSize: 14, margin: "6px 0 0" }}>ขอบคุณคุณครูทุกท่านครับ</p>
          </div>
        </>
      )}
      {offline && (
        <div className="toast noprint" style={{ background: "var(--orange)", bottom: "auto", top: 14 }}>
          <span>📶</span>ตอนนี้ไม่ได้เชื่อมต่ออินเทอร์เน็ต ข้อมูลที่เห็นเป็นข้อมูลล่าสุดที่โหลดไว้
        </div>
      )}
      {toast && <div className="toast"><span>{toast.icon}</span>{toast.msg}</div>}
    </div>
  );
}
