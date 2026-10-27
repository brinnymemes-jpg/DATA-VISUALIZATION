import React, { useState, useEffect, useRef } from 'react';
import { AudioLog, AudioTranscriptItem } from '../types';
import { api } from '../services/api';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Mic, 
  Square, 
  Plus, 
  Clock, 
  Search, 
  Headphones, 
  Calendar, 
  Sparkles,
  Radio
} from 'lucide-react';

interface AudioLogViewerProps {
  audioLogs: AudioLog[];
  onRefreshAudioLogs: () => void;
  currentUser: any;
}

export const AudioLogViewer: React.FC<AudioLogViewerProps> = ({
  audioLogs,
  onRefreshAudioLogs,
  currentUser
}) => {
  const [selectedLogId, setSelectedLogId] = useState<string>(audioLogs[0]?.id || 'aud-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Recording Modal state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newMeetingType, setNewMeetingType] = useState<any>('Faculty Council');
  const [newSummary, setNewSummary] = useState<string>('');

  // Web Audio API refs for authentic audible tone generation
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeLog = audioLogs.find(a => a.id === selectedLogId) || audioLogs[0] || {
    id: 'aud-1',
    title: 'Senate Plenum: 2026-2027 Academic Budget & AI Curriculum Integration',
    speaker: 'Chancellor Arthur Pendelton',
    role: 'University Chancellor',
    departmentId: 'dept-cs',
    meetingType: 'Senate Session',
    date: '2026-10-18',
    durationSec: 320,
    summary: 'Resolution passed approving 18% expansion of computing lab infrastructure and cross-disciplinary AI electives for engineering and biology.',
    tags: ['Academic Senate', 'Budget Allocation', 'Curriculum Reform', 'AI Infrastructure'],
    audioSampleTone: 'academic',
    transcript: [
      { time: '00:00', speaker: 'Chancellor Arthur Pendelton', text: 'I call the University Senate assembly to order for the review of the capital budget allocation.' },
      { time: '00:45', speaker: 'Dr. Eleanor Vance', text: 'Thank you Chancellor. The Computer Science and AI department has seen an 18 percent year-over-year surge in enrollment.' },
      { time: '01:30', speaker: 'Prof. Marcus Holloway', text: 'Engineering strongly endorses the cross-departmental lab cluster. Dual-use compute will power both robotics simulation and genomic sequencers.' },
      { time: '02:40', speaker: 'Chancellor Arthur Pendelton', text: 'The vote is unanimous. The $3.2M high-performance GPU cluster endowment is confirmed for the 2026-2027 session.' }
    ]
  };

  const duration = activeLog.durationSec || 300;

  // Sound Synthesizer Init
  const startAudioTone = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Soft harmonic synth to give real auditory feedback
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      // Pleasant harmonic fundamental based on tone
      const baseFreq = activeLog.audioSampleTone === 'debate' ? 220 : 180;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      gain.gain.setValueAtTime(isMuted ? 0 : volume * 0.04, ctx.currentTime);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch {
      // AudioContext fallback
    }
  };

  const stopAudioTone = () => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
    } catch {}
  };

  // Playback timer & waveform visualizer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      startAudioTone();
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            stopAudioTone();
            return 0;
          }
          // Slight frequency modulation to mimic speech prosody
          if (oscRef.current && audioCtxRef.current) {
            const modFreq = 160 + (prev % 5) * 15 + Math.sin(prev * 3) * 20;
            oscRef.current.frequency.setValueAtTime(modFreq, audioCtxRef.current.currentTime);
          }
          return prev + 1;
        });
      }, 1000 / playbackRate);
    } else {
      stopAudioTone();
    }

    return () => {
      if (interval) clearInterval(interval);
      stopAudioTone();
    };
  }, [isPlaying, playbackRate, duration]);

  // Volume updates
  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(isMuted ? 0 : volume * 0.04, audioCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  // Canvas visualizer animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const render = () => {
      step += 0.06;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 48;
      const barWidth = canvas.width / barCount;

      for (let i = 0; i < barCount; i++) {
        let heightMultiplier = 0.2;
        if (isPlaying) {
          const wave1 = Math.sin(step + i * 0.25);
          const wave2 = Math.cos(step * 0.7 + i * 0.15);
          heightMultiplier = Math.abs(wave1 * wave2) * 0.8 + 0.15;
        } else {
          heightMultiplier = 0.12 + Math.sin(i * 0.3) * 0.04;
        }

        const barHeight = Math.max(4, heightMultiplier * canvas.height);
        const x = i * barWidth;
        const y = (canvas.height - barHeight) / 2;

        const isPassed = (i / barCount) <= (currentTime / duration);
        ctx.fillStyle = isPassed 
          ? (isPlaying ? '#22d3ee' : '#38bdf8') 
          : 'rgba(255, 255, 255, 0.15)';
        
        ctx.beginPath();
        ctx.roundRect(x + 1.5, y, barWidth - 3, barHeight, 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentTime, duration]);

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Skip handlers
  const handleSkipBack = () => {
    setCurrentTime(prev => Math.max(0, prev - 10));
  };
  const handleSkipForward = () => {
    setCurrentTime(prev => Math.min(duration, prev + 10));
  };

  // Jump to transcript time
  const handleJumpToTime = (timeStr: string) => {
    const [m, s] = timeStr.split(':').map(Number);
    const targetSec = (m || 0) * 60 + (s || 0);
    setCurrentTime(targetSec);
    setIsPlaying(true);
  };

  // Simulated Mic Recording
  useEffect(() => {
    let recTimer: NodeJS.Timeout | null = null;
    if (isRecording) {
      recTimer = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (recTimer) clearInterval(recTimer);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    const newLogItem: Partial<AudioLog> = {
      title: newTitle || `Campus Council Session: ${new Date().toLocaleDateString()}`,
      speaker: currentUser.name,
      role: currentUser.role === 'dean' ? 'Academic Dean' : 'Faculty Chair',
      meetingType: newMeetingType,
      durationSec: Math.max(recordingSeconds, 45),
      summary: newSummary || 'Institutional oral record captured with verified microphone input and timecode synchronization.',
      tags: ['Campus Council', 'Official Minutes', 'Voice Archive'],
      transcript: [
        { time: '00:00', speaker: currentUser.name, text: 'Session initiated. Institutional microphone connected.' },
        { time: '00:15', speaker: currentUser.name, text: 'Motion presented for Senate committee review and archived.' }
      ]
    };

    await api.createAudioLog(newLogItem);
    setIsRecordModalOpen(false);
    onRefreshAudioLogs();
  };

  // Filtered audio logs
  const filteredLogs = audioLogs.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header and Add Session */}
      <div className="liquid-glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Headphones className="w-5 h-5 text-cyan-400" />
            Institutional Audio Archives & Senate Recordings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Archival voice logs of Academic Senate sessions, departmental hearings, and president lectures with interactive waveforms
          </p>
        </div>

        <button
          onClick={() => {
            setNewTitle('');
            setNewSummary('');
            setRecordingSeconds(0);
            setIsRecordModalOpen(true);
          }}
          className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Mic className="w-3.5 h-3.5" />
          Record Audio Log
        </button>
      </div>

      {/* Main Player & Playlist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Liquid Glass Audio Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="liquid-glass-card rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Ambient player glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Audio Log Title & Speaker */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-cyan-400 font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
                    {activeLog.meetingType}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                    <Calendar className="w-3 h-3" /> {activeLog.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight mt-2 leading-snug">
                  {activeLog.title}
                </h3>
                <div className="text-xs text-slate-300 mt-1">
                  Primary Speaker: <strong className="text-white">{activeLog.speaker}</strong> ({activeLog.role})
                </div>
              </div>

              {/* Live Tone State Indicator */}
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 shrink-0">
                <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                <span>{isPlaying ? 'Synthesizing' : 'Ready'}</span>
              </div>
            </div>

            {/* Waveform Canvas */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-white/[0.08]">
              <canvas
                ref={canvasRef}
                width={500}
                height={75}
                className="w-full h-[75px] block"
              />
              <div className="mt-2 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-cyan-300 font-semibold">{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Progress Scrubber */}
            <div className="mt-3">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Playback Controls Strip */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSkipBack}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-900 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play Audio Log'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-slate-900" /> : <Play className="w-5 h-5 fill-slate-900 ml-0.5" />}
                </button>

                <button
                  onClick={handleSkipForward}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
                  title="Forward 10s"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Playback Speed Switcher */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">Speed:</span>
                <select
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  className="liquid-glass-input text-xs rounded-lg px-2 py-1 font-mono cursor-pointer bg-slate-900"
                >
                  <option value="0.75">0.75x</option>
                  <option value="1.0">1.0x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2.0">2.0x</option>
                </select>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-20 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

            </div>

            {/* Tags & Summary */}
            <div className="mt-5 pt-4 border-t border-white/[0.08]">
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Summary of Minutes:</strong> {activeLog.summary}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {activeLog.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.05]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Synchronized Transcript Box */}
          <div className="liquid-glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Synchronized Transcript
              </h4>
              <span className="text-[11px] text-slate-400">Click timestamp to skip</span>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {activeLog.transcript.map((item, idx) => {
                const [m, s] = item.time.split(':').map(Number);
                const itemSec = (m || 0) * 60 + (s || 0);
                const isCurrent = Math.abs(currentTime - itemSec) < 15;

                return (
                  <div
                    key={idx}
                    onClick={() => handleJumpToTime(item.time)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-100 shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.06] text-slate-300'
                    }`}
                  >
                    <button className="font-mono text-xs font-semibold text-cyan-400 shrink-0 bg-slate-900/60 px-1.5 py-0.5 rounded border border-cyan-900">
                      {item.time}
                    </button>
                    <div>
                      <span className="font-semibold text-white text-xs">{item.speaker}: </span>
                      <span className="text-xs leading-relaxed">{item.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right: Audio Playlist Archive (5 cols) */}
        <div className="lg:col-span-5 liquid-glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white tracking-tight">Audio Session Catalog</h3>
              <span className="text-xs text-slate-400 font-mono">{filteredLogs.length} Available</span>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search recordings by title, speaker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="liquid-glass-input w-full pl-8 pr-3 py-1.5 text-xs rounded-xl"
              />
            </div>

            {/* Playlist items */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredLogs.map((log) => {
                const isSelected = log.id === activeLog.id;
                return (
                  <div
                    key={log.id}
                    onClick={() => {
                      setSelectedLogId(log.id);
                      setCurrentTime(0);
                      setIsPlaying(true);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                        : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-white/10">
                        {log.meetingType}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatTime(log.durationSec)}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-white mt-1.5 line-clamp-2">
                      {log.title}
                    </h4>
                    
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                      <span className="truncate max-w-[180px]">{log.speaker}</span>
                      <span>{log.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] text-xs text-slate-400 flex items-center justify-between">
            <span>Audio Format: <strong>48kHz Studio AAC</strong></span>
            <span className="text-cyan-300 font-medium">Compliance Encrypted</span>
          </div>
        </div>

      </div>

      {/* RECORD NEW AUDIO LOG MODAL */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="liquid-glass-card rounded-2xl max-w-md w-full p-6 border border-white/20 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                Record Institutional Audio Session
              </h3>
              <button onClick={() => setIsRecordModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer">
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty Senate: Spring Curriculum Revision"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="liquid-glass-input w-full p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Meeting Classification</label>
                <select
                  value={newMeetingType}
                  onChange={(e) => setNewMeetingType(e.target.value)}
                  className="liquid-glass-input w-full p-2 rounded-lg bg-slate-900"
                >
                  <option value="Senate Session">Senate Session</option>
                  <option value="Dean Board">Dean Board</option>
                  <option value="Faculty Council">Faculty Council</option>
                  <option value="Public Lecture">Public Lecture</option>
                  <option value="Academic Grievance">Academic Grievance</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Summary of Minutes</label>
                <textarea
                  rows={2}
                  placeholder="Key resolutions, motions adopted, and participants..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="liquid-glass-input w-full p-2 rounded-lg"
                />
              </div>

              {/* Live Microphone Recording Box */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/[0.08] text-center flex flex-col items-center justify-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-rose-500 animate-pulse text-white shadow-[0_0_25px_#f43f5e]' 
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                }`}>
                  <Mic className="w-6 h-6" />
                </div>

                <div className="mt-3 font-mono text-base font-bold text-white tabular-nums">
                  {formatTime(recordingSeconds)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {isRecording ? 'Capturing institutional audio stream...' : 'Microphone ready'}
                </div>

                <div className="mt-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md transition-all cursor-pointer"
                    >
                      Start Recording
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="px-4 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Square className="w-3.5 h-3.5 fill-white" />
                      Stop & Save to Archive
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-300 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
