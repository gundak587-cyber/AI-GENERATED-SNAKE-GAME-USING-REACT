import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Cpu, HardDrive } from 'lucide-react';

export default function App() {
  return (
    <div id="app-root" className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 screen-tear select-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMzAwMDUiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSI0IiBmaWxsPSIjMGEwYTBhIi8+PC9zdmc+')]">
      {/* Glitch overlays */}
      <div className="noise-overlay" />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-4 flex items-center justify-between z-20 border-b-2 border-magenta bg-void shadow-[0_4px_0_cyan]">
        <div className="flex items-center space-x-4">
          <div className="p-2 border-2 border-cyan bg-magenta text-void">
            <Terminal size={24} />
          </div>
          <h1 className="text-3xl font-mono tracking-tighter glitch" data-text="ERR:ENTITY_NOT_FOUND">
            ERR:ENTITY_NOT_FOUND
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-cyan text-sm tracking-[0.3em] font-mono border-2 border-magenta p-2 bg-void">
          <div className="flex items-center space-x-2">
            <Cpu size={14} className="animate-pulse text-magenta" />
            <span className="glitch" data-text="SYS_STATUS: CORRUPTED">SYS_STATUS: CORRUPTED</span>
          </div>
          <div className="flex items-center space-x-2 text-magenta">
            <HardDrive size={14} className="animate-bounce" />
            <span>DATA::OVERFLOW</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-16 mt-16 px-4">
        
        {/* Game Window */}
        <section id="game-window" className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 relative">
          <div className="absolute left-[-180px] top-1/2 -translate-y-1/2 hidden xl:block">
            <span className="text-2xl font-mono text-magenta uppercase tracking-[0.5em]" style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}>
              &gt;_EXECUTE.BIN
            </span>
          </div>

          <div className="brutal-border bg-void p-2">
            <div className="border border-magenta border-dashed p-4">
              <SnakeGame />
            </div>
          </div>
        </section>

        {/* Media Sidebar */}
        <section id="media-window" className="flex flex-col items-center w-full lg:w-auto">
          <div className="brutal-border-magenta bg-void p-2">
            <MusicPlayer />
          </div>
          
          {/* Quick HUD for Mobile/Desktop */}
          <div className="mt-8 grid grid-cols-2 gap-4 w-full">
            <div className="border-2 border-cyan bg-magenta text-void p-4 flex flex-col items-center justify-center space-y-1 transform -skew-x-12 hover:skew-x-12 transition-transform">
              <span className="text-xs uppercase font-mono tracking-widest font-black">MEM_ADDR</span>
              <span className="text-xl font-bold font-mono">0xFA7</span>
            </div>
            <div className="border-2 border-magenta p-4 flex flex-col items-center justify-center space-y-1 text-cyan transform skew-x-12 hover:-skew-x-12 transition-transform">
              <span className="text-xs uppercase font-mono tracking-widest">IRQ_LEVEL</span>
              <span className="text-xl font-mono glitch" data-text="FATAL">FATAL</span>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
