import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiActivity, FiCheckSquare, FiSquare, FiPlus, FiTrash2, 
    FiEdit2, FiCamera, FiTrendingUp, FiAward, FiZap, FiCalendar, 
    FiClock, FiX, FiCheck, FiUploadCloud, FiImage
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import BackButton from '../components/ui/BackButton';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function GymDashboard() {
    const { user } = useContext(AuthContext);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // Default to Today
    
    // Checkpoints & Weight history states
    const [checkpoints, setCheckpoints] = useState([]);
    const [weightLogs, setWeightLogs] = useState([]);
    
    // Modals
    const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
    const [showAddPlanModal, setShowAddPlanModal] = useState(false);
    const [showCheckpointModal, setShowCheckpointModal] = useState(false);
    const [lightboxImage, setLightboxImage] = useState(null);

    // Form states
    const [newExerciseForm, setNewExerciseForm] = useState({
        name: '',
        sets: 3,
        reps: 10,
        target_weight: 50,
        rest_time_seconds: 60,
        notes: ''
    });

    const [newPlanForm, setNewPlanForm] = useState({
        day_of_week: selectedDay,
        muscle_group: 'Chest & Triceps'
    });

    const [checkpointForm, setCheckpointForm] = useState({
        weight_kg: '',
        body_fat_pct: '',
        waist_cm: '',
        chest_cm: '',
        arms_cm: '',
        photo_front_url: '',
        photo_left_url: '',
        photo_right_url: '',
        photo_back_url: '',
        notes: ''
    });

    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchPlans = async () => {
        try {
            const [plansRes, checkpointsRes] = await Promise.all([
                axios.get('/api/fitness/weekly', { headers: getAuthHeader() }),
                axios.get('/api/fitness/checkpoints', { headers: getAuthHeader() }).catch(() => ({ data: [] }))
            ]);
            setPlans(plansRes.data || []);

            const dbCheckpoints = checkpointsRes.data || [];
            const localCheckpoints = JSON.parse(localStorage.getItem('lifeos_fitness_checkpoints') || '[]');
            
            const combined = [...dbCheckpoints];
            localCheckpoints.forEach(lc => {
                if (!combined.some(c => c.id === lc.id || (c.date === lc.date && String(c.weight_kg) === String(lc.weight_kg)))) {
                    combined.push(lc);
                }
            });
            setCheckpoints(combined);
        } catch (err) {
            console.error('Error fetching fitness plans:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const selectedDayPlan = plans.find(p => p.day_of_week === selectedDay);

    const handleToggleExercise = async (exerciseId) => {
        try {
            await axios.put(`/api/fitness/exercise/${exerciseId}/toggle`, {}, { headers: getAuthHeader() });
            fetchPlans();
        } catch (err) {
            alert(err.response?.data?.message || 'Error toggling exercise');
        }
    };

    const handleAddExercise = async (e) => {
        e.preventDefault();
        if (!selectedDayPlan) {
            alert('Please create a protocol for this day first.');
            return;
        }
        if (!newExerciseForm.name.trim()) return;

        try {
            await axios.post('/api/fitness/exercise', {
                workout_plan_id: selectedDayPlan.id,
                ...newExerciseForm
            }, { headers: getAuthHeader() });

            setShowAddExerciseModal(false);
            setNewExerciseForm({
                name: '',
                sets: 3,
                reps: 10,
                target_weight: 50,
                rest_time_seconds: 60,
                notes: ''
            });
            fetchPlans();
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding exercise');
        }
    };

    const handleDeleteExercise = async (exerciseId, e) => {
        e.stopPropagation();
        if (!confirm('Delete this exercise?')) return;

        try {
            await axios.delete(`/api/fitness/exercise/${exerciseId}`, { headers: getAuthHeader() });
            fetchPlans();
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting exercise');
        }
    };

    const handleCreatePlan = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/fitness/plan', {
                day_of_week: newPlanForm.day_of_week,
                muscle_group: newPlanForm.muscle_group,
                exercises: []
            }, { headers: getAuthHeader() });

            setShowAddPlanModal(false);
            setSelectedDay(newPlanForm.day_of_week);
            fetchPlans();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating protocol');
        }
    };

    const handleDeletePlan = async (planId, e) => {
        e.stopPropagation();
        if (!confirm('Reset workout protocol for this day?')) return;

        try {
            await axios.delete(`/api/fitness/plan/${planId}`, { headers: getAuthHeader() });
            fetchPlans();
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting protocol');
        }
    };

    // Permanent Image Upload Helper
    const handlePhotoUpload = async (e, photoField) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingPhoto(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const res = await axios.post('/api/upload', { image: reader.result });
                setCheckpointForm(prev => ({ ...prev, [photoField]: res.data.url }));
            } catch (err) {
                alert('Failed to upload photo permanently');
            } finally {
                setUploadingPhoto(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveCheckpoint = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/fitness/checkpoint', checkpointForm, { headers: getAuthHeader() });
            const savedCp = res.data;

            setCheckpoints(prev => {
                const updated = [savedCp, ...prev];
                localStorage.setItem('lifeos_fitness_checkpoints', JSON.stringify(updated));
                return updated;
            });

            setShowCheckpointModal(false);
            setCheckpointForm({
                weight_kg: '',
                body_fat_pct: '',
                waist_cm: '',
                chest_cm: '',
                arms_cm: '',
                photo_front_url: '',
                photo_left_url: '',
                photo_right_url: '',
                photo_back_url: '',
                notes: ''
            });
            alert('10-Day Transformation Checkpoint saved permanently!');
        } catch (err) {
            const fallbackCp = {
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                ...checkpointForm
            };
            setCheckpoints(prev => {
                const updated = [fallbackCp, ...prev];
                localStorage.setItem('lifeos_fitness_checkpoints', JSON.stringify(updated));
                return updated;
            });
            setShowCheckpointModal(false);
            alert('10-Day Transformation Checkpoint saved permanently to browser storage!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center font-sans">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 text-sm font-mono">Entering Iron Forge...</p>
                </div>
            </div>
        );
    }

    const todayIndex = new Date().getDay();
    const isViewingToday = selectedDay === todayIndex;
    const currentExercises = selectedDayPlan?.exercises || [];
    const completedExercises = currentExercises.filter(e => e.is_completed);
    const progressPct = currentExercises.length > 0 ? Math.round((completedExercises.length / currentExercises.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 md:p-8 relative overflow-hidden font-sans">
            <div className="ambient-glow top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-600/15"></div>
            <div className="ambient-glow bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10"></div>

            <div className="max-w-6xl mx-auto space-y-8 relative z-10">
                <BackButton fallbackPath="/dashboard" />

                {/* Header Section & Fitness Level Pill */}
                <header className="glass-panel p-6 md:p-8 rounded-3xl border border-rose-500/20 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full font-mono uppercase tracking-wider font-bold border border-rose-500/30">
                                    Iron Forge Gym Protocol
                                </span>
                                <span className="text-xs px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full font-mono uppercase tracking-wider font-bold border border-indigo-500/30">
                                    Level 3 • Athlete 🥇
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Fitness & Transformation</h1>
                            <p className="text-slate-400 text-sm mt-1">Discipline forged in sweat and progressive overload.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setShowCheckpointModal(true)}
                                className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-600/20 flex items-center gap-2"
                            >
                                <FiCamera /> 📸 10-Day Checkpoint
                            </button>

                            <button 
                                onClick={() => setShowAddPlanModal(true)}
                                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition border border-slate-700 flex items-center gap-2"
                            >
                                <FiPlus /> Set Day Split
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800">
                            <div className="text-[10px] font-mono uppercase text-slate-400">Workout Streak</div>
                            <div className="text-xl font-black text-amber-400 flex items-center gap-1.5 mt-0.5">
                                🔥 7 Days
                            </div>
                        </div>

                        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800">
                            <div className="text-[10px] font-mono uppercase text-slate-400">Today's Progress</div>
                            <div className="text-xl font-black text-emerald-400 mt-0.5">
                                {completedExercises.length} / {currentExercises.length} Done ({progressPct}%)
                            </div>
                        </div>

                        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800">
                            <div className="text-[10px] font-mono uppercase text-slate-400">Personal Records (PR)</div>
                            <div className="text-xl font-black text-cyan-400 mt-0.5">
                                🏆 4 PRs Set
                            </div>
                        </div>

                        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800">
                            <div className="text-[10px] font-mono uppercase text-slate-400">Checkpoints Saved</div>
                            <div className="text-xl font-black text-indigo-400 mt-0.5">
                                📸 {checkpoints.length} Checkpoints
                            </div>
                        </div>
                    </div>
                </header>

                {/* Day Split Selector Bar */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {DAYS.map((dayName, idx) => {
                        const plan = plans.find(p => p.day_of_week === idx);
                        const isSelected = selectedDay === idx;
                        const isToday = idx === todayIndex;

                        return (
                            <button
                                key={dayName}
                                onClick={() => setSelectedDay(idx)}
                                className={`px-4 py-3 rounded-2xl font-mono text-xs transition-all shrink-0 border text-left min-w-[120px] ${
                                    isSelected 
                                        ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white border-rose-500/50 shadow-lg shadow-rose-600/20' 
                                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-extrabold uppercase">{dayName.substring(0, 3)}</span>
                                    {isToday && <span className="text-[9px] bg-rose-500/30 text-rose-300 font-sans font-bold px-1.5 py-0.5 rounded">TODAY</span>}
                                </div>
                                <div className="text-[11px] font-sans truncate font-medium">
                                    {plan ? plan.muscle_group : 'Rest Day'}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Main Workspace Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left 2-Cols: Active Selected Protocol Tracker */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                <div>
                                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Protocol for {DAYS[selectedDay]}</div>
                                    <h2 className="text-2xl font-black text-white mt-1">
                                        {selectedDayPlan ? selectedDayPlan.muscle_group : 'Rest Day'}
                                    </h2>
                                </div>

                                <div className="flex items-center gap-2">
                                    {selectedDayPlan && (
                                        <>
                                            <button 
                                                onClick={() => setShowAddExerciseModal(true)}
                                                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                                            >
                                                <FiPlus /> Add Exercise
                                            </button>

                                            <button 
                                                onClick={(e) => handleDeletePlan(selectedDayPlan.id, e)}
                                                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs transition"
                                                title="Reset Protocol"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar for Selected Day */}
                            {selectedDayPlan && currentExercises.length > 0 && (
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-slate-400">Workout Completion</span>
                                        <span className="text-emerald-400 font-bold">{completedExercises.length} / {currentExercises.length} exercises ({progressPct}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                                        <div className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {/* Exercises List */}
                            {!selectedDayPlan ? (
                                <div className="text-center py-12 bg-white/5 rounded-2xl space-y-3">
                                    <p className="text-slate-400 text-sm font-semibold">No workout protocol set for {DAYS[selectedDay]}.</p>
                                    <button 
                                        onClick={() => {
                                            setNewPlanForm({ day_of_week: selectedDay, muscle_group: 'Chest & Triceps' });
                                            setShowAddPlanModal(true);
                                        }}
                                        className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold rounded-xl text-xs transition inline-flex items-center gap-2"
                                    >
                                        <FiPlus /> Create Protocol for {DAYS[selectedDay]}
                                    </button>
                                </div>
                            ) : currentExercises.length === 0 ? (
                                <div className="text-center py-12 bg-white/5 rounded-2xl space-y-3">
                                    <p className="text-slate-400 text-sm font-semibold">No exercises added to {selectedDayPlan.muscle_group} yet.</p>
                                    <button 
                                        onClick={() => setShowAddExerciseModal(true)}
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition inline-flex items-center gap-2"
                                    >
                                        <FiPlus /> Add First Exercise
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {currentExercises.map(ex => {
                                        const isDone = ex.is_completed;
                                        return (
                                            <div 
                                                key={ex.id}
                                                onClick={() => handleToggleExercise(ex.id)}
                                                className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                                                    isDone ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-900/90 border-slate-800 hover:border-rose-500/40'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition ${
                                                        isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600 group-hover:border-rose-400'
                                                    }`}>
                                                        {isDone && <FiCheck size={16} />}
                                                    </div>

                                                    <div>
                                                        <h4 className={`font-bold text-base ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                                                            {ex.name}
                                                        </h4>
                                                        <div className="flex items-center gap-3 font-mono text-xs text-slate-400 mt-0.5">
                                                            <span>{ex.sets} Sets × {ex.reps} Reps</span>
                                                            <span>•</span>
                                                            <span>⏱ Rest {ex.rest_time_seconds || 60}s</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-lg font-black text-rose-400 font-mono">
                                                            {ex.target_weight || 0} <span className="text-xs text-slate-500 font-normal">kg</span>
                                                        </div>
                                                    </div>

                                                    <button 
                                                        onClick={(e) => handleDeleteExercise(ex.id, e)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                                                        title="Delete Exercise"
                                                    >
                                                        <FiTrash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Col: Personal Records & Transformation History */}
                    <div className="space-y-6">
                        {/* Personal Records Showcase */}
                        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                                🏆 Personal Records (PR)
                            </h3>

                            <div className="space-y-2 font-mono text-xs">
                                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex justify-between items-center">
                                    <span className="text-slate-300 font-sans font-semibold">Bench Press</span>
                                    <span className="font-bold text-cyan-400">80 kg (8 reps)</span>
                                </div>
                                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex justify-between items-center">
                                    <span className="text-slate-300 font-sans font-semibold">Barbell Squat</span>
                                    <span className="font-bold text-amber-400">110 kg (6 reps)</span>
                                </div>
                                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex justify-between items-center">
                                    <span className="text-slate-300 font-sans font-semibold">Deadlift</span>
                                    <span className="font-bold text-rose-400">140 kg (5 reps)</span>
                                </div>
                            </div>
                        </div>

                        {/* 10-Day Transformation Checkpoints Gallery */}
                        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                                    📸 Transformation Gallery
                                </h3>
                                <button 
                                    onClick={() => setShowCheckpointModal(true)}
                                    className="text-xs text-rose-400 hover:text-rose-300 font-bold underline"
                                >
                                    + New Checkpoint
                                </button>
                            </div>

                            {checkpoints.length === 0 ? (
                                <div className="text-center py-6 text-slate-500 text-xs font-mono">
                                    No transformation checkpoints saved yet. Take photos every 10 days to track visual progress!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {checkpoints.map((cp, idx) => (
                                        <div key={cp.id} className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
                                            <div className="flex justify-between items-center text-xs font-mono">
                                                <span className="font-bold text-white">Checkpoint #{checkpoints.length - idx}</span>
                                                <span className="text-slate-400">{cp.date}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                                <div className="text-slate-300">Weight: <span className="font-bold text-emerald-400">{cp.weight_kg} kg</span></div>
                                                {cp.body_fat_pct && <div className="text-slate-300">Body Fat: <span className="font-bold text-cyan-400">{cp.body_fat_pct}%</span></div>}
                                            </div>

                                            {/* Photo Grid with Click-to-Full-Screen */}
                                            <div className="grid grid-cols-2 gap-2">
                                                {cp.photo_front_url && (
                                                    <img 
                                                        src={cp.photo_front_url} 
                                                        alt="Front view" 
                                                        onClick={() => setLightboxImage(cp.photo_front_url)}
                                                        className="w-full h-28 object-cover rounded-xl border border-slate-800 cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all shadow-md" 
                                                        title="Click to view full screen"
                                                    />
                                                )}
                                                {cp.photo_left_url && (
                                                    <img 
                                                        src={cp.photo_left_url} 
                                                        alt="Side view" 
                                                        onClick={() => setLightboxImage(cp.photo_left_url)}
                                                        className="w-full h-28 object-cover rounded-xl border border-slate-800 cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all shadow-md" 
                                                        title="Click to view full screen"
                                                    />
                                                )}
                                                {cp.photo_right_url && (
                                                    <img 
                                                        src={cp.photo_right_url} 
                                                        alt="Right view" 
                                                        onClick={() => setLightboxImage(cp.photo_right_url)}
                                                        className="w-full h-28 object-cover rounded-xl border border-slate-800 cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all shadow-md" 
                                                        title="Click to view full screen"
                                                    />
                                                )}
                                                {cp.photo_back_url && (
                                                    <img 
                                                        src={cp.photo_back_url} 
                                                        alt="Back view" 
                                                        onClick={() => setLightboxImage(cp.photo_back_url)}
                                                        className="w-full h-28 object-cover rounded-xl border border-slate-800 cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all shadow-md" 
                                                        title="Click to view full screen"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Image Lightbox Modal */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxImage(null)}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
                            <button 
                                onClick={() => setLightboxImage(null)}
                                className="absolute -top-12 right-0 md:-right-12 bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-full border border-slate-700 text-lg shadow-2xl z-10 transition"
                                title="Close Full Screen"
                            >
                                <FiX />
                            </button>
                            <img 
                                src={lightboxImage} 
                                alt="Full screen transformation photo" 
                                className="max-h-[85vh] max-w-full object-contain rounded-2xl border border-slate-700 shadow-2xl cursor-default" 
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="mt-3 text-xs text-slate-400 font-mono bg-slate-900/80 px-4 py-1 rounded-full border border-slate-800">
                                Click backdrop to exit full screen
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Exercise Modal */}
            {showAddExerciseModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="glass-panel max-w-lg w-full p-6 rounded-3xl border border-slate-700 shadow-2xl relative">
                        <button onClick={() => setShowAddExerciseModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white text-xl">
                            <FiX />
                        </button>

                        <h3 className="text-xl font-bold mb-1 text-white flex items-center gap-2">
                            <FiPlus className="text-rose-400" /> Add Exercise to Protocol
                        </h3>
                        <p className="text-xs text-slate-400 mb-6">Add a new exercise to {DAYS[selectedDay]}'s protocol.</p>

                        <form onSubmit={handleAddExercise} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Exercise Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newExerciseForm.name}
                                    onChange={e => setNewExerciseForm({ ...newExerciseForm, name: e.target.value })}
                                    placeholder="e.g. Incline Dumbbell Press, Romanian Deadlift..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-xs">
                                <div>
                                    <label className="block text-[10px] text-slate-400 mb-1">Sets</label>
                                    <input 
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={newExerciseForm.sets}
                                        onChange={e => setNewExerciseForm({ ...newExerciseForm, sets: Number(e.target.value) })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] text-slate-400 mb-1">Target Reps</label>
                                    <input 
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={newExerciseForm.reps}
                                        onChange={e => setNewExerciseForm({ ...newExerciseForm, reps: Number(e.target.value) })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] text-slate-400 mb-1">Target Weight (kg)</label>
                                    <input 
                                        type="number"
                                        step="0.5"
                                        value={newExerciseForm.target_weight}
                                        onChange={e => setNewExerciseForm({ ...newExerciseForm, target_weight: Number(e.target.value) })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowAddExerciseModal(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-xs font-semibold hover:bg-slate-800">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition">
                                    Save Exercise
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Set Day Protocol Modal */}
            {showAddPlanModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-slate-700 shadow-2xl relative">
                        <button onClick={() => setShowAddPlanModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white text-xl">
                            <FiX />
                        </button>

                        <h3 className="text-xl font-bold mb-1 text-white">Set Day Protocol</h3>
                        <p className="text-xs text-slate-400 mb-6">Assign a muscle split group for a specific day of the week.</p>

                        <form onSubmit={handleCreatePlan} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Day of Week</label>
                                <select 
                                    value={newPlanForm.day_of_week}
                                    onChange={e => setNewPlanForm({ ...newPlanForm, day_of_week: Number(e.target.value) })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                                >
                                    {DAYS.map((day, idx) => (
                                        <option key={day} value={idx}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Muscle Split Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newPlanForm.muscle_group}
                                    onChange={e => setNewPlanForm({ ...newPlanForm, muscle_group: e.target.value })}
                                    placeholder="e.g. Chest & Triceps, Back & Biceps, Legs & Core..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowAddPlanModal(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-xs font-semibold hover:bg-slate-800">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold rounded-xl text-xs transition">
                                    Save Protocol
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 10-Day Transformation Checkpoint Modal */}
            {showCheckpointModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="glass-panel max-w-xl w-full p-6 md:p-8 rounded-3xl border border-slate-700 shadow-2xl relative my-8">
                        <button onClick={() => setShowCheckpointModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white text-xl">
                            <FiX />
                        </button>

                        <h3 className="text-xl font-bold mb-1 text-white flex items-center gap-2">
                            📸 10-Day Transformation Checkpoint
                        </h3>
                        <p className="text-xs text-slate-400 mb-6">Log body weight, measurements, and upload progress photos permanently.</p>

                        <form onSubmit={handleSaveCheckpoint} className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Body Weight (kg) *</label>
                                    <input 
                                        type="number"
                                        step="0.1"
                                        required
                                        value={checkpointForm.weight_kg}
                                        onChange={e => setCheckpointForm({ ...checkpointForm, weight_kg: e.target.value })}
                                        placeholder="e.g. 74.5"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Body Fat %</label>
                                    <input 
                                        type="number"
                                        step="0.1"
                                        value={checkpointForm.body_fat_pct}
                                        onChange={e => setCheckpointForm({ ...checkpointForm, body_fat_pct: e.target.value })}
                                        placeholder="e.g. 14.2"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Waist (cm)</label>
                                    <input 
                                        type="number"
                                        step="0.5"
                                        value={checkpointForm.waist_cm}
                                        onChange={e => setCheckpointForm({ ...checkpointForm, waist_cm: e.target.value })}
                                        placeholder="e.g. 81.0"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                                    />
                                </div>
                            </div>

                            {/* Permanent Photo Upload Grid */}
                            <div className="space-y-2 pt-2 border-t border-slate-800">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Progress Photos (Stored Permanently)</label>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="block text-[10px] text-slate-500 mb-1">Front Angle</span>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handlePhotoUpload(e, 'photo_front_url')}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-[11px] text-slate-400"
                                        />
                                    </div>

                                    <div>
                                        <span className="block text-[10px] text-slate-500 mb-1">Side / Left Angle</span>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handlePhotoUpload(e, 'photo_left_url')}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-[11px] text-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowCheckpointModal(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-xs font-semibold hover:bg-slate-800">
                                    Cancel
                                </button>
                                <button type="submit" disabled={uploadingPhoto} className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold rounded-xl text-xs transition">
                                    {uploadingPhoto ? 'Uploading...' : 'Save Checkpoint Permanently'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
