import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
    FiCalendar, FiClock, FiPlay, FiPause, FiRefreshCw, 
    FiCheckCircle, FiZap, FiVolume2, FiPlus, FiGrid, FiList, FiTrendingUp,
    FiEdit3, FiTrash2, FiXCircle, FiCheck, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import dayjs from 'dayjs';
import BackButton from '../components/ui/BackButton';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_BLOCKS = [
    { id: '1', title: 'SYS.DEV: Async Rust Tokio Engine', type: 'deep_work', time: '08:00 - 09:30 AM', day: 'Monday', category: 'Coding', completed: true, color: 'bg-indigo-600/30 border-indigo-500/50' },
    { id: '2', title: 'Iron Forge: Heavy Squats & Calves Split', type: 'workout', time: '10:00 - 11:15 AM', day: 'Tuesday', category: 'Fitness', completed: true, color: 'bg-rose-600/30 border-rose-500/50' },
    { id: '3', title: 'Academic Revision: Discrete Mathematics', type: 'study', time: '01:00 - 02:30 PM', day: 'Wednesday', category: 'Exam Prep', completed: false, color: 'bg-cyan-600/30 border-cyan-500/50' },
    { id: '4', title: 'Second Brain Note Synthesis', type: 'reading', time: '03:30 - 04:30 PM', day: 'Thursday', category: 'Knowledge', completed: false, color: 'bg-purple-600/30 border-purple-500/50' },
    { id: '5', title: 'Evening Reflection & AI Recovery Briefing', type: 'recovery', time: '08:00 - 08:30 PM', day: 'Friday', category: 'Mindset', completed: false, color: 'bg-emerald-600/30 border-emerald-500/50' }
];

const CATEGORY_COLORS = {
    'Coding': 'bg-indigo-600/30 border-indigo-500/50',
    'Fitness': 'bg-rose-600/30 border-rose-500/50',
    'Exam Prep': 'bg-cyan-600/30 border-cyan-500/50',
    'Knowledge': 'bg-purple-600/30 border-purple-500/50',
    'Mindset': 'bg-emerald-600/30 border-emerald-500/50',
    'General': 'bg-slate-700/30 border-slate-600/50'
};

export default function CalendarDashboard() {
    const { user } = useContext(AuthContext);
    const [viewMode, setViewMode] = useState('day'); // 'day' | 'week'
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [timerSeconds, setTimerSeconds] = useState(1500); // 25 min pomodoro
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const currentDayName = dayjs().format('dddd'); // e.g. "Monday"

    // Initial time blocks from localStorage or default
    const [timeBlocks, setTimeBlocks] = useState(() => {
        try {
            const saved = localStorage.getItem('lifeos_time_blocks');
            return saved ? JSON.parse(saved) : DEFAULT_BLOCKS;
        } catch {
            return DEFAULT_BLOCKS;
        }
    });

    // Modal state for Add/Edit
    const [showModal, setShowModal] = useState(false);
    const [editingBlockId, setEditingBlockId] = useState(null);
    const [blockForm, setBlockForm] = useState({
        title: '',
        time: '',
        day: currentDayName,
        category: 'Coding',
        type: 'deep_work'
    });

    // Save blocks to localStorage whenever updated
    useEffect(() => {
        try {
            localStorage.setItem('lifeos_time_blocks', JSON.stringify(timeBlocks));
        } catch (e) {
            console.error('Failed to save time blocks to localStorage', e);
        }
    }, [timeBlocks]);

    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timerSeconds > 0) {
            interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
        } else if (timerSeconds === 0) {
            setIsTimerRunning(false);
            alert('Focus Session Completed! Take a 5-minute break.');
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerSeconds]);

    const formatTimer = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTaskComplete = (id) => {
        setTimeBlocks(prev => prev.map(b => b.id === id ? { ...b, completed: !b.completed } : b));
    };

    const handleOpenAddModal = (targetDay = null) => {
        setEditingBlockId(null);
        setBlockForm({
            title: '',
            time: '09:00 - 10:00 AM',
            day: targetDay || currentDayName,
            category: 'Coding',
            type: 'deep_work'
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (block, e) => {
        if (e) e.stopPropagation();
        setEditingBlockId(block.id);
        setBlockForm({
            title: block.title,
            time: block.time,
            day: block.day || currentDayName,
            category: block.category || 'Coding',
            type: block.type || 'deep_work'
        });
        setShowModal(true);
    };

    const handleDeleteBlock = (id, e) => {
        if (e) e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this scheduled time block?')) {
            setTimeBlocks(prev => prev.filter(b => b.id !== id));
        }
    };

    const handleSaveBlock = (e) => {
        e.preventDefault();
        if (!blockForm.title.trim()) {
            alert('Please enter a block title.');
            return;
        }

        const color = CATEGORY_COLORS[blockForm.category] || 'bg-indigo-600/30 border-indigo-500/50';

        if (editingBlockId) {
            // Update existing
            setTimeBlocks(prev => prev.map(b => b.id === editingBlockId ? {
                ...b,
                title: blockForm.title.trim(),
                time: blockForm.time.trim(),
                day: blockForm.day,
                category: blockForm.category,
                type: blockForm.type,
                color
            } : b));
        } else {
            // Add new
            const newBlock = {
                id: Date.now().toString(),
                title: blockForm.title.trim(),
                time: blockForm.time.trim() || '10:00 - 11:00 AM',
                day: blockForm.day || currentDayName,
                category: blockForm.category,
                type: blockForm.type,
                completed: false,
                color
            };
            setTimeBlocks(prev => [...prev, newBlock]);
        }

        setShowModal(false);
    };

    // Filter blocks for Day View (either explicitly matching current day or general)
    const dayBlocks = timeBlocks.filter(b => !b.day || b.day === currentDayName || b.day === 'Today');

    return (
        <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 md:p-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="ambient-glow top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15"></div>
            <div className="ambient-glow bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10"></div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <BackButton />

                {/* Page Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">
                            <FiClock /> Deep Work Execution & Time Blocking Engine
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                            <FiCalendar className="text-indigo-400" /> Time Blocking & Focus Engine
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Cal Newport Deep Work framework converting daily goals into 15m time blocks.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => handleOpenAddModal()}
                            className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 text-xs transition-all"
                        >
                            <FiPlus /> Add Time Block
                        </button>
                        <button 
                            onClick={() => { setSelectedBlock(null); setIsTimerRunning(true); }}
                            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-2 text-xs transition-all"
                        >
                            <FiPlay /> Deep Work Timer
                        </button>
                    </div>
                </header>

                {/* ROW 1: CHRONOTYPE ENERGY & DEEP WORK TIMER WIDGET */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Focus Session Widget */}
                    <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col justify-between items-center text-center">
                        <div className="w-full flex justify-between items-center text-xs font-mono text-indigo-400 font-bold mb-2">
                            <span>FOCUS TIMER</span>
                            <span>POMODORO 25M</span>
                        </div>

                        <div className="my-4 relative flex items-center justify-center">
                            <div className="w-40 h-40 rounded-full border-8 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                                <div>
                                    <div className="text-4xl font-black font-mono text-white tracking-wider">{formatTimer(timerSeconds)}</div>
                                    <div className="text-[10px] font-mono text-slate-400 uppercase mt-1">DEEP WORK FOCUS</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full justify-center">
                            <button 
                                onClick={() => setIsTimerRunning(!isTimerRunning)} 
                                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30"
                            >
                                {isTimerRunning ? <><FiPause /> Pause</> : <><FiPlay /> Start Session</>}
                            </button>
                            <button 
                                onClick={() => { setIsTimerRunning(false); setTimerSeconds(1500); }}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                                title="Reset Timer"
                            >
                                <FiRefreshCw />
                            </button>
                        </div>
                    </div>

                    {/* Chronotype Energy Curve */}
                    <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-indigo-500/20 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">COGNITIVE ENERGY MATCHING</span>
                                <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                                    PEAK MORNING HOUR (08:00 - 11:30 AM)
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Optimal Focus Curve Detected</h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Your cognitive telemetry indicates peak energy between 08:00 AM and 11:30 AM. P1 Deep Work coding tasks have been automatically prioritized for morning time blocks.
                            </p>

                            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                                    <div className="text-slate-400 text-[10px]">MORNING ENERGY</div>
                                    <div className="text-indigo-400 font-bold text-base mt-1">94% PEAK</div>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                                    <div className="text-slate-400 text-[10px]">MIDDAY RECOVERY</div>
                                    <div className="text-amber-400 font-bold text-base mt-1">68% MODERATE</div>
                                </div>
                                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                                    <div className="text-slate-400 text-[10px]">EVENING FOCUS</div>
                                    <div className="text-purple-400 font-bold text-base mt-1">82% SECOND WIND</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROW 2: TIME BLOCKING CALENDAR VIEW (DAY VS WEEK) */}
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FiGrid className="text-indigo-400" /> 
                                {viewMode === 'day' ? `Today's Scheduled Time Blocks (${currentDayName})` : '7-Day Weekly Time Blocking Matrix'}
                            </h2>
                            <p className="text-xs text-slate-400">15-minute grid snapping with Cal Newport Deep Work categories.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => handleOpenAddModal()}
                                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                            >
                                <FiPlus /> Add Block
                            </button>

                            <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                                <button 
                                    onClick={() => setViewMode('day')} 
                                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${viewMode === 'day' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Day View
                                </button>
                                <button 
                                    onClick={() => setViewMode('week')} 
                                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${viewMode === 'week' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Week View
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* DAY VIEW */}
                    {viewMode === 'day' && (
                        <div className="space-y-3">
                            {dayBlocks.length > 0 ? dayBlocks.map((block) => (
                                <div 
                                    key={block.id} 
                                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${block.color || 'bg-indigo-600/30 border-indigo-500/50'} ${block.completed ? 'opacity-50' : 'hover:scale-[1.005]'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => toggleTaskComplete(block.id)}
                                            className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${block.completed ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-white/20 hover:border-white'}`}
                                            title={block.completed ? 'Mark incomplete' : 'Mark complete'}
                                        >
                                            {block.completed && <FiCheckCircle />}
                                        </button>
                                        <div>
                                            <div className={`font-bold text-sm text-white ${block.completed ? 'line-through text-slate-400' : ''}`}>
                                                {block.title}
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-3">
                                                <span>⏱️ {block.time}</span>
                                                <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wider text-slate-300">{block.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => { setSelectedBlock(block); setIsTimerRunning(true); }}
                                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1"
                                        >
                                            <FiPlay className="text-cyan-400" /> Start Block
                                        </button>

                                        <button 
                                            onClick={(e) => handleOpenEditModal(block, e)}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all border border-white/10"
                                            title="Edit Time Block"
                                        >
                                            <FiEdit3 size={14} />
                                        </button>

                                        <button 
                                            onClick={(e) => handleDeleteBlock(block.id, e)}
                                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all border border-rose-500/20"
                                            title="Delete Time Block"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500">
                                    <FiCalendar className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                                    <p className="font-semibold mb-3">No scheduled time blocks for {currentDayName}.</p>
                                    <button 
                                        onClick={() => handleOpenAddModal(currentDayName)}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition"
                                    >
                                        + Add Block for {currentDayName}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* WEEK VIEW MATRIX (7-DAY GRID) */}
                    {viewMode === 'week' && (
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 overflow-x-auto">
                            {DAYS_OF_WEEK.map((dayName) => {
                                const isToday = dayName === currentDayName;
                                const blocksForDay = timeBlocks.filter(b => b.day === dayName);

                                return (
                                    <div 
                                        key={dayName}
                                        className={`rounded-2xl p-3.5 flex flex-col justify-between border transition-all ${isToday ? 'bg-indigo-950/40 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-slate-900/60 border-slate-800'}`}
                                    >
                                        <div>
                                            {/* Day Header */}
                                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
                                                <div>
                                                    <span className={`text-xs font-bold font-mono tracking-wider ${isToday ? 'text-cyan-400' : 'text-slate-300'}`}>
                                                        {dayName.slice(0, 3).toUpperCase()}
                                                    </span>
                                                    {isToday && (
                                                        <span className="ml-1.5 text-[9px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 px-1.5 py-0.5 rounded uppercase font-bold">
                                                            Today
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <button 
                                                    onClick={() => handleOpenAddModal(dayName)}
                                                    className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition"
                                                    title={`Add block to ${dayName}`}
                                                >
                                                    <FiPlus size={13} />
                                                </button>
                                            </div>

                                            {/* Block Cards List for this day */}
                                            <div className="space-y-2 min-h-[160px]">
                                                {blocksForDay.length > 0 ? (
                                                    blocksForDay.map(block => (
                                                        <div 
                                                            key={block.id}
                                                            className={`p-2.5 rounded-xl border text-xs relative group ${block.color || 'bg-indigo-600/30 border-indigo-500/50'} ${block.completed ? 'opacity-50' : ''}`}
                                                        >
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className={`font-bold leading-tight ${block.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                                                                    {block.title}
                                                                </span>
                                                                <button 
                                                                    onClick={() => toggleTaskComplete(block.id)}
                                                                    className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border transition ${block.completed ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-white/30'}`}
                                                                >
                                                                    {block.completed && <FiCheck size={10} />}
                                                                </button>
                                                            </div>

                                                            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between mt-1">
                                                                <span>{block.time}</span>
                                                                <span className="bg-white/10 px-1.5 py-0.5 rounded uppercase">{block.category}</span>
                                                            </div>

                                                            {/* Hover Actions */}
                                                            <div className="pt-2 mt-2 border-t border-white/10 flex justify-end gap-1">
                                                                <button 
                                                                    onClick={(e) => handleOpenEditModal(block, e)}
                                                                    className="p-1 text-slate-400 hover:text-white"
                                                                    title="Edit"
                                                                >
                                                                    <FiEdit3 size={12} />
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => handleDeleteBlock(block.id, e)}
                                                                    className="p-1 text-rose-400 hover:text-rose-300"
                                                                    title="Delete"
                                                                >
                                                                    <FiTrash2 size={12} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 text-[11px] py-8">
                                                        <span>No blocks</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Column Footer */}
                                        <div className="mt-3 pt-2 border-t border-white/5 text-center">
                                            <button 
                                                onClick={() => handleOpenAddModal(dayName)}
                                                className="text-[10px] text-slate-400 hover:text-cyan-400 font-semibold transition"
                                            >
                                                + Add to {dayName.slice(0, 3)}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            {/* Add / Edit Time Block Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-white text-xl"
                        >
                            <FiXCircle />
                        </button>

                        <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                            <FiClock className="text-indigo-400" />
                            {editingBlockId ? 'Edit Scheduled Time Block' : 'Add New Scheduled Time Block'}
                        </h3>

                        <form onSubmit={handleSaveBlock} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                    Block Title & Focus Goal
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. SYS.DEV: Async Rust Tokio Engine" 
                                    value={blockForm.title}
                                    onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Day of the Week
                                    </label>
                                    <select 
                                        value={blockForm.day}
                                        onChange={(e) => setBlockForm({ ...blockForm, day: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
                                    >
                                        {DAYS_OF_WEEK.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Time Schedule
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="09:00 - 10:30 AM" 
                                        value={blockForm.time}
                                        onChange={(e) => setBlockForm({ ...blockForm, time: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Category
                                    </label>
                                    <select 
                                        value={blockForm.category}
                                        onChange={(e) => setBlockForm({ ...blockForm, category: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
                                    >
                                        <option value="Coding">Coding</option>
                                        <option value="Fitness">Fitness</option>
                                        <option value="Exam Prep">Exam Prep</option>
                                        <option value="Knowledge">Knowledge</option>
                                        <option value="Mindset">Mindset</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Block Type
                                    </label>
                                    <select 
                                        value={blockForm.type}
                                        onChange={(e) => setBlockForm({ ...blockForm, type: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
                                    >
                                        <option value="deep_work">Deep Work</option>
                                        <option value="workout">Workout</option>
                                        <option value="study">Study</option>
                                        <option value="reading">Reading</option>
                                        <option value="recovery">Recovery</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
                                >
                                    <FiCheck /> {editingBlockId ? 'Save Changes' : 'Create Time Block'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
