"use client";

import { useEffect, useState } from "react";
import { Wind, Droplets } from "lucide-react";

const LAT = -7.7541377;
const LON = 113.1952448;

/* ═══════════════════════════════════════════════
   SCENE: CERAH — Petugas membantu warga berjalan
   ═══════════════════════════════════════════════ */
const SceneClear = () => (
  <svg viewBox="0 0 200 140" style={{ width: "100%", height: "100%" }}>
    <defs>
      <linearGradient id="sky-clear" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="ground-clear" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#4ade80" />
      </linearGradient>
      <linearGradient id="vest-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
      <radialGradient id="sun-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
      </radialGradient>
      <filter id="shadow-sm">
        <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodOpacity="0.15" />
      </filter>
      <filter id="shadow-ground">
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
    <style>{`
      .officer-walk { animation: off-walk 0.55s ease-in-out infinite; transform-origin: 80px 75px; }
      @keyframes off-walk { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      .off-ll { animation: oll 0.55s ease-in-out infinite; transform-origin: 76px 95px; }
      .off-rl { animation: orl 0.55s ease-in-out infinite; transform-origin: 84px 95px; }
      @keyframes oll { 0% { transform: rotate(-12deg); } 50% { transform: rotate(12deg); } 100% { transform: rotate(-12deg); } }
      @keyframes orl { 0% { transform: rotate(12deg); } 50% { transform: rotate(-12deg); } 100% { transform: rotate(12deg); } }
      .off-la { animation: ola 0.55s ease-in-out infinite; transform-origin: 70px 65px; }
      .off-ra { animation: ora 0.55s ease-in-out infinite; transform-origin: 90px 65px; }
      @keyframes ola { 0% { transform: rotate(15deg); } 50% { transform: rotate(-15deg); } 100% { transform: rotate(15deg); } }
      @keyframes ora { 0% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } 100% { transform: rotate(-15deg); } }
      .civ-walk { animation: civ-w 0.7s ease-in-out infinite; transform-origin: 130px 80px; }
      @keyframes civ-w { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
      .civ-ll { animation: cll 0.7s ease-in-out infinite; transform-origin: 126px 100px; }
      .civ-rl { animation: crl 0.7s ease-in-out infinite; transform-origin: 134px 100px; }
      @keyframes cll { 0% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } 100% { transform: rotate(-10deg); } }
      @keyframes crl { 0% { transform: rotate(10deg); } 50% { transform: rotate(-10deg); } 100% { transform: rotate(10deg); } }
      .sun-spin { animation: sun-s 20s linear infinite; transform-origin: 175px 22px; }
      @keyframes sun-s { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .sun-pulse { animation: sun-p 3s ease-in-out infinite; }
      @keyframes sun-p { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }
      .bird1 { animation: fly1 6s linear infinite; }
      .bird2 { animation: fly2 8s linear infinite; }
      @keyframes fly1 { 0% { transform: translate(0,0); } 50% { transform: translate(60px,-10px); } 100% { transform: translate(120px,0); opacity: 0; } }
      @keyframes fly2 { 0% { transform: translate(0,0); } 50% { transform: translate(40px,-8px); } 100% { transform: translate(90px,0); opacity: 0; } }
    `}</style>

    {/* Sky */}
    <rect x="0" y="0" width="200" height="110" fill="url(#sky-clear)" />

    {/* Sun */}
    <g className="sun-pulse">
      <circle cx="175" cy="22" r="20" fill="url(#sun-glow)" />
      <circle cx="175" cy="22" r="10" fill="#fbbf24" />
    </g>
    <g className="sun-spin">
      {[0,45,90,135,180,225,270,315].map(a => (
        <rect key={a} x="173" y="4" width="4" height="8" rx="2" fill="#fbbf24" opacity="0.5" transform={`rotate(${a} 175 22)`} />
      ))}
    </g>

    {/* Birds */}
    <g className="bird1"><path d="M20 30 Q23 27 26 30 M26 30 Q29 27 32 30" stroke="#666" strokeWidth="1" fill="none" /></g>
    <g className="bird2"><path d="M50 20 Q52 17 54 20 M54 20 Q56 17 58 20" stroke="#666" strokeWidth="0.8" fill="none" /></g>

    {/* Ground with perspective */}
    <ellipse cx="100" cy="122" rx="110" ry="22" fill="url(#ground-clear)" />
    <ellipse cx="100" cy="122" rx="108" ry="20" fill="#6ee7b7" opacity="0.5" />
    {/* Grass details */}
    {[20,35,55,70,90,110,130,150,165].map((x,i) => (
      <g key={i}>
        <line x1={x} y1="118" x2={x-2} y2={113 - (i%3)*2} stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1={x+3} y1="119" x2={x+4} y2={114 - (i%2)*3} stroke="#16a34a" strokeWidth="1" strokeLinecap="round" />
      </g>
    ))}
    {/* Small flowers */}
    <circle cx="40" cy="115" r="2.5" fill="#fbbf24" /><circle cx="40" cy="115" r="1" fill="#fff" />
    <circle cx="155" cy="116" r="2" fill="#f472b6" /><circle cx="155" cy="116" r="0.8" fill="#fff" />

    {/* Ground shadows */}
    <ellipse cx="80" cy="120" rx="12" ry="3" fill="#000" opacity="0.06" />
    <ellipse cx="130" cy="121" rx="10" ry="2.5" fill="#000" opacity="0.06" />

    {/* ── OFFICER (BPBD) ── */}
    <g filter="url(#shadow-sm)">
      <g className="officer-walk">
        {/* Helmet */}
        <ellipse cx="80" cy="55" rx="10" ry="7" fill="#f97316" />
        <rect x="70" y="56" width="20" height="3" rx="1.5" fill="#ea580c" />
        <rect x="77" y="49" width="6" height="3" rx="1.5" fill="#fbbf24" />
        {/* Face */}
        <circle cx="80" cy="62" r="7" fill="#fcd9b6" />
        <circle cx="77.5" cy="61" r="1.2" fill="#333" />
        <circle cx="82.5" cy="61" r="1.2" fill="#333" />
        <path d="M78 65 Q80 67 82 65" fill="none" stroke="#a3705f" strokeWidth="0.8" strokeLinecap="round" />
        {/* Body / Vest */}
        <rect x="72" y="69" width="16" height="18" rx="3" fill="url(#vest-grad)" />
        <rect x="78" y="69" width="4" height="18" rx="1" fill="#c2410c" opacity="0.4" />
        <rect x="73" y="74" width="14" height="2" rx="1" fill="#fbbf24" opacity="0.7" />
        <rect x="73" y="80" width="14" height="2" rx="1" fill="#fbbf24" opacity="0.7" />
        {/* Belt */}
        <rect x="72" y="85" width="16" height="2" rx="1" fill="#44403c" />
      </g>
      {/* Arms */}
      <g className="off-la">
        <rect x="65" y="70" width="7" height="16" rx="3.5" fill="url(#vest-grad)" />
        <circle cx="68.5" cy="87" r="3" fill="#fcd9b6" />
      </g>
      <g className="off-ra">
        <rect x="88" y="70" width="7" height="16" rx="3.5" fill="url(#vest-grad)" />
        <circle cx="91.5" cy="87" r="3" fill="#fcd9b6" />
      </g>
      {/* Legs */}
      <g className="off-ll">
        <rect x="73" y="87" width="7" height="18" rx="3.5" fill="#1e3a5f" />
        <rect x="71" y="103" width="10" height="5" rx="2.5" fill="#292524" />
      </g>
      <g className="off-rl">
        <rect x="80" y="87" width="7" height="18" rx="3.5" fill="#1e3a5f" />
        <rect x="79" y="103" width="10" height="5" rx="2.5" fill="#292524" />
      </g>
    </g>

    {/* ── CIVILIAN (Warga) ── */}
    <g filter="url(#shadow-sm)">
      <g className="civ-walk">
        {/* Hair */}
        <ellipse cx="130" cy="62" rx="7" ry="5" fill="#44403c" />
        {/* Face */}
        <circle cx="130" cy="66" r="6" fill="#fcd9b6" />
        <circle cx="128" cy="65" r="1" fill="#333" />
        <circle cx="132" cy="65" r="1" fill="#333" />
        <path d="M128 68 Q130 70 132 68" fill="none" stroke="#a3705f" strokeWidth="0.7" strokeLinecap="round" />
        {/* Shirt */}
        <rect x="123" y="72" width="14" height="16" rx="3" fill="#60a5fa" />
        <rect x="128" y="72" width="4" height="16" rx="1" fill="#3b82f6" opacity="0.3" />
      </g>
      {/* Arms */}
      <rect x="117" y="73" width="6" height="13" rx="3" fill="#60a5fa" />
      <circle cx="120" cy="87" r="2.5" fill="#fcd9b6" />
      <rect x="137" y="73" width="6" height="13" rx="3" fill="#60a5fa" />
      <circle cx="140" cy="87" r="2.5" fill="#fcd9b6" />
      {/* Legs */}
      <g className="civ-ll">
        <rect x="124" y="88" width="6" height="15" rx="3" fill="#78716c" />
        <rect x="123" y="101" width="8" height="4" rx="2" fill="#57534e" />
      </g>
      <g className="civ-rl">
        <rect x="130" y="88" width="6" height="15" rx="3" fill="#78716c" />
        <rect x="129" y="101" width="8" height="4" rx="2" fill="#57534e" />
      </g>
      {/* Tas / Barang bawaan */}
      <rect x="139" y="75" width="8" height="10" rx="2" fill="#a16207" />
      <rect x="140" y="73" width="6" height="2" rx="1" fill="#92400e" />
    </g>
  </svg>
);

/* ═══════════════════════════════════════════════
   SCENE: HUJAN — Petugas mengevakuasi warga
   ═══════════════════════════════════════════════ */
const SceneRain = () => (
  <svg viewBox="0 0 200 140" style={{ width: "100%", height: "100%" }}>
    <defs>
      <linearGradient id="sky-rain" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="ground-rain" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a3a3a3" />
        <stop offset="100%" stopColor="#78716c" />
      </linearGradient>
      <linearGradient id="vest-r" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <style>{`
      .rain-off-walk { animation: row 0.5s ease-in-out infinite; transform-origin: 70px 78px; }
      @keyframes row { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      .rain-off-ll { animation: roll 0.5s ease-in-out infinite; transform-origin: 66px 98px; }
      .rain-off-rl { animation: rorl 0.5s ease-in-out infinite; transform-origin: 74px 98px; }
      @keyframes roll { 0%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}100%{transform:rotate(-14deg)} }
      @keyframes rorl { 0%{transform:rotate(14deg)}50%{transform:rotate(-14deg)}100%{transform:rotate(14deg)} }
      .rain-off-la { animation: rola 0.5s ease-in-out infinite; transform-origin: 60px 68px; }
      @keyframes rola { 0%{transform:rotate(10deg)}50%{transform:rotate(-10deg)}100%{transform:rotate(10deg)} }
      .rain-civ { animation: rciv 0.6s ease-in-out infinite; transform-origin: 115px 80px; }
      @keyframes rciv { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
      .rain-civ-ll { animation: rcll 0.6s ease-in-out infinite; transform-origin: 112px 98px; }
      .rain-civ-rl { animation: rcrl 0.6s ease-in-out infinite; transform-origin: 118px 98px; }
      @keyframes rcll { 0%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}100%{transform:rotate(-10deg)} }
      @keyframes rcrl { 0%{transform:rotate(10deg)}50%{transform:rotate(-10deg)}100%{transform:rotate(10deg)} }
      .raindrop-anim { animation: rd-fall linear infinite; }
      @keyframes rd-fall { 0%{transform:translateY(-15px);opacity:1}100%{transform:translateY(140px);opacity:0.2} }
      .puddle-ripple { animation: pr 1.5s ease-out infinite; transform-origin: center; }
      @keyframes pr { 0%{transform:scale(0.5);opacity:0.8}100%{transform:scale(2);opacity:0} }
    `}</style>

    {/* Sky */}
    <rect x="0" y="0" width="200" height="110" fill="url(#sky-rain)" />

    {/* Rain clouds */}
    <ellipse cx="50" cy="15" rx="30" ry="12" fill="#94a3b8" opacity="0.5" />
    <ellipse cx="35" cy="12" rx="18" ry="10" fill="#94a3b8" opacity="0.4" />
    <ellipse cx="70" cy="13" rx="20" ry="9" fill="#94a3b8" opacity="0.45" />
    <ellipse cx="140" cy="18" rx="25" ry="10" fill="#94a3b8" opacity="0.4" />
    <ellipse cx="160" cy="15" rx="18" ry="9" fill="#94a3b8" opacity="0.35" />

    {/* Rain drops */}
    {Array.from({length: 30}).map((_,i) => (
      <line key={i} className="raindrop-anim"
        x1={5 + (i * 6.5) % 195} y1="0" x2={3 + (i * 6.5) % 195} y2={8 + (i%4)*3}
        stroke="#60a5fa" strokeWidth={1 + (i%2)*0.5} strokeLinecap="round" opacity="0.4"
        style={{ animationDuration: `${0.4 + (i%5)*0.1}s`, animationDelay: `${(i*0.06)%0.8}s` }}
      />
    ))}

    {/* Ground (wet) */}
    <ellipse cx="100" cy="122" rx="110" ry="22" fill="url(#ground-rain)" />
    <ellipse cx="100" cy="122" rx="108" ry="20" fill="#a1a1aa" opacity="0.3" />

    {/* Puddles */}
    <ellipse cx="45" cy="120" rx="15" ry="4" fill="#93c5fd" opacity="0.3" />
    <ellipse cx="45" cy="120" rx="8" ry="2" className="puddle-ripple" fill="none" stroke="#93c5fd" strokeWidth="0.5" />
    <ellipse cx="155" cy="121" rx="12" ry="3" fill="#93c5fd" opacity="0.25" />

    {/* Ground shadows */}
    <ellipse cx="70" cy="120" rx="12" ry="3" fill="#000" opacity="0.08" />
    <ellipse cx="115" cy="121" rx="10" ry="2.5" fill="#000" opacity="0.08" />

    {/* ── OFFICER holding umbrella over civilian ── */}
    <g>
      {/* Umbrella */}
      <line x1="90" y1="42" x2="90" y2="90" stroke="#57534e" strokeWidth="2" />
      <path d="M65 45 Q77 25 90 42 Q103 25 115 45 Z" fill="#ef4444" />
      <path d="M77 42 Q83 34 90 42" fill="none" stroke="#dc2626" strokeWidth="0.5" />
      <path d="M90 42 Q97 34 103 42" fill="none" stroke="#dc2626" strokeWidth="0.5" />

      <g className="rain-off-walk">
        {/* Helmet */}
        <ellipse cx="70" cy="58" rx="9" ry="6.5" fill="#f97316" />
        <rect x="61" y="59" width="18" height="2.5" rx="1.2" fill="#ea580c" />
        <rect x="67" y="52" width="5" height="2.5" rx="1.2" fill="#fbbf24" />
        {/* Face */}
        <circle cx="70" cy="65" r="6.5" fill="#fcd9b6" />
        <circle cx="67.5" cy="64" r="1.1" fill="#333" />
        <circle cx="72.5" cy="64" r="1.1" fill="#333" />
        <path d="M68 67.5 Q70 69 72 67.5" fill="none" stroke="#a3705f" strokeWidth="0.7" />
        {/* Body */}
        <rect x="63" y="72" width="14" height="16" rx="3" fill="url(#vest-r)" />
        <rect x="68" y="72" width="4" height="16" rx="1" fill="#c2410c" opacity="0.35" />
        <rect x="64" y="76" width="12" height="2" rx="1" fill="#fbbf24" opacity="0.6" />
        <rect x="64" y="81" width="12" height="2" rx="1" fill="#fbbf24" opacity="0.6" />
        <rect x="63" y="86" width="14" height="2" rx="1" fill="#44403c" />
      </g>
      {/* Left arm (holding umbrella) */}
      <g className="rain-off-la">
        <rect x="56" y="72" width="7" height="15" rx="3.5" fill="url(#vest-r)" />
        <circle cx="59.5" cy="88" r="2.8" fill="#fcd9b6" />
      </g>
      {/* Right arm pointing/guiding */}
      <rect x="77" y="72" width="7" height="14" rx="3.5" fill="url(#vest-r)" transform="rotate(-30 80 72)" />
      <circle cx="86" cy="80" r="2.8" fill="#fcd9b6" />
      {/* Legs */}
      <g className="rain-off-ll">
        <rect x="64" y="88" width="6" height="16" rx="3" fill="#1e3a5f" />
        <rect x="63" y="102" width="9" height="5" rx="2.5" fill="#292524" />
      </g>
      <g className="rain-off-rl">
        <rect x="70" y="88" width="6" height="16" rx="3" fill="#1e3a5f" />
        <rect x="69" y="102" width="9" height="5" rx="2.5" fill="#292524" />
      </g>
    </g>

    {/* ── CIVILIAN (under umbrella) ── */}
    <g>
      <g className="rain-civ">
        <ellipse cx="115" cy="66" rx="6" ry="4.5" fill="#44403c" />
        <circle cx="115" cy="70" r="5.5" fill="#fcd9b6" />
        <circle cx="113" cy="69" r="1" fill="#333" />
        <circle cx="117" cy="69" r="1" fill="#333" />
        <path d="M113 72 Q115 73.5 117 72" fill="none" stroke="#a3705f" strokeWidth="0.6" />
        {/* Shirt */}
        <rect x="109" y="76" width="12" height="14" rx="2.5" fill="#a78bfa" />
        <rect x="113" y="76" width="4" height="14" rx="1" fill="#8b5cf6" opacity="0.3" />
      </g>
      <rect x="104" y="77" width="5" height="12" rx="2.5" fill="#a78bfa" />
      <circle cx="106.5" cy="90" r="2.3" fill="#fcd9b6" />
      <rect x="121" y="77" width="5" height="12" rx="2.5" fill="#a78bfa" />
      <circle cx="123.5" cy="90" r="2.3" fill="#fcd9b6" />
      <g className="rain-civ-ll">
        <rect x="110" y="90" width="5" height="14" rx="2.5" fill="#78716c" />
        <rect x="109" y="102" width="7" height="4" rx="2" fill="#57534e" />
      </g>
      <g className="rain-civ-rl">
        <rect x="115" y="90" width="5" height="14" rx="2.5" fill="#78716c" />
        <rect x="114" y="102" width="7" height="4" rx="2" fill="#57534e" />
      </g>
    </g>
  </svg>
);

/* ═══════════════════════════════════════════════
   SCENE: BERAWAN — Petugas mengarahkan warga
   ═══════════════════════════════════════════════ */
const SceneCloudy = () => (
  <svg viewBox="0 0 200 140" style={{ width: "100%", height: "100%" }}>
    <defs>
      <linearGradient id="sky-cl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="ground-cl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#6ee7b7" />
      </linearGradient>
      <linearGradient id="vest-cl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <style>{`
      .cl-off { animation: cl-w 0.55s ease-in-out infinite; transform-origin: 60px 78px; }
      @keyframes cl-w { 0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)} }
      .cl-off-ll { animation: cl-ll 0.55s ease-in-out infinite; transform-origin: 56px 96px; }
      .cl-off-rl { animation: cl-rl 0.55s ease-in-out infinite; transform-origin: 64px 96px; }
      @keyframes cl-ll { 0%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}100%{transform:rotate(-12deg)} }
      @keyframes cl-rl { 0%{transform:rotate(12deg)}50%{transform:rotate(-12deg)}100%{transform:rotate(12deg)} }
      .cl-ra { animation: cl-ra-a 1s ease-in-out infinite; transform-origin: 70px 68px; }
      @keyframes cl-ra-a { 0%,100%{transform:rotate(-5deg)}50%{transform:rotate(-35deg)} }
      .cl-civ { animation: cl-cv 0.65s ease-in-out infinite; transform-origin: 130px 80px; }
      @keyframes cl-cv { 0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5px)} }
      .cl-cll { animation: clcll 0.65s ease-in-out infinite; transform-origin: 126px 100px; }
      .cl-crl { animation: clcrl 0.65s ease-in-out infinite; transform-origin: 134px 100px; }
      @keyframes clcll { 0%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}100%{transform:rotate(-10deg)} }
      @keyframes clcrl { 0%{transform:rotate(10deg)}50%{transform:rotate(-10deg)}100%{transform:rotate(10deg)} }
      .cloud-drift1 { animation: cdr1 14s linear infinite; }
      .cloud-drift2 { animation: cdr2 18s linear infinite; }
      .cloud-drift3 { animation: cdr3 22s linear infinite; }
      @keyframes cdr1 { 0%{transform:translateX(-60px)}100%{transform:translateX(220px)} }
      @keyframes cdr2 { 0%{transform:translateX(-40px)}100%{transform:translateX(240px)} }
      @keyframes cdr3 { 0%{transform:translateX(-80px)}100%{transform:translateX(200px)} }
    `}</style>

    <rect x="0" y="0" width="200" height="110" fill="url(#sky-cl)" />

    {/* Moving clouds */}
    <g className="cloud-drift1" opacity="0.4">
      <ellipse cx="50" cy="20" rx="22" ry="9" fill="#94a3b8" />
      <ellipse cx="38" cy="18" rx="14" ry="8" fill="#94a3b8" />
      <ellipse cx="65" cy="19" rx="15" ry="7" fill="#94a3b8" />
    </g>
    <g className="cloud-drift2" opacity="0.3">
      <ellipse cx="120" cy="30" rx="18" ry="7" fill="#94a3b8" />
      <ellipse cx="135" cy="28" rx="12" ry="6" fill="#94a3b8" />
    </g>
    <g className="cloud-drift3" opacity="0.35">
      <ellipse cx="80" cy="12" rx="16" ry="6" fill="#94a3b8" />
      <ellipse cx="92" cy="10" rx="10" ry="5" fill="#94a3b8" />
    </g>

    {/* Ground */}
    <ellipse cx="100" cy="122" rx="110" ry="22" fill="url(#ground-cl)" />
    {[25,45,70,95,120,140,160].map((x,i) => (
      <g key={i}>
        <line x1={x} y1="118" x2={x-1} y2={114-(i%3)*2} stroke="#22c55e" strokeWidth="1" strokeLinecap="round" />
        <line x1={x+3} y1="119" x2={x+4} y2={115-(i%2)*2} stroke="#16a34a" strokeWidth="0.8" strokeLinecap="round" />
      </g>
    ))}
    <ellipse cx="60" cy="120" rx="12" ry="3" fill="#000" opacity="0.06" />
    <ellipse cx="130" cy="121" rx="10" ry="2.5" fill="#000" opacity="0.06" />

    {/* Officer with megaphone directing */}
    <g>
      <g className="cl-off">
        <ellipse cx="60" cy="58" rx="9" ry="6.5" fill="#f97316" />
        <rect x="51" y="59" width="18" height="2.5" rx="1.2" fill="#ea580c" />
        <rect x="57" y="52" width="5" height="2.5" rx="1.2" fill="#fbbf24" />
        <circle cx="60" cy="65" r="6.5" fill="#fcd9b6" />
        <circle cx="57.5" cy="64" r="1.1" fill="#333" />
        <circle cx="62.5" cy="64" r="1.1" fill="#333" />
        <ellipse cx="60" cy="67.5" rx="2" ry="1" fill="#333" opacity="0.6" />
        <rect x="53" y="72" width="14" height="16" rx="3" fill="url(#vest-cl)" />
        <rect x="58" y="72" width="4" height="16" rx="1" fill="#c2410c" opacity="0.35" />
        <rect x="54" y="76" width="12" height="2" rx="1" fill="#fbbf24" opacity="0.6" />
        <rect x="54" y="81" width="12" height="2" rx="1" fill="#fbbf24" opacity="0.6" />
        <rect x="53" y="86" width="14" height="2" rx="1" fill="#44403c" />
      </g>
      {/* Left arm */}
      <rect x="46" y="72" width="7" height="15" rx="3.5" fill="url(#vest-cl)" />
      <circle cx="49.5" cy="88" r="2.8" fill="#fcd9b6" />
      {/* Right arm with megaphone */}
      <g className="cl-ra">
        <rect x="67" y="68" width="7" height="14" rx="3.5" fill="url(#vest-cl)" />
        <circle cx="70.5" cy="83" r="2.8" fill="#fcd9b6" />
        {/* Megaphone */}
        <polygon points="73,76 85,72 85,80 73,78" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
        <rect x="71" y="75.5" width="3" height="5" rx="1" fill="#f59e0b" />
      </g>
      <g className="cl-off-ll">
        <rect x="54" y="88" width="6" height="16" rx="3" fill="#1e3a5f" />
        <rect x="53" y="102" width="9" height="5" rx="2.5" fill="#292524" />
      </g>
      <g className="cl-off-rl">
        <rect x="60" y="88" width="6" height="16" rx="3" fill="#1e3a5f" />
        <rect x="59" y="102" width="9" height="5" rx="2.5" fill="#292524" />
      </g>
    </g>

    {/* Civilian walking toward officer */}
    <g>
      <g className="cl-civ">
        <ellipse cx="130" cy="65" rx="6" ry="4.5" fill="#713f12" />
        <circle cx="130" cy="69" r="5.5" fill="#fcd9b6" />
        <circle cx="128" cy="68" r="1" fill="#333" />
        <circle cx="132" cy="68" r="1" fill="#333" />
        <path d="M128 71.5 Q130 73 132 71.5" fill="none" stroke="#a3705f" strokeWidth="0.6" />
        <rect x="124" y="75" width="12" height="14" rx="2.5" fill="#16a34a" />
        <rect x="128" y="75" width="4" height="14" rx="1" fill="#15803d" opacity="0.3" />
      </g>
      <rect x="119" y="76" width="5" height="12" rx="2.5" fill="#16a34a" />
      <circle cx="121.5" cy="89" r="2.3" fill="#fcd9b6" />
      <rect x="136" y="76" width="5" height="12" rx="2.5" fill="#16a34a" />
      <circle cx="138.5" cy="89" r="2.3" fill="#fcd9b6" />
      <g className="cl-cll">
        <rect x="125" y="89" width="5" height="14" rx="2.5" fill="#78716c" />
        <rect x="124" y="101" width="7" height="4" rx="2" fill="#57534e" />
      </g>
      <g className="cl-crl">
        <rect x="130" y="89" width="5" height="14" rx="2.5" fill="#78716c" />
        <rect x="129" y="101" width="7" height="4" rx="2" fill="#57534e" />
      </g>
    </g>
  </svg>
);

/* ═══════════════════════════════════════════════
   SCENE: BADAI — Petugas mengevakuasi warga
   ═══════════════════════════════════════════════ */
const SceneStorm = () => (
  <svg viewBox="0 0 200 140" style={{ width: "100%", height: "100%" }}>
    <defs>
      <linearGradient id="sky-st" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#475569" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="ground-st" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#78716c" />
        <stop offset="100%" stopColor="#57534e" />
      </linearGradient>
      <linearGradient id="vest-st" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <style>{`
      .st-flash { animation: stf 3.5s infinite; }
      @keyframes stf { 0%,88%,92%,96%,100% { opacity: 0; } 89%,93% { opacity: 0.6; } 90% { opacity: 1; } }
      .st-off { animation: stow 0.45s ease-in-out infinite; transform-origin: 75px 78px; }
      @keyframes stow { 0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)} }
      .st-oll { animation: stoll 0.45s ease-in-out infinite; transform-origin: 71px 96px; }
      .st-orl { animation: storl 0.45s ease-in-out infinite; transform-origin: 79px 96px; }
      @keyframes stoll { 0%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}100%{transform:rotate(-14deg)} }
      @keyframes storl { 0%{transform:rotate(14deg)}50%{transform:rotate(-14deg)}100%{transform:rotate(14deg)} }
      .st-civ { animation: stcv 0.45s ease-in-out infinite 0.1s; transform-origin: 115px 82px; }
      @keyframes stcv { 0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)} }
      .st-cll { animation: stcll 0.45s ease-in-out infinite 0.1s; transform-origin: 112px 100px; }
      .st-crl { animation: stcrl 0.45s ease-in-out infinite 0.1s; transform-origin: 118px 100px; }
      @keyframes stcll { 0%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}100%{transform:rotate(-14deg)} }
      @keyframes stcrl { 0%{transform:rotate(14deg)}50%{transform:rotate(-14deg)}100%{transform:rotate(14deg)} }
      .st-rain { animation: str-fall linear infinite; }
      @keyframes str-fall { 0%{transform:translateY(-20px);opacity:1}100%{transform:translateY(150px);opacity:0.1} }
      .st-wind { animation: stwind 2s ease-in-out infinite; }
      @keyframes stwind { 0%,100%{transform:translateX(0)}50%{transform:translateX(8px)} }
    `}</style>

    <rect x="0" y="0" width="200" height="110" fill="url(#sky-st)" />
    <rect x="0" y="0" width="200" height="140" className="st-flash" fill="white" />

    {/* Dark clouds */}
    <ellipse cx="60" cy="15" rx="35" ry="14" fill="#475569" opacity="0.6" />
    <ellipse cx="40" cy="12" rx="22" ry="11" fill="#475569" opacity="0.5" />
    <ellipse cx="85" cy="13" rx="20" ry="10" fill="#475569" opacity="0.55" />
    <ellipse cx="150" cy="18" rx="28" ry="12" fill="#475569" opacity="0.5" />
    <ellipse cx="170" cy="15" rx="20" ry="10" fill="#475569" opacity="0.45" />

    {/* Lightning bolt */}
    <polygon points="95,10 85,35 92,35 82,60 100,28 93,28 100,10" fill="#fbbf24" opacity="0.8" className="st-flash" />

    {/* Heavy rain */}
    {Array.from({length: 35}).map((_,i) => (
      <line key={i} className="st-rain"
        x1={3 + (i*5.8)%197} y1="0" x2={-2 + (i*5.8)%197} y2={10 + (i%5)*3}
        stroke="#60a5fa" strokeWidth={1 + (i%3)*0.5} strokeLinecap="round" opacity="0.5"
        style={{ animationDuration: `${0.3 + (i%4)*0.08}s`, animationDelay: `${(i*0.04)%0.6}s` }}
      />
    ))}

    {/* Ground */}
    <ellipse cx="100" cy="122" rx="110" ry="22" fill="url(#ground-st)" />
    <ellipse cx="40" cy="121" rx="18" ry="4.5" fill="#93c5fd" opacity="0.25" />
    <ellipse cx="150" cy="122" rx="14" ry="3.5" fill="#93c5fd" opacity="0.2" />
    <ellipse cx="75" cy="120" rx="12" ry="3" fill="#000" opacity="0.08" />
    <ellipse cx="115" cy="121" rx="10" ry="2.5" fill="#000" opacity="0.08" />

    {/* Officer carrying/guiding civilian */}
    <g className="st-wind">
      {/* Officer */}
      <g>
        <g className="st-off">
          <ellipse cx="75" cy="58" rx="9" ry="6.5" fill="#f97316" />
          <rect x="66" y="59" width="18" height="2.5" rx="1.2" fill="#ea580c" />
          <rect x="72" y="52" width="5" height="2.5" rx="1.2" fill="#fbbf24" />
          <circle cx="75" cy="65" r="6.5" fill="#fcd9b6" />
          <circle cx="72.5" cy="64" r="1.1" fill="#333" />
          <circle cx="77.5" cy="64" r="1.1" fill="#333" />
          <path d="M73 67.5 Q75 66 77 67.5" fill="none" stroke="#a3705f" strokeWidth="0.7" />
          <rect x="68" y="72" width="14" height="16" rx="3" fill="url(#vest-st)" />
          <rect x="73" y="72" width="4" height="16" rx="1" fill="#c2410c" opacity="0.35" />
          <rect x="69" y="76" width="12" height="2" rx="1" fill="#fbbf24" opacity="0.6" />
          <rect x="69" y="81" width="12" height="2" rx="1" fill="#fbbf24" opacity="0.6" />
          <rect x="68" y="86" width="14" height="2" rx="1" fill="#44403c" />
        </g>
        <rect x="60" y="72" width="7" height="15" rx="3.5" fill="url(#vest-st)" />
        <circle cx="63.5" cy="88" r="2.8" fill="#fcd9b6" />
        {/* Right arm reaching to civilian */}
        <rect x="82" y="70" width="7" height="16" rx="3.5" fill="url(#vest-st)" transform="rotate(-20 85 70)" />
        <circle cx="88" cy="82" r="2.8" fill="#fcd9b6" />
        <g className="st-oll">
          <rect x="69" y="88" width="6" height="16" rx="3" fill="#1e3a5f" />
          <rect x="68" y="102" width="9" height="5" rx="2.5" fill="#292524" />
        </g>
        <g className="st-orl">
          <rect x="75" y="88" width="6" height="16" rx="3" fill="#1e3a5f" />
          <rect x="74" y="102" width="9" height="5" rx="2.5" fill="#292524" />
        </g>
      </g>

      {/* Civilian being helped */}
      <g>
        <g className="st-civ">
          <ellipse cx="115" cy="68" rx="6" ry="4.5" fill="#44403c" />
          <circle cx="115" cy="72" r="5.5" fill="#fcd9b6" />
          <circle cx="113" cy="71" r="1" fill="#333" />
          <circle cx="117" cy="71" r="1" fill="#333" />
          <path d="M113.5 74 Q115 73 116.5 74" fill="none" stroke="#a3705f" strokeWidth="0.6" />
          <rect x="109" y="78" width="12" height="14" rx="2.5" fill="#dc2626" />
          <rect x="113" y="78" width="4" height="14" rx="1" fill="#b91c1c" opacity="0.3" />
        </g>
        {/* Left arm reaching to officer */}
        <rect x="103" y="79" width="6" height="13" rx="3" fill="#dc2626" transform="rotate(20 106 79)" />
        <circle cx="101" cy="87" r="2.3" fill="#fcd9b6" />
        <rect x="121" y="79" width="5" height="12" rx="2.5" fill="#dc2626" />
        <circle cx="123.5" cy="92" r="2.3" fill="#fcd9b6" />
        <g className="st-cll">
          <rect x="110" y="92" width="5" height="14" rx="2.5" fill="#78716c" />
          <rect x="109" y="104" width="7" height="4" rx="2" fill="#57534e" />
        </g>
        <g className="st-crl">
          <rect x="115" y="92" width="5" height="14" rx="2.5" fill="#78716c" />
          <rect x="114" y="104" width="7" height="4" rx="2" fill="#57534e" />
        </g>
      </g>
    </g>
  </svg>
);

/* ═══════════════════════════════════════════════
   MAIN WEATHER WIDGET
   ═══════════════════════════════════════════════ */
export default function WeatherWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
        if (!res.ok) throw new Error("API response not ok");
        const json = await res.json();
        setData(json.current);
      } catch (error) {
        console.error("Error fetching weather:", error);
        // Fallback data if fetch fails
        setData({
          temperature_2m: 29.5,
          relative_humidity_2m: 65,
          weather_code: 1, // Berawan as default
          wind_speed_10m: 10.2,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const getWeatherDesc = (code: number) => {
    if (code === 0) return "Cerah";
    if (code >= 1 && code <= 3) return "Berawan";
    if (code >= 51 && code <= 67) return "Hujan";
    if (code >= 80 && code <= 82) return "Hujan Lebat";
    if (code >= 95) return "Badai Petir";
    return "Berawan";
  };

  const getScene = (code: number) => {
    if (code >= 95) return <SceneStorm />;
    if (code >= 51 && code <= 82) return <SceneRain />;
    if (code >= 1 && code <= 3) return <SceneCloudy />;
    return <SceneClear />;
  };

  const getWeatherEmoji = (code: number) => {
    if (code === 0) return "☀️";
    if (code >= 1 && code <= 3) return "⛅";
    if (code >= 51 && code <= 82) return "🌧️";
    if (code >= 95) return "⛈️";
    return "⛅";
  };

  if (loading) return (
    <div className="card" style={{ padding: "20px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>
      <div style={{ textAlign: "center", color: "#888" }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>🌤️</div>
        Memuat cuaca...
      </div>
    </div>
  );

  if (!data) return <div className="card" style={{ padding: "20px", height: "100%", background: "white" }}>Gagal memuat cuaca</div>;

  return (
    <div className="card" style={{
      padding: "0",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "white",
      overflow: "hidden",
      border: "1px solid #eaeaea",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 16px 8px", borderBottom: "none" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#111", marginBottom: "2px", lineHeight: 1.3 }}>
          Cuaca Daerah BPBD Kota Probolinggo
        </h3>
        <p style={{ fontSize: "10px", color: "#aaa", margin: 0 }}>
          {LAT}, {LON} • {getWeatherDesc(data.weather_code)}
        </p>
      </div>

      {/* Animated Scene */}
      <div style={{ flex: 1, minHeight: "120px", position: "relative" }}>
        {getScene(data.weather_code)}
      </div>

      {/* Footer Stats */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderTop: "1px solid #f0f0f0", background: "#fafafa" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "20px" }}>{getWeatherEmoji(data.weather_code)}</span>
          <div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#111", lineHeight: 1 }}>
              {data.temperature_2m}°C
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#888", fontSize: "12px" }}>
            <Wind size={13} />
            <span style={{ fontWeight: 600 }}>{data.wind_speed_10m} km/j</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#888", fontSize: "12px" }}>
            <Droplets size={13} />
            <span style={{ fontWeight: 600 }}>{data.relative_humidity_2m}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
