import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheckSquare, FiSquare, FiList } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/tasks', { headers: { Authorization: `Bearer ${token}` } });
                setTasks(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const toggleTask = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`/api/tasks/${id}/toggle`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: res.data.is_completed } : t));
        } catch (err) {
            alert(err.response?.data?.message || 'Error toggling task');
        }
    };

    return (
        <div className="space-y-8 relative z-10 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="palantir-panel p-8 rounded-3xl relative overflow-hidden border border-cyan-500/20"
            >
                <div className="flex flex-col gap-2 relative z-10">
                    <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3 font-mono">
                        <FiCheckSquare className="text-emerald-400" /> Tasks
                    </h1>
                    <p className="text-slate-400 text-sm font-mono">Manage your daily tasks and to-dos.</p>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-6 rounded-3xl space-y-6"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <FiList className="text-cyan-400" /> Today's Protocol
                    </h2>
                </div>

                {loading ? (
                    <div className="text-slate-400 py-8 text-center text-sm font-mono">Loading telemetry...</div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl">
                        <p className="text-slate-400 text-sm font-mono">No tasks assigned for today. Task management coming soon.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasks.map(task => (
                            <div 
                                key={task.id} 
                                onClick={() => toggleTask(task.id)}
                                className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                                    task.is_completed 
                                    ? 'bg-emerald-950/20 border-emerald-900/50 opacity-60' 
                                    : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/50'
                                }`}
                            >
                                <div className={`text-xl ${task.is_completed ? 'text-emerald-500' : 'text-slate-500'}`}>
                                    {task.is_completed ? <FiCheckSquare /> : <FiSquare />}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold text-sm ${task.is_completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                                        {task.title}
                                    </h3>
                                    {task.Milestone && (
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-mono">
                                            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 uppercase tracking-wider text-[10px]">
                                                {task.Milestone.Challenge?.title || 'Goal'} / {task.Milestone.title}
                                            </span>
                                            {task.priority && <span className="text-amber-500">[{task.priority}]</span>}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
