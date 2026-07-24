import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
    FiAward, FiBarChart2, FiTrendingUp, FiZap, FiTarget, FiActivity, 
    FiCpu, FiCheckCircle, FiClock, FiShield, FiPieChart, FiCheckSquare, FiFlag, FiCalendar
} from 'react-icons/fi';
import dayjs from 'dayjs';
import BackButton from '../components/ui/BackButton';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsDashboard() {
    const { user } = useContext(AuthContext);
    const [summary, setSummary] = useState(null);
    const [heatmap, setHeatmap] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [badges, setBadges] = useState([]);
    const [timeSeries, setTimeSeries] = useState([]);
    const [horizon, setHorizon] = useState('daily'); // 'daily', 'monthly', 'yearly'
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const [sumRes, hmRes, lbRes, bgRes, tsRes] = await Promise.all([
                axios.get('/api/analytics/summary', { headers }),
                axios.get('/api/analytics/heatmap', { headers }),
                axios.get('/api/analytics/leaderboard', { headers }),
                axios.get('/api/analytics/badges', { headers }),
                axios.get(`/api/analytics/timeseries?horizon=${horizon}`, { headers })
            ]);
            setSummary(sumRes.data);
            setHeatmap(hmRes.data || []);
            setLeaderboard(lbRes.data || []);
            setBadges(bgRes.data || []);
            setTimeSeries(tsRes.data || []);
        } catch (err) { 
            console.error(err); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { 
        fetchData(); 
    }, [horizon]);

    const handleBackfill = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/analytics/backfill', {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) { 
            console.error(err); 
        }
    };

    const renderHeatmap = () => {
        const days = [];
        const today = dayjs();
        for (let i = 89; i >= 0; i--) {
            const d = today.subtract(i, 'day').format('YYYY-MM-DD');
            const data = heatmap.find(h => h.date === d);
            const count = data ? data.count : 0;
            
            let color = 'bg-white/5 border border-white/5'; 
            if (count > 0 && count <= 1) color = 'bg-indigo-600/30 border border-indigo-500/30';
            else if (count > 1 && count <= 3) color = 'bg-indigo-500/60 border border-indigo-400/50';
            else if (count > 3) color = 'bg-indigo-500 shadow-sm shadow-indigo-500/50';

            days.push(
                <div 
                    key={d} 
                    className={`w-3.5 h-3.5 rounded-sm ${color} transition-all hover:scale-125 cursor-pointer`} 
                    title={`${count} activities on ${d}`}
                ></div>
            );
        }

        return (
            <div className="flex flex-col items-center">
                <div className="flex flex-wrap gap-1.5 w-full max-w-full overflow-x-auto justify-center py-2">
                    {days}
                </div>
                <div className="flex justify-between w-full mt-3 text-xs text-slate-500 font-mono">
                    <span>90 Days Ago</span>
                    <span>Today's Execution</span>
                </div>
            </div>
        );
    };

    const iconMap = {
        'FiZap': <FiZap className="text-amber-400 w-7 h-7 mx-auto" />,
        'FiTarget': <FiTarget className="text-emerald-400 w-7 h-7 mx-auto" />,
        'FiActivity': <FiActivity className="text-rose-400 w-7 h-7 mx-auto" />
    };

    if (loading) return (
        <div className="min-h-screen bg-[#090A0F] p-8 flex items-center justify-center font-mono text-indigo-400">
            <div className="animate-pulse flex items-center gap-3">
                <FiCpu className="animate-spin text-2xl" /> Querying Database Telemetry...
            </div>
        </div>
    );

    // Real dynamic database metrics
    const lifeScore = summary?.lifeScore || 50;
    const disciplineScore = summary?.disciplineScore || 50;
    const growthScore = summary?.growthScore || 50;
    const healthScore = summary?.healthScore || 50;
    const focusScore = summary?.focusScore || 50;

    return (
        <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 md:p-8 relative overflow-hidden">
            <div className="ambient-glow top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15"></div>
            <div className="ambient-glow bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10"></div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <BackButton />

                {/* Page Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">
                            <FiPieChart /> Real-Time Database Analytics Engine
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                            <FiBarChart2 className="text-indigo-400" /> Life Intelligence & Analytics
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Live telemetry calculated dynamically from your Supabase PostgreSQL tables.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-slate-900/50 border border-slate-700 p-1 rounded-xl flex items-center gap-1">
                            <button onClick={() => setHorizon('daily')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${horizon === 'daily' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Daily</button>
                            <button onClick={() => setHorizon('monthly')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${horizon === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Monthly</button>
                            <button onClick={() => setHorizon('yearly')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${horizon === 'yearly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Yearly</button>
                        </div>
                        <button 
                            onClick={handleBackfill} 
                            className="bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl transition-all text-xs font-semibold"
                        >
                            Sync Telemetry
                        </button>
                    </div>
                </header>

                {/* ROW 1: REAL METRIC CARDS OVERVIEW */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="glass-card p-5 rounded-2xl border-t-2 border-t-indigo-500">
                        <div className="flex justify-between items-center text-slate-400 mb-2">
                            <span className="text-xs font-mono">TOTAL GOALS</span>
                            <FiTarget className="text-indigo-400" />
                        </div>
                        <div className="text-3xl font-black text-white">{summary?.totalGoals || 0}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{summary?.activeGoals || 0} Active • {summary?.completedGoals || 0} Done</div>
                    </div>

                    <div className="glass-card p-5 rounded-2xl border-t-2 border-t-emerald-500">
                        <div className="flex justify-between items-center text-slate-400 mb-2">
                            <span className="text-xs font-mono">MILESTONES</span>
                            <FiFlag className="text-emerald-400" />
                        </div>
                        <div className="text-3xl font-black text-white">{summary?.completedMilestones || 0}</div>
                        <div className="text-[11px] text-slate-400 mt-1">out of {summary?.totalMilestones || 0} Milestones</div>
                    </div>

                    <div className="glass-card p-5 rounded-2xl border-t-2 border-t-purple-500">
                        <div className="flex justify-between items-center text-slate-400 mb-2">
                            <span className="text-xs font-mono">TASKS DONE</span>
                            <FiCheckSquare className="text-purple-400" />
                        </div>
                        <div className="text-3xl font-black text-white">{summary?.completedTasks || 0}</div>
                        <div className="text-[11px] text-slate-400 mt-1">out of {summary?.totalTasks || 0} Total Tasks</div>
                    </div>

                    <div className="glass-card p-5 rounded-2xl border-t-2 border-t-amber-500">
                        <div className="flex justify-between items-center text-slate-400 mb-2">
                            <span className="text-xs font-mono">STREAK & XP</span>
                            <FiZap className="text-amber-400" />
                        </div>
                        <div className="text-3xl font-black text-amber-400">{summary?.streak || 0}d</div>
                        <div className="text-[11px] text-slate-400 mt-1">Lvl {summary?.level || 1} • {summary?.xp || 0} XP</div>
                    </div>
                </div>

                {/* ROW 2: UNIFIED LIFE SCORE & SUBSCORES */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Overall Life Score Gauge */}
                    <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col justify-between items-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 text-indigo-400 group-hover:scale-110 transition-transform">
                            <FiTarget size={80} />
                        </div>
                        <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">REAL LIFE SCORE</span>
                        
                        <div className="my-4 relative flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full border-8 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                                <div>
                                    <div className="text-4xl font-black text-white">{lifeScore}</div>
                                    <div className="text-[10px] font-mono text-slate-400 uppercase">/ 100 PTS</div>
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-slate-400">
                            Calculated dynamically from SQL DB
                        </div>
                    </div>

                    {/* Subscore Cards */}
                    <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between border-t-2 border-t-indigo-500">
                            <div className="flex justify-between items-center text-slate-400 mb-2">
                                <span className="text-xs font-mono">DISCIPLINE</span>
                                <FiShield className="text-indigo-400" />
                            </div>
                            <div className="text-2xl font-bold text-white">{disciplineScore}%</div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-indigo-500 h-full" style={{ width: `${disciplineScore}%` }}></div>
                            </div>
                        </div>

                        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between border-t-2 border-t-emerald-500">
                            <div className="flex justify-between items-center text-slate-400 mb-2">
                                <span className="text-xs font-mono">GROWTH</span>
                                <FiTrendingUp className="text-emerald-400" />
                            </div>
                            <div className="text-2xl font-bold text-white">{growthScore}%</div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-emerald-500 h-full" style={{ width: `${growthScore}%` }}></div>
                            </div>
                        </div>

                        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between border-t-2 border-t-rose-500">
                            <div className="flex justify-between items-center text-slate-400 mb-2">
                                <span className="text-xs font-mono">HEALTH</span>
                                <FiActivity className="text-rose-400" />
                            </div>
                            <div className="text-2xl font-bold text-white">{healthScore}%</div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-rose-500 h-full" style={{ width: `${healthScore}%` }}></div>
                            </div>
                        </div>

                        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between border-t-2 border-t-purple-500">
                            <div className="flex justify-between items-center text-slate-400 mb-2">
                                <span className="text-xs font-mono">FOCUS</span>
                                <FiClock className="text-purple-400" />
                            </div>
                            <div className="text-2xl font-bold text-white">{focusScore}%</div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-purple-500 h-full" style={{ width: `${focusScore}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROW 2.5: RECHARTS DETAILED TELEMETRY */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-amber-400">
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <FiZap className="text-amber-400" /> XP Growth ({horizon})
                        </h2>
                        <p className="text-xs text-slate-400 mb-6">Aggregate experience points gained over time.</p>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timeSeries}>
                                    <defs>
                                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="xp" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-emerald-400">
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <FiCheckSquare className="text-emerald-400" /> Task Velocity ({horizon})
                        </h2>
                        <p className="text-xs text-slate-400 mb-6">Number of milestone tasks completed per interval.</p>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={timeSeries}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', cursor: 'pointer' }} cursor={{fill: '#1e293b'}} />
                                    <Bar dataKey="tasks" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* DETAILED HORIZON LOGS TABLE */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FiCalendar className="text-indigo-400" /> Detailed {horizon.toUpperCase()} Execution Log
                            </h2>
                            <p className="text-xs text-slate-400">Complete raw database breakdown for the selected horizon.</p>
                        </div>
                        <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                            {timeSeries.length} INTERVALS LOGGED
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                                    <th className="py-3 px-4 uppercase">Period ({horizon})</th>
                                    <th className="py-3 px-4 uppercase">Tasks Completed</th>
                                    <th className="py-3 px-4 uppercase">XP Earned</th>
                                    <th className="py-3 px-4 uppercase">Velocity Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {timeSeries.slice().reverse().map((item, idx) => {
                                    const rating = item.xp >= 50 ? 'HIGH' : item.xp >= 20 ? 'MEDIUM' : 'LOW';
                                    const ratingColor = rating === 'HIGH' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : rating === 'MEDIUM' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-slate-400 bg-slate-800/40 border-slate-700/30';
                                    return (
                                        <tr key={idx} className="hover:bg-slate-800/30 transition">
                                            <td className="py-3 px-4 font-mono font-bold text-indigo-300">{item.date}</td>
                                            <td className="py-3 px-4 font-semibold text-slate-200">{item.tasks} tasks</td>
                                            <td className="py-3 px-4 font-semibold text-amber-400">+{item.xp} XP</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${ratingColor}`}>
                                                    {rating}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ROW 3: HEATMAP & AI INSIGHTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FiTrendingUp className="text-indigo-400" /> 90-Day Execution Telemetry
                                </h2>
                                <p className="text-xs text-slate-400">Activity events logged in database ActivityLogs.</p>
                            </div>
                            <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">
                                REAL TIME LOGS
                            </span>
                        </div>
                        {renderHeatmap()}
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase font-bold mb-3">
                                <FiCpu /> AI BEHAVIORAL TELEMETRY
                            </div>
                            <h3 className="text-lg font-bold text-white mb-4">PostgreSQL Data Pipeline</h3>
                            
                            <div className="space-y-3 text-xs text-slate-300">
                                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-2.5">
                                    <FiCheckCircle className="text-indigo-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-bold text-indigo-400">Tasks Completed:</span> {summary?.completedTasks || 0} / {summary?.totalTasks || 0} tasks executed.
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                                    <FiZap className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-bold text-emerald-400">Streak Record:</span> {summary?.streak || 0} active daily discipline streak.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-500 font-mono text-center">
                            Connected to Supabase PostgreSQL Pooler
                        </div>
                    </div>
                </div>

                {/* ROW 4: TROPHY ROOM & GLOBAL LEADERBOARD */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FiAward className="text-amber-400" /> Database Badges & Achievements
                                </h2>
                                <p className="text-xs text-slate-400">Badges loaded directly from PostgreSQL Badge table.</p>
                            </div>
                            <span className="text-xs font-mono text-slate-400 font-bold">
                                {badges.unlocked?.length || 0} / {badges.all?.length || 0} UNLOCKED
                            </span>
                        </div>

                        {badges.all?.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-8">
                                No badges in database yet. Click 'Sync Telemetry Data' above to initialize badges.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {badges.all?.map(badge => {
                                    const isUnlocked = badges.unlocked?.some(b => b.id === badge.id);
                                    return (
                                        <div 
                                            key={badge.id} 
                                            className={`p-4 rounded-xl border transition-all ${isUnlocked ? 'bg-indigo-600/10 border-indigo-500/40 shadow-lg shadow-indigo-500/10' : 'bg-white/5 border-white/10 opacity-40 grayscale'}`}
                                        >
                                            <div className="flex justify-center mb-3">
                                                {iconMap[badge.icon] || <FiAward className="text-indigo-400 w-7 h-7" />}
                                            </div>
                                            <h4 className="font-bold text-center text-xs text-white mb-1">{badge.name}</h4>
                                            <p className="text-[11px] text-slate-400 text-center leading-tight">{badge.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FiAward className="text-amber-400" /> Real User Leaderboard
                                </h2>
                                <p className="text-xs text-slate-400">Live rankings fetched from PostgreSQL Users table.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {leaderboard.map((lbUser, idx) => (
                                <div 
                                    key={lbUser.id} 
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${lbUser.id === user?.id ? 'bg-indigo-600/20 border border-indigo-500/50 text-white shadow-md' : 'bg-white/5 border border-white/10 text-slate-300'}`}
                                >
                                    <div className="font-mono font-bold text-slate-400 w-5 text-center text-xs">{idx + 1}</div>
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
                                        {lbUser.username[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-xs leading-tight flex items-center gap-2">
                                            {lbUser.username} {lbUser.id === user?.id && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 rounded font-mono">YOU</span>}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono">LVL {lbUser.level} • {lbUser.xp} XP</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-amber-400 flex items-center justify-end gap-1 font-mono">
                                            <FiZap /> {lbUser.current_streak}d
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
