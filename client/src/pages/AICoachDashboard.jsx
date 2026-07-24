import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
    FiCpu, FiZap, FiShield, FiTrendingUp, 
    FiAlertCircle, FiCheckCircle, FiMessageSquare, FiSliders, FiActivity 
} from 'react-icons/fi';
import BackButton from '../components/ui/BackButton';

export default function AICoachDashboard() {
    const { user } = useContext(AuthContext);
    const [persona, setPersona] = useState('strict_commander'); // 'strict_commander' | 'mentor' | 'friend' | 'minimal'
    const [promptInput, setPromptInput] = useState('');
    const [chatLogs, setChatLogs] = useState([
        { role: 'ai', text: 'WARRIOR ATTENTION. You have 3 P1 daily tasks scheduled today. Current streak is 12 days. No missed deadlines allowed.' }
    ]);

    const handleSendPrompt = (e) => {
        e.preventDefault();
        if (!promptInput.trim()) return;

        const newLogs = [
            ...chatLogs,
            { role: 'user', text: promptInput },
            { role: 'ai', text: `[${persona.toUpperCase()} MODE]: Task priority logged. RAG vector context updated in Supabase pgvector namespace.` }
        ];
        setChatLogs(newLogs);
        setPromptInput('');
    };

    return (
        <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 md:p-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="ambient-glow top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/15"></div>
            <div className="ambient-glow bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10"></div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <BackButton />

                {/* Page Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
                            <FiCpu /> AI Coach & Growth Intelligence Platform
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                            <FiZap className="text-cyan-400" /> AI Growth Intelligence Coach
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Personal Growth Intelligence observing compliance, predicting burnout, and optimizing discipline.
                        </p>
                    </div>

                    <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border border-cyan-500/30">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                        <span className="text-xs font-mono font-bold text-cyan-400">GPT-4o RAG PIPELINE ACTIVE</span>
                    </div>
                </header>

                {/* ROW 1: MORNING BRIEFING & PERSONA SELECTOR */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Morning AI Briefing */}
                    <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">DAILY AI MORNING BRIEFING (07:00 AM)</span>
                                <span className="text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full font-bold">
                                    DISCIPLINE BRS: 0.12 (LOW RISK)
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">Today's Focus: Execution Velocity</h3>
                            <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                Good morning, <strong>{user?.username}</strong>. You have 3 P1 tasks queued. Your 12-day streak is active. 
                                Target completion window is before 11:30 AM for maximum cognitive efficiency.
                            </p>

                            <div className="space-y-2 text-xs text-slate-300">
                                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2 font-mono">
                                    <FiCheckCircle className="text-cyan-400" />
                                    <span>P1 Task: Complete Async Rust Tokio Engine code diff submission</span>
                                </div>
                                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2 font-mono">
                                    <FiCheckCircle className="text-indigo-400" />
                                    <span>P1 Task: Iron Forge Heavy Squats Split workout session</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Persona Selector */}
                    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-bold mb-3">
                                <FiSliders /> COACH PERSONALITY MODE
                            </div>
                            <h4 className="font-bold text-sm text-white mb-3">Select Active Persona</h4>

                            <div className="space-y-2">
                                {[
                                    { id: 'strict_commander', name: 'Strict Commander', desc: 'Zero fluff, intense discipline' },
                                    { id: 'mentor', name: 'Executive Mentor', desc: 'Strategic & constructive guidance' },
                                    { id: 'friend', name: 'Supportive Partner', desc: 'Empathetic & encouraging reminders' },
                                    { id: 'minimal', name: 'Minimal Mode', desc: 'Strict 1-line takeaways' }
                                ].map(p => (
                                    <button 
                                        key={p.id}
                                        onClick={() => setPersona(p.id)}
                                        className={`w-full p-3 rounded-xl border text-left transition-all ${persona === p.id ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-md' : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'}`}
                                    >
                                        <div className="font-bold text-xs">{p.name}</div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">{p.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROW 2: AI CONVERSATION INTERACTION */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FiMessageSquare className="text-cyan-400" /> Interactive Intelligence Console
                    </h3>

                    <div className="min-h-[220px] max-h-[300px] overflow-y-auto space-y-3 p-4 rounded-xl bg-slate-950/80 border border-slate-900 font-mono text-xs mb-4">
                        {chatLogs.map((msg, idx) => (
                            <div key={idx} className={`p-3 rounded-xl ${msg.role === 'ai' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300' : 'bg-white/5 border border-white/10 text-slate-200 ml-8'}`}>
                                <strong className="text-[10px] text-slate-500 block mb-1 uppercase">{msg.role === 'ai' ? `AI COACH (${persona.toUpperCase()})` : 'YOU'}</strong>
                                <div>{msg.text}</div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendPrompt} className="flex gap-3">
                        <input 
                            type="text"
                            placeholder="Ask AI Coach for goal optimization, recovery advice, or revision strategies..."
                            value={promptInput}
                            onChange={(e) => setPromptInput(e.target.value)}
                            className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 transition-all"
                        />
                        <button type="submit" className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-600/30">
                            Send Query
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
