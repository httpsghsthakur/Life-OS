import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiTarget, FiArrowRight, FiTrash2 } from 'react-icons/fi';
import dayjs from 'dayjs';
import BackButton from '../components/ui/BackButton';

export default function Challenges() {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const fetchChallenges = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/challenges', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChallenges(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const handleDeleteChallenge = async (id, title, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm(`Are you sure you want to delete the goal "${title}"? This cannot be undone.`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/challenges/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Goal deleted successfully!');
                fetchChallenges();
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Failed to delete goal.');
            }
        }
    };

    return (
        <div className="min-h-screen p-8 text-slate-100 font-sans">
            <BackButton />
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Your Challenges & Goals</h1>
                    <p className="text-slate-400">Build discipline through consistent effort.</p>
                </div>
                <Link to="/challenges/new" className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20">
                    <FiPlus /> New Goal
                </Link>
            </header>

            {loading ? (
                <div className="text-slate-500 py-12 text-center">Loading challenges...</div>
            ) : challenges.length === 0 ? (
                <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <FiTarget size={32} />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-white">No Active Goals</h2>
                    <p className="text-slate-400 mb-6">You haven't started any goals or challenges yet. Begin your journey today.</p>
                    <Link to="/challenges/new" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition">
                        <FiPlus /> Create First Goal
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map(challenge => (
                        <div key={challenge.id} className="relative group">
                            <Link to={`/challenges/${challenge.id}`}>
                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    className="glass-panel p-6 rounded-2xl cursor-pointer border border-slate-800 hover:border-indigo-500/50 transition-all shadow-lg"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: `${challenge.color || '#4F46E5'}20`, color: challenge.color || '#818CF8' }}>
                                                <FiTarget size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition">{challenge.title}</h3>
                                                <span className="text-xs px-2 py-0.5 bg-white/10 rounded-md text-slate-300 uppercase tracking-wider font-mono">{challenge.category || 'General'}</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={(e) => handleDeleteChallenge(challenge.id, challenge.title, e)}
                                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors z-20"
                                            title="Delete Goal"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3 mb-6 font-mono text-xs">
                                        <div className="flex justify-between text-slate-400">
                                            <span>Milestones</span>
                                            <span className="font-bold text-white">{challenge.milestones?.length || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400">
                                            <span>Days Remaining</span>
                                            <span className="font-bold text-white">{dayjs(challenge.end_date).diff(dayjs(), 'day')} days</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-cyan-400 text-sm font-semibold gap-1 group">
                                        View Progress & Roadmap <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
