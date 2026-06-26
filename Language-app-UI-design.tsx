import React from "react";

export default function LingoDesktop() {
  const nodes = [
    { id: 1, label: "Greetings", status: "done" },
    { id: 2, label: "Basics 1", status: "done" },
    { id: 3, label: "Ordering Food", status: "current" },
    { id: 4, label: "Travel", status: "locked" },
    { id: 5, label: "Directions", status: "locked" },
    { id: 6, label: "Past Tense", status: "locked" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1C1C1E] font-[-apple-system,BlinkMacSystemFont,'SF Pro Display',Inter,system-ui]">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 h-[72px] border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1280px] h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#58CC02] grid place-items-center text-white font-bold">L</div>
            <span className="text-[20px] font-semibold tracking-tight">lingo</span>
          </div>

          {/* Pill Menu */}
          <nav className="h-11 p-1 rounded-full bg-[#F5F5F7] flex items-center gap-1">
            {["Learn","Practice","Stories","Shop"].map((item, i) => (
              <button key={item} className={`h-9 px-5 rounded-full text-[15px] font-medium transition ${i===0? "bg-white shadow-sm text-[#1C1C1E]" : "text-[#6E6E73] hover:text-[#1C1C1E]"}`}>
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-4 text-[15px]">
              <span className="flex items-center gap-1.5"><span>🔥</span><b>12</b></span>
              <span className="flex items-center gap-1.5"><span>❤️</span><b>5</b></span>
              <span className="flex items-center gap-1.5"><span>💎</span><b>342</b></span>
            </div>
            <img src="https://i.pravatar.cc/32" className="w-8 h-8 rounded-full" alt="" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-8 py-8 grid grid-cols-[280px_1fr_300px] gap-8">
        {/* Left */}
        <aside className="space-y-6">
          <div className="rounded-[24px] bg-[#F5F5F7] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇪🇸</span>
                <div>
                  <p className="text-[13px] text-[#6E6E73] uppercase tracking-wide font-medium">Course</p>
                  <p className="font-semibold -mt-0.5">Spanish</p>
                </div>
              </div>
              <button className="text-[#007AFF] text-[14px] font-medium">Change</button>
            </div>
            <div className="mt-6 grid place-items-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90"><circle cx="64" cy="64" r="56" stroke="#E5E5EA" strokeWidth="12" fill="none"/><circle cx="64" cy="64" r="56" stroke="#58CC02" strokeWidth="12" fill="none" strokeDasharray="351" strokeDashoffset="112" strokeLinecap="round"/></svg>
                <div className="absolute inset-0 grid place-items-center"><span className="text-[28px] font-bold">68%</span></div>
              </div>
              <p className="mt-3 text-[14px] text-[#6E6E73]">Unit 3 of 12</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-black/5 p-6">
            <h3 className="font-semibold mb-3">Weekly Goal</h3>
            <div className="h-2 rounded-full bg-[#F5F5F7] overflow-hidden"><div className="h-full w-[70%] bg-[#007AFF] rounded-full"/></div>
            <p className="mt-2 text-[13px] text-[#6E6E73]">35 / 50 XP</p>
          </div>
        </aside>

        {/* Center */}
        <section>
          <div className="rounded-[24px] p-8 text-white bg-gradient-to-br from-[#58CC02] to-[#46A302] shadow-[0_12px_32px_rgba(88,204,2,0.25)]">
            <p className="text-[13px] font-medium uppercase tracking-wider opacity-90">Continue where you left</p>
            <h1 className="mt-1 text-[32px] font-bold leading-tight">Basics 2: Ordering Food</h1>
            <div className="mt-5 flex items-center gap-4">
              <button className="h-12 px-7 rounded-[14px] bg-white text-[#2E7D00] font-semibold text-[16px] hover:scale-[1.02] active:scale-[0.98] transition">Continue Lesson</button>
              <div className="flex-1 h-2 rounded-full bg-white/25 overflow-hidden max-w-[320px]"><div className="h-full w-[68%] bg-white rounded-full"/></div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-[22px] font-bold mb-6">Your path</h2>
            <div className="relative">
              <div className="absolute top-[44px] left-0 right-0 h-[4px] bg-[#E5E5EA] rounded-full" />
              <div className="relative flex justify-between">
                {nodes.map(n => (
                  <div key={n.id} className="flex flex-col items-center w-[88px]">
                    <div className={`
                      w-[88px] h-[88px] rounded-full grid place-items-center
                      shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition hover:scale-[1.02]
                      ${n.status==="done"?"bg-[#58CC02] text-white":""}
                      ${n.status==="current"?"bg-white ring-[5px] ring-[#007AFF]/20 border-[3px] border-[#007AFF]":""}
                      ${n.status==="locked"?"bg-[#F5F5F7] text-[#A1A1A6]":""}
                    `}>
                      {n.status==="done"? "✓" : n.status==="current"? "▶" : "🔒"}
                    </div>
                    <span className={`mt-3 text-[14px] text-center ${n.status==="current"?"font-semibold":"text-[#6E6E73]"}`}>{n.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right */}
        <aside className="space-y-6">
          <div className="rounded-[24px] border border-black/5 p-6">
            <h3 className="font-semibold mb-4">Daily Quests</h3>
            <div className="space-y-3">
              {[{t:"Earn 20 XP",p:75},{t:"2 Perfect lessons",p:50},{t:"15 min practice",p:30}].map(q=>(
                <div key={q.t}>
                  <div className="flex justify-between text-[14px] mb-1.5"><span>{q.t}</span><span className="text-[#6E6E73]">{q.p}%</span></div>
                  <div className="h-1.5 rounded-full bg-[#F5F5F7]"><div className="h-full bg-[#007AFF] rounded-full" style={{width:`${q.p}%`}}/></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] bg-[#F5F5F7] p-6">
            <h3 className="font-semibold mb-3">Leaderboard</h3>
            <ol className="space-y-2.5 text-[14px]">
              <li className="flex justify-between"><span>1. Maya</span><b>1,240 XP</b></li>
              <li className="flex justify-between"><span>2. You</span><b>1,102 XP</b></li>
              <li className="flex justify-between text-[#6E6E73]"><span>3. Alex</span><span>980 XP</span></li>
            </ol>
          </div>
        </aside>
      </main>
    </div>
  );
}