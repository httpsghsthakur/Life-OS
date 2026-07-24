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
        <div className="space-y-8 relative z-10 font-sans">

                {/* PALANTIR HERO COMMAND CONSOLE */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="palantir-panel p-8 rounded-3xl relative overflow-hidden border border-cyan-500/20"
                >
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
                                <FiShield className="text-cyan-400" /> [DISCIPLINE PROTOCOL: ACTIVE]
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white font-mono">
                                OPERATOR: {user?.username?.toUpperCase() || 'DISCIPLINARIAN'}
                            </h1>
                            <p className="text-slate-400 text-sm mt-1 max-w-xl font-mono">
                                System telemetry nominal. Monitor peer milestones, execute daily sprint protocols, and maintain streak metrics.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 font-mono">
                            <Link 
                                to="/challenges/new" 
                                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02] text-xs uppercase tracking-wider"
                            >
                                <FiPlus size={18} /> + New Sprint Protocol
                            </Link>
                            <Link 
                                to="/reviews" 
                                className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-200 font-bold px-5 py-3 rounded-xl transition-all text-xs uppercase tracking-wider"
                            >
                                <FiCheckSquare size={18} /> Approvals Hub
                            </Link>
                        </div>
                    </div>

                    {/* Palantir Level XP Telemetry Gauge */}
                    <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-4 items-center font-mono">
                        <div className="md:col-span-3">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-slate-400">LEVEL {user?.level || 1} TELEMETRY GAUGE</span>
                                <span className="text-cyan-400 font-bold">{user?.xp || 0} / {xpForCurrentLevel} XP ({xpProgress}%)</span>
                            </div>
                            <div className="h-3 w-full bg-slate-950 rounded-md overflow-hidden p-0.5 border border-cyan-500/30">
                                <div 
                                    className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-sm transition-all duration-500 shadow-md shadow-cyan-500/50"
                                    style={{ width: `${xpProgress}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">NEXT RANK CLASSIFICATION</span>
                            <span className="text-sm font-extrabold text-cyan-400 uppercase">ELITE OPERATOR</span>
                        </div>
                    </div>
                </motion.div>

                {/* 4 PALANTIR TELEMETRY NODES */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono"
                >
                    {/* XP Card */}
                    <div className="palantir-card p-6 rounded-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[XP_METRIC]</span>
                                <div className="text-3xl font-black mt-2 text-white">{user?.xp || 0} <span className="text-sm font-bold text-cyan-400">XP</span></div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                <FiAward size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-emerald-400 font-bold">
                            <FiTrendingUp className="mr-1" /> TIER_MULTIPLIER: 1.5x ACTIVE
                        </div>
                    </div>

                    {/* Streak Card */}
                    <div className="palantir-card p-6 rounded-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[CYBER_STREAK]</span>
                                <div className="text-3xl font-black mt-2 text-emerald-400">{user?.current_streak || 0} <span className="text-sm font-bold text-slate-400">DAYS</span></div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <FiZap size={24} />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-slate-400 font-bold">
                            STATUS: <span className="text-emerald-400">● STREAK_SECURED</span>
                        </div>
                    </div>

                    {/* Active Sprints Card */}
                    <Link to="/challenges" className="palantir-card p-6 rounded-2xl relative overflow-hidden group block">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[ACTIVE_SPRINTS]</span>
                                <div className="text-3xl font-black mt-2 text-white">{challenges.length} <span className="text-sm font-bold text-slate-400">NODES</span></div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                <FiTarget size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-cyan-400 font-bold">
                            <span>MANAGE_SPRINTS</span>
                            <FiArrowRight />
                        </div>
                    </Link>

                    {/* Peer Telemetry Card */}
                    <Link to="/friends" className="palantir-card p-6 rounded-2xl relative overflow-hidden group block">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[PEER_TELEMETRY]</span>
                                <div className="text-3xl font-black mt-2 text-rose-400">ACTIVE</div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                                <FiUsers size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-rose-400 font-bold">
                            <span>INSPECT_PARTNERS</span>
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
    );
}
