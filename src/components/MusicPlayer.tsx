import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Disc3 } from 'lucide-react';
import { Track } from '../types';
import { DUMMY_TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div id="music-player" className="p-6 w-full max-w-sm border-2 border-cyan/30 flex flex-col font-mono text-cyan bg-[var(--color-void)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
      />
      
      <div className="text-xs uppercase tracking-[0.2em] mb-4 border-b-2 border-magenta pb-2 flex items-center justify-between font-bold">
        <span>AUDIO_STREAM_CTRL</span>
        <span className={isPlaying ? "animate-pulse text-magenta" : "opacity-30"}>
          {isPlaying ? "[_ACTIVE_]" : "[_IDLE_]"}
        </span>
      </div>

      <div className="flex flex-col items-center space-y-6 relative">
        
        {/* Album Art replacement - Glitch block */}
        <div className="relative w-full h-40 border-4 border-cyan bg-magenta overflow-hidden group shadow-[4px_4px_0_#ff00ff]">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-full h-full object-cover mix-blend-luminosity filter contrast-150 grayscale"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
             <div className="absolute inset-0 bg-cyan opacity-[0.15] mix-blend-difference animate-pulse pointer-events-none" />
          )}
          <div className="absolute top-2 right-2 bg-[var(--color-void)] p-1 border-2 border-cyan">
             <Disc3 className={isPlaying ? "animate-[spin_3s_linear_infinite] text-magenta" : ""} size={20} />
          </div>
          
          <div className="absolute bottom-0 left-0 w-full bg-[var(--color-void)] border-t-2 border-magenta p-1 text-xs truncate tracking-widest font-bold">
            FILE_ID: 0x{currentTrack.id}B{currentTrack.id}
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center w-full border-2 border-cyan p-2 bg-cyan/10">
          <h2 className="text-3xl font-bold glitch uppercase select-all font-mono" data-text={currentTrack.title}>{currentTrack.title}</h2>
          <p className="text-magenta text-sm bg-[var(--color-void)] inline-block px-2 mt-2 border-2 border-magenta font-black">@{currentTrack.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6 w-full justify-center border-y-2 border-magenta py-4 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,255,255,0.05)_10px,rgba(0,255,255,0.05)_20px)]">
          <button 
            onClick={prevTrack}
            className="bg-[var(--color-void)] border-2 border-cyan p-2 hover:bg-cyan hover:text-[var(--color-void)] active:translate-y-1 transition-all"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="bg-magenta text-[var(--color-void)] border-2 border-cyan p-4 shadow-[4px_4px_0_#00ffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#00ffff] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
          >
            {isPlaying ? (
              <Pause size={28} fill="currentColor" />
            ) : (
              <Play size={28} fill="currentColor" className="ml-1" />
            )}
          </button>

          <button 
            onClick={nextTrack}
            className="bg-[var(--color-void)] border-2 border-cyan p-2 hover:bg-cyan hover:text-[var(--color-void)] active:translate-y-1 transition-all"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex flex-col space-y-2 w-full text-xs box-border font-bold">
          <div className="flex justify-between w-full text-magenta">
            <span>VOL_LVL</span>
            <span>{Math.floor(volume * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-4 bg-[var(--color-void)] border-2 border-cyan appearance-none cursor-pointer rounded-none"
            style={{
               background: `linear-gradient(to right, #00ffff ${(volume * 100)}%, transparent ${(volume * 100)}%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
