import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
    FiGrid, FiTarget, FiActivity, FiCalendar, FiBell, FiBarChart2, 
    FiUsers, FiCpu, FiBookOpen, FiShield, FiTerminal, FiSearch, 
    FiLogOut, FiPlus, FiCheckSquare, FiZap, FiChevronRight, FiClock,
    FiSliders, FiLayers, FiRadio, FiCheckCircle2
} from 'react-icons/fi';
import dayjs from 'dayjs';

const PalantirLayout = ({ children, onOpenCommandPalette }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [currentTime, setCurrentTime] = useState(dayjs().format('ddd M/DD hh:mm:ss A'));

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(dayjs().format('ddd M/DD hh:mm:ss A'));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const xpForCurrentLevel = (user?.level || 1) * 500;
    const xpProgress = Math.min(100, Math.round(((user?.xp || 0) / xpForCurrentLevel) * 100));

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const iconNavItems = [
        { label: 'Overview Console', path: '/', icon: FiGrid },
        { label: 'Sprint Goals', path: '/challenges', icon: FiTarget },
        { label: 'Iron Forge Gym', path: '/gym', icon: FiActivity },
        { label: 'Calendar', path: '/calendar', icon: FiCalendar },
        { label: 'AI Coach', path: '/ai-coach', icon: FiCpu },
        { label: 'Knowledge Base', path: '/knowledge', icon: FiBookOpen },
        { label: 'Analytics Engine', path: '/analytics', icon: FiBarChart2 },
        { label: 'Approvals Hub', path: '/reviews', icon: FiCheckSquare },
        { label: 'Partners Telemetry', path: '/friends', icon: FiUsers },
        { label: 'Exam Focus Shield', path: '/exams', icon: FiShield },
        { label: 'System Alerts', path: '/notifications', icon: FiBell },
        { label: 'Dev Console', path: '/dev', icon: FiTerminal },
    ];

    const protocolFeed = [
        { title: 'DSA 10-Day Sprint', status: 'IN_PROGRESS', tag: 'TRANSIT', time: 'Today 09:00 AM' },
        { title: 'Iron Forge Push Workout', status: 'COMPLETED', tag: 'ASSIGNED', time: 'Today 07:30 AM' },
        { title: 'System Architecture Review', status: 'PENDING', tag: 'ARRIVAL_DAY', time: 'Today 06:00 PM' },
        { title: 'Peer Telemetry Sync', status: 'ONLINE', tag: 'LIVE_FEED', time: 'Realtime' },
    ];

    return (
        <div className="min-h-screen bg-[#080B10] text-[#E2E8F0] flex font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
            
            {/* 1. NARROW PALANTIR ICON-ONLY RAIL (FAR LEFT) */}
            <aside className="w-16 bg-[#06080D] border-r border-[#1B2230] h-screen sticky top-0 flex flex-col justify-between items-center py-4 z-50 shrink-0 select-none">
                <div className="flex flex-col items-center gap-6">
                    {/* Palantir Foundry Emblem */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-mono font-black text-black shadow-lg shadow-cyan-500/20 text-lg">
                        P
                    </div>

                    {/* Vertical Icon Rail Navigation */}
                    <nav className="flex flex-col items-center gap-2">
                        {iconNavItems.slice(0, 9).map((item, idx) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={idx}
                                    to={item.path}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${
                                        active
                                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-md shadow-cyan-500/20'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                                    }`}
                                    title={item.label}
                                >
                                    <Icon size={18} />
                                    {/* Tooltip */}
                                    <span className="absolute left-14 bg-[#0F1522] text-cyan-300 font-mono text-[11px] px-2.5 py-1 rounded-md border border-[#253047] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Profile / Signout */}
                <div className="flex flex-col items-center gap-3">
                    <button 
                        onClick={logout} 
                        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 flex items-center justify-center transition-all"
                        title="Sign Out"
                    >
                        <FiLogOut size={16} />
                    </button>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-black font-mono font-black flex items-center justify-center text-xs">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                </div>
            </aside>

            {/* 2. SECONDARY CONTEXTUAL TELEMETRY SIDEBAR (PALANTIR GOTHAM FEED) */}
            <aside className="w-72 bg-[#0A0E17] border-r border-[#1B2230] h-screen sticky top-0 flex flex-col justify-between p-4 z-40 shrink-0 select-none font-mono text-xs overflow-y-auto scrollbar-none">
                <div className="space-y-6">
                    
                    {/* Live Clock & Situation Card */}
                    <div className="bg-[#0D121F] border border-[#1E2738] p-3.5 rounded-xl space-y-3 shadow-md">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">[CURRENT_SITUATION]</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        </div>
                        <div className="text-sm font-extrabold text-white tracking-wider flex items-center gap-2">
                            <FiClock className="text-cyan-400" /> {currentTime}
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E2738]">
                            <div className="bg-slate-950 p-2 rounded-lg border border-[#1E2738] text-center">
                                <span className="text-[9px] text-slate-400 block uppercase">LIVE UNITS</span>
                                <span className="text-sm font-black text-cyan-400">4</span>
                            </div>
                            <div className="bg-slate-950 p-2 rounded-lg border border-[#1E2738] text-center">
                                <span className="text-[9px] text-slate-400 block uppercase">PENDING</span>
                                <span className="text-sm font-black text-amber-400">6</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase px-1">PROTOCOL FILTERS</span>
                        <div className="flex flex-wrap gap-1.5">
                            <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">ALL (10)</span>
                            <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-400 border border-[#1E2738] text-[10px] font-bold hover:text-white cursor-pointer">ACTIVE (4)</span>
                            <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-400 border border-[#1E2738] text-[10px] font-bold hover:text-white cursor-pointer">PARTNERS (3)</span>
                        </div>
                    </div>

                    {/* Live Protocol Feed */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase px-1">LIVE FEED TELEMETRY</span>
                        <div className="space-y-2">
                            {protocolFeed.map((item, idx) => (
                                <div key={idx} className="bg-[#0D121F] border border-[#1E2738] hover:border-cyan-500/40 p-3 rounded-xl space-y-1.5 transition-all cursor-pointer">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-white text-[11px] truncate max-w-[140px]">{item.title}</span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                            {item.tag}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                                        <span>{item.time}</span>
                                        <span className={item.status === 'COMPLETED' ? 'text-emerald-400 font-bold' : 'text-cyan-400'}>{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operator Status Gauge */}
                    <div className="bg-[#0D121F] border border-[#1E2738] p-3 rounded-xl space-y-2">
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-400">OPERATOR RANK XP</span>
                            <span className="text-cyan-400">{user?.xp || 0} / {xpForCurrentLevel} XP</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-md overflow-hidden border border-cyan-500/30">
                            <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-300" style={{ width: `${xpProgress}%` }}></div>
                        </div>
                    </div>

                </div>
            </aside>

            {/* 3. MAIN WORKSPACE CONTAINER */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#080B10]">
                {/* TOP PALANTIR COMMAND HEADER */}
                <header className="h-14 border-b border-[#1B2230] bg-[#0A0E17]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 font-mono text-xs select-none">
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] font-black text-cyan-400 tracking-widest uppercase flex items-center gap-2">
                            <FiRadio className="animate-pulse text-cyan-400" /> UNCLASSIFIED // LIFEOS COMMAND CENTER
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            AUTOSAVE: LIVE
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onOpenCommandPalette}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-[#1E2738] text-slate-300 hover:border-cyan-500/40 hover:text-white transition-all cursor-pointer text-[11px]"
                        >
                            <FiSearch className="text-cyan-400" />
                            <span>EXECUTE_CMD</span>
                            <kbd className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[9px] text-cyan-300">CTRL+K</kbd>
                        </button>

                        <Link 
                            to="/challenges/new" 
                            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold px-3.5 py-1.5 rounded-lg shadow-lg shadow-cyan-500/20 transition-all text-[11px] uppercase tracking-wider"
                        >
                            <FiPlus size={14} /> + New Protocol
                        </Link>
                    </div>
                </header>

                {/* PAGE CONTENT WORKSPACE */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>

        </div>
    );
};

export default PalantirLayout;
