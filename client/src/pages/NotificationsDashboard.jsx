import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { 
    FiBell, FiCheckCircle, FiAlertTriangle, FiZap, 
    FiUsers, FiCheck, FiX, FiClock, FiSliders, FiShield,
    FiMessageCircle, FiSend, FiAlertOctagon, FiArrowDownLeft, FiArrowUpRight, FiRefreshCw
} from 'react-icons/fi';
import BackButton from '../components/ui/BackButton';

dayjs.extend(relativeTime);

export default function NotificationsDashboard() {
    const { user } = useContext(AuthContext);
    const [filter, setFilter] = useState('all');
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Response modal state
    const [respondModal, setRespondModal] = useState(null);
    const [responseText, setResponseText] = useState('');

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchInterventions = async () => {
        try {
            const res = await axios.get('/api/friends/interventions', { headers: getAuthHeader() });
            setInterventions(res.data || []);
            // Mark sent replies as read when opening alerts page
            try { await axios.post('/api/friends/interventions/mark-read', {}, { headers: getAuthHeader() }); } catch(e) {}
        } catch (err) {
            console.error('Error fetching interventions:', err);
            setInterventions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInterventions(); }, []);

    const handleResetMilestone = async (interventionId) => {
        if (!confirm('Are you sure you want to restart this milestone back to Task 1 starting today?')) return;
        try {
            const res = await axios.post(`/api/friends/intervention/${interventionId}/reset-milestone`, {}, { headers: getAuthHeader() });
            alert(res.data?.message || 'Milestone restarted to Day 1!');
            fetchInterventions();
        } catch (err) {
            alert(err.response?.data?.message || 'Error resetting milestone');
        }
    };

    const handleRespond = async (id, status) => {
        try {
            await axios.post(`/api/friends/intervention/${id}/respond`, {
                status,
                user_response: responseText || undefined
            }, { headers: getAuthHeader() });
            setRespondModal(null);
            setResponseText('');
            fetchInterventions();
        } catch (err) {
            alert(err.response?.data?.message || 'Error responding');
        }
    };

    const markAsDismissed = async (id) => {
        try {
            await axios.post(`/api/friends/intervention/${id}/respond`, {
                status: 'dismissed'
            }, { headers: getAuthHeader() });
            fetchInterventions();
        } catch (err) {
            console.error(err);
        }
    };

    // Filter logic
    const filtered = interventions.filter(n => {
        if (filter === 'pending') return n.status === 'pending' && n.direction === 'incoming';
        if (filter === 'replies') return n.direction === 'reply';
        if (filter === 'resolved') return n.status !== 'pending';
        return true;
    });

    const pendingCount = interventions.filter(n => n.status === 'pending' && n.direction === 'incoming').length;
    const replyCount = interventions.filter(n => n.direction === 'reply').length;

    return (
        <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 md:p-8 relative overflow-hidden">
            <div className="ambient-glow top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-600/15"></div>
            <div className="ambient-glow bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10"></div>

            <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                <BackButton />

                {/* Page Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-widest mb-1">
                            <FiBell /> Alerts & Interventions
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                            <FiBell className="text-rose-400" /> Notification Center
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Inquiries, punishments, and partner replies appear here.
                        </p>
                    </div>

                    {pendingCount > 0 && (
                        <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-bold text-rose-400 flex items-center gap-2 animate-pulse">
                            <FiAlertOctagon /> {pendingCount} Pending Action{pendingCount > 1 ? 's' : ''}
                        </div>
                    )}
                </header>

                {/* Filter Tabs */}
                <div className="flex gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 w-fit flex-wrap">
                    {[
                        { key: 'all', label: `All (${interventions.length})` },
                        { key: 'pending', label: `Pending (${pendingCount})` },
                        { key: 'replies', label: `Replies (${replyCount})` },
                        { key: 'resolved', label: 'Resolved' }
                    ].map(f => (
                        <button 
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f.key ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Notifications Feed */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="w-10 h-10 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500 text-sm">Loading alerts...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-2xl border border-slate-800">
                        <FiBell className="w-12 h-12 mx-auto mb-4 text-slate-700" />
                        <p className="text-slate-500 text-sm font-semibold">
                            {filter === 'pending' ? 'No pending alerts — you\'re all caught up!' : 
                             filter === 'replies' ? 'No replies yet.' :
                             'No alerts yet. When your partner sends an inquiry or punishment, it will appear here.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(iv => {
                            const isIncoming = iv.direction === 'incoming';
                            const isReply = iv.direction === 'reply';
                            const isPending = iv.status === 'pending' && isIncoming;
                            const isPunishment = iv.type === 'punishment';
                            
                            // Determine the "other person" name
                            const otherPerson = isIncoming ? (iv.sender?.username || 'Partner') : (iv.receiver?.username || 'Partner');

                            return (
                                <div 
                                    key={`${iv.id}-${iv.direction}`}
                                    className={`p-5 rounded-2xl border transition-all ${
                                        isPending ? 'bg-rose-500/10 border-rose-500/30 shadow-md shadow-rose-500/5' : 
                                        isReply && !iv.sender_read ? 'bg-cyan-500/10 border-cyan-500/30 shadow-md shadow-cyan-500/5' :
                                        'bg-white/5 border-white/10 opacity-80'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {/* Direction badge */}
                                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold flex items-center gap-1 ${isIncoming ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                                                {isIncoming ? <><FiArrowDownLeft size={10} /> Received</> : <><FiArrowUpRight size={10} /> Reply</>}
                                            </span>
                                            {/* Type badge */}
                                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${isPunishment ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                                {isPunishment ? '⚡ Punishment' : '❓ Inquiry'}
                                            </span>
                                            {/* Status badge */}
                                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                                                iv.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                                iv.status === 'explained' ? 'bg-cyan-500/20 text-cyan-400' :
                                                iv.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                                'bg-slate-700 text-slate-400'
                                            }`}>
                                                {iv.status}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-mono">{dayjs(iv.updatedAt || iv.createdAt).fromNow()}</span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                                        <FiUsers size={12} />
                                        {isIncoming ? (
                                            <span>From <span className="text-white font-bold">{otherPerson}</span></span>
                                        ) : (
                                            <span><span className="text-white font-bold">{otherPerson}</span> replied to your {iv.type}</span>
                                        )}
                                        {iv.item_title && (
                                            <>
                                                <span>•</span>
                                                <span>About <span className="text-cyan-400 font-semibold">{iv.item_title}</span></span>
                                            </>
                                        )}
                                    </div>

                                    {iv.message && (
                                        <div className="p-3 bg-white/5 rounded-xl text-sm text-slate-300 mb-3">
                                            "{iv.message}"
                                        </div>
                                    )}

                                    {iv.punishment && (
                                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-300 mb-3 flex items-start gap-2">
                                            <FiZap className="text-rose-400 mt-0.5 shrink-0" />
                                            <span><strong>Punishment:</strong> {iv.punishment}</span>
                                        </div>
                                    )}

                                    {iv.user_response && (
                                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-300 mb-3 flex items-start gap-2">
                                            <FiMessageCircle className="text-emerald-400 mt-0.5 shrink-0" />
                                            <span><strong>{isReply ? `${otherPerson}'s response` : 'Your response'}:</strong> {iv.user_response}</span>
                                        </div>
                                    )}

                                    {isPending && (
                                        <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                                            <button 
                                                onClick={() => handleResetMilestone(iv.id)}
                                                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-rose-600/20"
                                                title="Restart this milestone's tasks starting from Day 1"
                                            >
                                                <FiRefreshCw size={12} /> Start Over Task 1 (Reset Milestone)
                                            </button>
                                            <button 
                                                onClick={() => { setRespondModal(iv); setResponseText(''); }}
                                                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                                            >
                                                <FiSend size={12} /> {isPunishment ? 'Mark Completed' : 'Explain / Respond'}
                                            </button>
                                            <button 
                                                onClick={() => markAsDismissed(iv.id)}
                                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold transition-all"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Response Modal */}
            {respondModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="glass-panel max-w-lg w-full p-6 rounded-3xl border border-slate-700 shadow-2xl relative">
                        <button onClick={() => setRespondModal(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white text-xl">
                            <FiX />
                        </button>

                        <h3 className="text-xl font-bold mb-1 text-white flex items-center gap-2">
                            <FiMessageCircle className="text-indigo-400" />
                            {respondModal.type === 'punishment' ? 'Complete Punishment' : 'Respond to Inquiry'}
                        </h3>
                        <p className="text-xs text-slate-400 mb-2">
                            From <strong className="text-white">{respondModal.sender?.username}</strong> about <strong className="text-cyan-400">{respondModal.item_title}</strong>
                        </p>

                        {respondModal.message && (
                            <div className="p-3 bg-white/5 rounded-xl text-sm text-slate-300 mb-4">"{respondModal.message}"</div>
                        )}
                        {respondModal.punishment && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-300 mb-4">
                                ⚡ {respondModal.punishment}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Your Response</label>
                            <textarea 
                                rows={3}
                                value={responseText}
                                onChange={e => setResponseText(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm resize-none"
                                placeholder={respondModal.type === 'punishment' ? 'Describe how you completed the punishment...' : 'Explain why you skipped...'}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setRespondModal(null)} 
                                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleRespond(respondModal.id, respondModal.type === 'punishment' ? 'completed' : 'explained')}
                                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
                            >
                                <FiCheck size={14} /> {respondModal.type === 'punishment' ? 'Mark as Completed' : 'Submit Explanation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
