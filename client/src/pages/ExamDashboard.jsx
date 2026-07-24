import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiPlayCircle } from 'react-icons/fi';
import dayjs from 'dayjs';
import BackButton from '../components/ui/BackButton';

export default function ExamDashboard() {
    const navigate = useNavigate();
    const [reason, setReason] = useState('');
    const [examType, setExamType] = useState('Semester');
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().add(14, 'day').format('YYYY-MM-DD'));

    const activateExam = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/exams/activate', {
                reason,
                exam_type: examType,
                start_date: startDate,
                end_date: endDate
            });
            // Force reload to update user context and trigger Exam Shield
            window.location.href = '/'; 
        } catch (err) { 
            alert('Error activating exam mode: ' + (err.response?.data?.message || err.message)); 
        }
    };

    return (
        <div className="min-h-screen bg-[#090A0F] p-8 flex flex-col items-center justify-center text-white">
            <div className="w-full max-w-lg mb-4">
                <BackButton />
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-12 rounded-3xl w-full max-w-lg border border-accent/20">
                <FiBook className="text-accent w-16 h-16 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-2 text-center text-accent">Activate Exam Mode</h2>
                <p className="text-textSecondary mb-8 text-center text-sm">
                    Enter the "Exam Shield". All active challenges, goals, and streaks will be frozen to protect your progress while you focus on studying.
                </p>

                <form onSubmit={activateExam} className="space-y-6">
                    <div>
                        <label className="block text-sm text-textSecondary mb-2 font-medium">Exam Reason</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. Semester 5 Finals"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm text-textSecondary mb-2 font-medium">Exam Type</label>
                        <select 
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                        >
                            <option value="Semester">Semester Exams</option>
                            <option value="Competitive">Competitive Exam</option>
                            <option value="School">School Finals</option>
                            <option value="Custom">Custom Prep</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-textSecondary mb-2 font-medium">Start Date</label>
                            <input 
                                type="date" 
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-textSecondary mb-2 font-medium">End Date</label>
                            <input 
                                type="date" 
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full mt-6 bg-accent hover:bg-cyan-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                        <FiPlayCircle className="w-5 h-5" /> Activate Exam Shield
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
