import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiUserPlus, FiUsers, FiCheck, FiClock, FiUserCheck, FiUserX, FiBell, FiEye } from 'react-icons/fi';
import BackButton from '../components/ui/BackButton';

export default function Friends() {
    const [friends, setFriends] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchFriendsAndUsers = async (query = '') => {
        try {
            const [friendsRes, usersRes, pendingRes] = await Promise.all([
                axios.get('/api/friends', { headers: getAuthHeader() }),
                axios.get(`/api/friends/search?q=${query}`, { headers: getAuthHeader() }),
                axios.get('/api/friends/pending', { headers: getAuthHeader() }).catch(() => ({ data: [] }))
            ]);
            setFriends(friendsRes.data || []);
            setAllUsers(usersRes.data || []);
            setPendingRequests(pendingRes.data || []);
        } catch (err) { 
            console.error('Error fetching friends data:', err); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { 
        fetchFriendsAndUsers(); 
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        fetchFriendsAndUsers(value);
    };

    const sendRequest = async (friend_id) => {
        try {
            await axios.post('/api/friends/request', { friend_id }, { headers: getAuthHeader() });
            alert("Friend request sent!");
            fetchFriendsAndUsers(search);
        } catch (err) { 
            alert(err.response?.data?.message || "Error sending friend request"); 
        }
    };

    const acceptRequest = async (requestId) => {
        try {
            await axios.post(`/api/friends/accept/${requestId}`, {}, { headers: getAuthHeader() });
            alert("Friend request accepted! You are now accountability partners.");
            fetchFriendsAndUsers(search);
        } catch (err) {
            alert(err.response?.data?.message || "Error accepting request");
        }
    };

    const rejectRequest = async (requestId) => {
        try {
            await axios.post(`/api/friends/reject/${requestId}`, {}, { headers: getAuthHeader() });
            fetchFriendsAndUsers(search);
        } catch (err) {
            alert(err.response?.data?.message || "Error rejecting request");
        }
    };

    const handleConnectDemoPartner = async () => {
        try {
            const res = await axios.post('/api/friends/connect-demo', {}, { headers: getAuthHeader() });
            alert(res.data?.message || 'Demo partner connected!');
            fetchFriendsAndUsers(search);
        } catch (err) {
            alert(err.response?.data?.message || 'Error connecting demo partner');
        }
    };

    return (
        <div className="min-h-screen p-8 max-w-5xl mx-auto text-slate-100 font-sans">
            <BackButton />
            
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Accountability Partners</h1>
                    <p className="text-slate-400">Discipline is stronger when shared. Connect with registered LifeOS users.</p>
                </div>

                <button 
                    onClick={handleConnectDemoPartner}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-amber-600/20 flex items-center gap-2 shrink-0"
                >
                    ✨ Auto-Connect Demo Partner (@alex_partner)
                </button>
            </header>

            {/* Pending Requests Banner */}
            {pendingRequests.length > 0 && (
                <div className="mb-8 glass-panel p-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 shadow-lg shadow-amber-950/30">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                            <FiBell className="animate-bounce" /> Incoming Friend Requests ({pendingRequests.length})
                        </h2>
                        <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-2.5 py-1 rounded-full font-bold">
                            Action Needed
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingRequests.map(req => {
                            const u = req.requester || {};
                            return (
                                <div key={req.id} className="flex justify-between items-center p-4 bg-slate-900/90 border border-amber-500/30 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold uppercase">
                                            {u.username ? u.username[0] : 'U'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-white">{u.username}</div>
                                            <div className="text-xs text-slate-400">Level {u.level || 1} • {u.xp || 0} XP</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => acceptRequest(req.id)}
                                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-md shadow-emerald-600/20"
                                        >
                                            <FiCheck /> Accept
                                        </button>
                                        <button 
                                            onClick={() => rejectRequest(req.id)}
                                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold rounded-lg transition-all"
                                        >
                                            <FiUserX />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Registered Users & Search */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            <FiSearch className="text-cyan-400" /> All Registered Users
                        </h2>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-mono font-semibold">
                            {allUsers.length} Users
                        </span>
                    </div>

                    <div className="relative mb-6">
                        <input 
                            type="text" 
                            placeholder="Filter users by username..." 
                            value={search} 
                            onChange={handleSearchChange}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 text-white text-sm"
                        />
                        {search && (
                            <button 
                                onClick={() => { setSearch(''); fetchFriendsAndUsers(''); }} 
                                className="absolute right-3 top-3 text-slate-500 hover:text-white text-xs"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                        {loading ? (
                            <div className="text-center py-8 text-slate-500">Loading registered accounts...</div>
                        ) : allUsers.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-sm">No registered users found.</div>
                        ) : (
                            allUsers.map(u => (
                                <div key={u.id} className="flex justify-between items-center p-3.5 bg-slate-900/80 border border-slate-800/80 rounded-xl hover:border-cyan-500/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold uppercase">
                                            {u.username ? u.username[0] : 'U'}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-white">{u.username}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-2">
                                                <span className="text-cyan-400 font-bold">Lvl {u.level || 1}</span>
                                                <span>•</span>
                                                <span>{u.xp || 0} XP</span>
                                            </div>
                                        </div>
                                    </div>

                                    {u.relationshipStatus === 'accepted' ? (
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-lg flex items-center gap-1">
                                            <FiUserCheck /> Partner
                                        </span>
                                    ) : u.relationshipStatus === 'pending' ? (
                                        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold rounded-lg flex items-center gap-1">
                                            <FiClock /> Pending
                                        </span>
                                    ) : (
                                        <button 
                                            onClick={() => sendRequest(u.id)} 
                                            className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                                        >
                                            <FiUserPlus /> Add Partner
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* My Circle / Added Friends */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            <FiUsers className="text-indigo-400" /> Your Circle
                        </h2>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-mono font-semibold">
                            {friends.length} Partners
                        </span>
                    </div>

                    {loading ? (
                        <div className="text-center py-8 text-slate-500">Loading your circle...</div>
                    ) : friends.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-400 text-sm">
                            <FiUsers className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                            <p>You have no accountability partners added yet.</p>
                            <p className="text-xs text-slate-500 mt-1">Click "Add Partner" next to any registered user on the left!</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                            {friends.map(f => (
                                <div key={f.id} className="flex items-center justify-between p-3.5 bg-slate-900/80 border border-slate-800/80 rounded-xl hover:border-indigo-500/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold uppercase">
                                            {f.username ? f.username[0] : 'U'}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-white">{f.username}</div>
                                            <div className="text-xs text-slate-400">Level {f.level || 1} Accountability Partner</div>
                                        </div>
                                    </div>
                                    <Link 
                                        to={`/friends/${f.id}`}
                                        className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                                    >
                                        <FiEye size={12} /> View Dashboard
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
