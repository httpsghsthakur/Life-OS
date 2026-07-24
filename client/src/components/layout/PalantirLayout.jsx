import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
    FiGrid, FiTarget, FiActivity, FiCalendar, FiBell, FiBarChart2, 
    FiUsers, FiCpu, FiBookOpen, FiShield, FiTerminal, FiSearch, 
    FiLogOut, FiPlus, FiCheckSquare, FiZap, FiChevronRight, FiClock
} from 'react-icons/fi';

const PalantirLayout = ({ children, onOpenCommandPalette }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const xpForCurrentLevel = (user?.level || 1) * 500;
    const xpProgress = Math.min(100, Math.round(((user?.xp || 0) / xpForCurrentLevel) * 100));

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const navSections = [
        {
            title: 'CORE OPERATIONS',
            items: [
                { label: 'Overview Console', path: '/', icon: FiGrid },
                { label: 'Sprint Goals', path: '/challenges', icon: FiTarget },
                { label: 'Iron Forge Gym', path: '/gym', icon: FiActivity },
                { label: 'Timeblock Calendar', path: '/calendar', icon: FiCalendar },
            ]
        },
        {
            title: 'INTELLIGENCE & AI',
            items: [
                { label: 'AI Coach Agent', path: '/ai-coach', icon: FiCpu },
                { label: 'Knowledge Base', path: '/knowledge', icon: FiBookOpen },
                { label: 'Analytics Engine', path: '/analytics', icon: FiBarChart2 },
                { label: 'Review Approvals', path: '/reviews', icon: FiCheckSquare },
            ]
        },
        {
            title: 'NETWORK & SHIELD',
            items: [
                { label: 'Partners Telemetry', path: '/friends', icon: FiUsers },
                { label: 'Exam Focus Mode', path: '/exams', icon: FiShield },
                { label: 'System Alerts', path: '/notifications', icon: FiBell },
                { label: 'Developer Console', path: '/dev', icon: FiTerminal },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#080B10] text-[#E2E8F0] flex font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* PALANTIR LEFT SIDEBAR CONSOLE */}
            <aside className="w-64 bg-[#0A0E17] border-r border-[#1E2638] h-screen sticky top-0 flex flex-col justify-between p-4 z-40 shrink-0 select-none shadow-2xl">
                <div className="space-y-6 overflow-y-auto scrollbar-none pr-1">
                    {/* Brand Header */}
                    <div className="flex items-center gap-3 px-2 py-2 border-b border-[#1E2638]">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-mono font-black text-lg text-black shadow-lg shadow-cyan-500/20">
                            P
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-mono font-black tracking-wider text-sm text-white">LIFEOS</span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded font-bold">FOUNDRY</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block font-mono">OPERATIONS CONSOLE</span>
                        </div>
                    </div>

                    {/* Navigation Groups */}
                    <nav className="space-y-6">
                        {navSections.map((section, idx) => (
                            <div key={idx} className="space-y-1.5">
                                <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase px-3">
                                    {section.title}
                                </h3>
                                <div className="space-y-1">
                                    {section.items.map((item, itemIdx) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.path);
                                        return (
                                            <Link
                                                key={itemIdx}
                                                to={item.path}
                                                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                                                    active
                                                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Icon className={active ? 'text-cyan-400' : 'text-slate-500'} size={16} />
                                                    <span>{item.label}</span>
                                                </div>
                                                {active && <FiChevronRight className="text-cyan-400 text-xs" />}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Left Sidebar Footer Operator Badge */}
                <div className="pt-4 border-t border-[#1E2638] space-y-3 font-mono">
                    <div className="bg-slate-950/90 border border-cyan-500/20 p-3 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-black font-black text-xs">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white leading-tight">{user?.username}</div>
                                    <div className="text-[9px] text-cyan-400">LVL {user?.level || 1} OPERATOR</div>
                                </div>
                            </div>
                            <button 
                                onClick={logout} 
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                title="Sign Out"
                            >
                                <FiLogOut size={15} />
                            </button>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-cyan-500/30">
                            <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${xpProgress}%` }}></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TOP HEADER COMMAND TICKER */}
                <header className="h-16 border-b border-[#1E2638] bg-[#0A0E17]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 font-mono text-xs">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onOpenCommandPalette}
                            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white transition-all cursor-pointer"
                        >
                            <FiSearch className="text-cyan-400" />
                            <span>EXECUTE_COMMAND...</span>
                            <kbd className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] text-cyan-300">CTRL+K</kbd>
                        </button>

                        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> TELEMETRY: NOMINAL
                            </span>
                            <span>•</span>
                            <span>LATENCY: 12ms</span>
                            <span>•</span>
                            <span>STREAK: {user?.current_streak || 0}D</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link 
                            to="/challenges/new" 
                            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 transition-all text-xs uppercase tracking-wider"
                        >
                            <FiPlus size={16} /> New Goal
                        </Link>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default PalantirLayout;
