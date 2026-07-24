import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTarget, FiActivity, FiTerminal, FiBookOpen, FiX } from 'react-icons/fi';

export default function FloatingActionMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const actions = [
        { id: 'goal', label: 'New Goal Sprint', icon: <FiTarget className="text-indigo-400" />, action: () => { navigate('/challenges/new'); setIsOpen(false); } },
        { id: 'gym', label: 'Log Gym Session', icon: <FiActivity className="text-rose-400" />, action: () => { navigate('/gym'); setIsOpen(false); } },
        { id: 'dev', label: 'Log Coding Uptime', icon: <FiTerminal className="text-emerald-400" />, action: () => { navigate('/dev'); setIsOpen(false); } },
        { id: 'study', label: 'Exam Focus Mode', icon: <FiBookOpen className="text-cyan-400" />, action: () => { navigate('/exams'); setIsOpen(false); } },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="mb-3 space-y-2 flex flex-col items-end"
                    >
                        {actions.map((act) => (
                            <button
                                key={act.id}
                                onClick={act.action}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass-panel border border-white/10 text-xs font-semibold text-slate-200 hover:text-white shadow-xl hover:border-indigo-500/40 transition-all transform hover:scale-105"
                            >
                                <span>{act.label}</span>
                                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                    {act.icon}
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/30 hover:scale-105 transition-all ${isOpen ? 'rotate-45' : ''}`}
                title="Quick Create Menu"
            >
                {isOpen ? <FiX size={24} /> : <FiPlus size={24} />}
            </button>
        </div>
    );
}
