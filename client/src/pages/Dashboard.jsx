import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    FiLogOut, FiTarget, FiZap, FiAward, FiUsers, 
    FiTerminal, FiActivity, FiBookOpen, FiBarChart2, 
    FiPlus, FiCheckSquare, FiArrowRight, FiShield, FiTrendingUp, FiEye, FiBell 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';

export default function Dashboard({ onOpenCommandPalette }) {
    const { user, logout } = useContext(AuthContext);
    const [challenges, setChallenges] = useState([]);
    const [loadingChallenges, setLoadingChallenges] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/challenges', { headers: { Authorization: `Bearer ${token}` } });
                setChallenges(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingChallenges(false);
            }
        };
        fetchChallenges();
        // Fetch unread alerts count
        const fetchUnread = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/friends/interventions/unread-count', { headers: { Authorization: `Bearer ${token}` } });
                setUnreadCount(res.data?.count || 0);
            } catch (e) {}
        };
        fetchUnread();
    }, []);

    // Calculate level progress
    const xpForCurrentLevel = (user?.level || 1) * 100;
    const xpProgress = Math.min(100, Math.round(((user?.xp || 0) / xpForCurrentLevel) * 100));

    return (
        <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 md:p-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="ambient-glow top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15"></div>
            <div className="ambient-glow bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10"></div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                
                {/* PRO TOP BAR */}
                <header className="glass-panel px-6 py-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20">
                            L
                        </div>
                        <div>
                            <span className="font-bold tracking-tight text-lg gradient-text-primary">LifeOS</span>
                            <span className="text-xs text-slate-500 block font-mono">v2.4 PRO ENGINE</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <button 
                            onClick={onOpenCommandPalette}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer w-full sm:w-auto justify-center"
                        >
                            <FiSearch className="text-slate-400" />
                            <span>Search...</span>
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-slate-400 font-mono">Ctrl+K</kbd>
                        </button>

                        <nav className="flex items-center gap-3.5 text-xs font-medium text-slate-400 overflow-x-auto scrollbar-none max-w-full py-1">
                            <Link to="/" className="text-indigo-400 font-semibold flex items-center gap-1.5 shrink-0">
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span> Overview
                            </Link>
                            <Link to="/challenges" className="hover:text-slate-200 transition-colors shrink-0">Goals</Link>
                            <Link to="/gym" className="hover:text-slate-200 transition-colors shrink-0">Fitness</Link>
                            <Link to="/calendar" className="hover:text-slate-200 transition-colors shrink-0">Calendar</Link>

                            <Link to="/notifications" className="hover:text-slate-200 transition-colors relative flex items-center gap-1 shrink-0">
                                Alerts
                                {unreadCount > 0 && (
                                    <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-rose-600 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                            <Link to="/analytics" className="hover:text-slate-200 transition-colors shrink-0">Analytics</Link>
                            <Link to="/friends" className="hover:text-slate-200 transition-colors shrink-0">Partners</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-bold text-slate-200 leading-tight">{user?.username}</div>
                                <div className="text-[10px] text-indigo-400 font-mono">LVL {user?.level || 1}</div>
                            </div>
                        </div>

                        <button 
                            onClick={logout} 
                            className="p-2.5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition-all"
                            title="Sign Out"
                        >
                            <FiLogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* HERO WELCOME BANNER */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-indigo-500/20"
                >
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
                                <FiShield /> DISCIPLINE PROTOCOL ACTIVE
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text-primary">
                                Welcome back, {user?.username || 'Disciplinarian'}
                            </h1>
                            <p className="text-slate-400 text-sm mt-1 max-w-xl">
                                Stay consistent. Review peer milestones, maintain your coding streak, and execute today's split.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link 
                                to="/challenges/new" 
                                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02]"
                            >
                                <FiPlus size={18} /> New Sprint
                            </Link>
                            <Link 
                                to="/reviews" 
                                className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold px-5 py-3 rounded-xl transition-all"
                            >
                                <FiCheckSquare size={18} /> Review Approvals
                            </Link>
                        </div>
                    </div>

                    {/* Level XP Progress Bar */}
                    <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="md:col-span-3">
                            <div className="flex justify-between text-xs font-semibold mb-2">
                                <span className="text-slate-400">Level {user?.level || 1} Progress</span>
                                <span className="text-indigo-400">{user?.xp || 0} / {xpForCurrentLevel} XP ({xpProgress}%)</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                                <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                    style={{ width: `${xpProgress}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-slate-500 block">Next Tier Rank</span>
                            <span className="text-sm font-bold text-slate-200">Elite Disciplinarian</span>
                        </div>
                    </div>
                </motion.div>

                {/* 4 PRO STAT CARDS */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                    {/* XP Card */}
                    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Experience</span>
                                <div className="text-3xl font-extrabold mt-2 text-slate-100">{user?.xp || 0} <span className="text-sm font-semibold text-indigo-400">XP</span></div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <FiAward size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-emerald-400 font-medium">
                            <FiTrendingUp className="mr-1" /> Tier multiplier active
                        </div>
                    </div>

                    {/* Streak Card */}
                    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Streak</span>
                                <div className="text-3xl font-extrabold mt-2 gradient-text-emerald">{user?.current_streak || 0} <span className="text-sm font-semibold text-emerald-400">Days</span></div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <FiZap size={24} />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-slate-400 font-medium">
                            Status: <span className="text-emerald-400 font-semibold">Streak Secured</span>
                        </div>
                    </div>

                    {/* Active Challenges Card */}
                    <Link to="/challenges" className="glass-card p-6 rounded-2xl relative overflow-hidden group block">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Sprints</span>
                                <div className="text-3xl font-extrabold mt-2 text-slate-100">{challenges.length} <span className="text-sm font-semibold text-slate-400">Tracked</span></div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                                <FiTarget size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-violet-400 font-semibold">
                            <span>Manage Challenges</span>
                            <FiArrowRight />
                        </div>
                    </Link>

                    {/* Reviews Card */}
                    <Link to="/reviews" className="glass-card p-6 rounded-2xl relative overflow-hidden group block">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peer Accountability</span>
                                <div className="text-3xl font-extrabold mt-2 text-rose-400">Review Hub</div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                                <FiUsers size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-rose-400 font-semibold">
                            <span>Check Pending Approvals</span>
                            <FiArrowRight />
                        </div>
                    </Link>
                </motion.div>

                {/* MODULE COMMAND CENTER GRID */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >

                    {/* Iron Forge Card */}
                    <Link to="/gym" className="glass-panel p-6 rounded-2xl border border-rose-500/20 hover:border-rose-500/50 transition-all group relative overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
                            <FiActivity size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 flex items-center justify-between">
                            Iron Forge Gym
                            <FiArrowRight className="text-rose-400 group-hover:translate-x-1 transition-transform" />
                        </h3>
                        <p className="text-xs text-slate-400 mt-2">
                            7-day targeted workout split protocol. Track exercises and check off daily sets.
                        </p>
                        <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center text-xs text-rose-400 font-semibold">
                            <span>Today's Protocol</span>
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">Workout Split</span>
                        </div>
                    </Link>

                    {/* Exam Mode Card */}
                    <Link to="/exams" className="glass-panel p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all group relative overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                            <FiBookOpen size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 flex items-center justify-between">
                            Exam Focus Mode
                            <FiArrowRight className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
                        </h3>
                        <p className="text-xs text-slate-400 mt-2">
                            Distraction-free countdowns. Pause active sprints safely during finals without losing streaks.
                        </p>
                        <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center text-xs text-cyan-400 font-semibold">
                            <span>Streak Protection</span>
                            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">Exam Haven</span>
                        </div>
                    </Link>

                    {/* Analytics Card */}
                    <Link to="/analytics" className="glass-panel p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all group relative overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                            <FiBarChart2 size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 flex items-center justify-between">
                            Analytics & Heatmap
                            <FiArrowRight className="text-purple-400 group-hover:translate-x-1 transition-transform" />
                        </h3>
                        <p className="text-xs text-slate-400 mt-2">
                            90-day consistency heatmap, global leaderboards, and unlocked trophy room badges.
                        </p>
                        <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center text-xs text-purple-400 font-semibold">
                            <span>Leaderboards</span>
                            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">Metrics</span>
                        </div>
                    </Link>

                    {/* Accountability Partners Card */}
                    <Link to="/friends" className="glass-panel p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all group relative overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                            <FiUsers size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 flex items-center justify-between">
                            Accountability Partners
                            <FiArrowRight className="text-amber-400 group-hover:translate-x-1 transition-transform" />
                        </h3>
                        <p className="text-xs text-slate-400 mt-2">
                            View partner dashboards, inspect skipped tasks, send inquiries & assign punishments.
                        </p>
                        <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center text-xs text-amber-400 font-semibold">
                            <span>Partner Inspection</span>
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 flex items-center gap-1"><FiEye size={10} /> View All</span>
                        </div>
                    </Link>
                </motion.div>

                {/* ACTIVE CHALLENGES & SPRINTS PREVIEW SECTION */}
                <div className="glass-panel p-6 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <FiTarget className="text-indigo-400" /> Active Sprints & 10-Day Milestones
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">Your live 10-day sprint progress requiring peer approvals</p>
                        </div>
                        <Link to="/challenges" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                            View All <FiArrowRight />
                        </Link>
                    </div>

                    {loadingChallenges ? (
                        <div className="text-center py-8 text-slate-500 text-sm font-mono">Loading active sprints...</div>
                    ) : challenges.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl">
                            <p className="text-slate-400 text-sm">No active sprints running right now.</p>
                            <Link to="/challenges/new" className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300">
                                <FiPlus /> Start Your First 10-Day Milestone Sprint
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {challenges.slice(0, 4).map((c) => (
                                <div key={c.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-100">{c.title}</h4>
                                            <span className="text-xs text-slate-400 font-mono">{c.category || 'General Discipline'}</span>
                                        </div>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                            {c.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                                    <div className="pt-2 flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-mono">10-Day Sprint Engine</span>
                                        <Link to={`/challenges/${c.id}`} className="text-indigo-400 hover:underline font-semibold">
                                            View Milestones →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
