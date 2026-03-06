
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { runARCAgent } from './src/arc-agent';
import { PDRLogger } from './src/pdr/pdr-debug';

const App = () => {
  const [arcLogs, setArcLogs] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const arcLogScrollRef = useRef<HTMLDivElement>(null);

  const handleRunARC = async () => {
      if (isRunning) return;
      
      setIsRunning(true);
      setArcLogs("Initializing Local Reasoning Engine...\n");
      
      const logListener = (msg: string) => {
          setArcLogs(prev => prev + msg + "\n");
      };
      
      PDRLogger.addListener(logListener);
      
      try {
          await runARCAgent();
      } catch (err) {
          setArcLogs(prev => prev + `\n❌ CRITICAL ERROR: ${err}\n`);
      } finally {
          PDRLogger.removeListener(logListener);
          setIsRunning(false);
      }
  };

  useEffect(() => {
    if (arcLogScrollRef.current) {
        arcLogScrollRef.current.scrollTop = arcLogScrollRef.current.scrollHeight;
    }
  }, [arcLogs]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#020617] p-4 md:p-8">
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
              </div>
              <div>
                  <h1 className="text-xl font-bold tracking-tight glow-text uppercase text-emerald-400">Sentinel ARC Engine</h1>
                  <p className="text-[10px] text-slate-500 mono uppercase tracking-widest">Local Reasoning Core v5.0 // No External AI</p>
              </div>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs mono uppercase tracking-widest text-emerald-500">Local Mode</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col glass rounded-2xl shadow-2xl relative border-slate-800">
        <div className="flex-1 overflow-y-auto bg-[#0a0f1e] p-4 scroll-hide" ref={arcLogScrollRef}>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <div>
                        <h2 className="text-lg font-bold text-emerald-400 glow-text">ARC AGENT CONTROL</h2>
                        <p className="text-xs text-slate-500 mono">Deterministic Logic Chain (PDR + Geometry + Physics)</p>
                    </div>
                    <button 
                        onClick={handleRunARC}
                        disabled={isRunning}
                        className={`${isRunning ? 'bg-slate-700 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'} text-white px-6 py-2 rounded-lg font-bold shadow-lg active:scale-95 transition-all mono text-xs tracking-widest`}
                    >
                        {isRunning ? 'RUNNING...' : 'RUN AGENT'}
                    </button>
                </div>

                {/* LOGS OUTPUT */}
                <div className="bg-black/50 border border-slate-800 rounded-xl p-4 font-mono text-[10px] text-slate-400 whitespace-pre-wrap overflow-x-auto min-h-[400px]">
                    {arcLogs || "Ready to initialize local reasoning core..."}
                </div>
            </div>
        </div>
      </main>

      <footer className="mt-4 flex justify-between items-center text-[10px] text-slate-600 mono uppercase tracking-widest px-2">
        <div>Sentinel ARC Engine // OFFLINE MODE</div>
        <div className="hidden md:block">ARC REASONING ENGINE</div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
