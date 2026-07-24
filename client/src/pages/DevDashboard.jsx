import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiTerminal, FiGithub, FiCode, FiPlus, FiCpu } from 'react-icons/fi';
import BackButton from '../components/ui/BackButton';

export default function DevDashboard() {
    const [profile, setProfile] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState('');

    const fetchDevData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/dev/profile', { headers: { Authorization: `Bearer ${token}` } });
            setProfile(res.data.profile);
            setSkills(res.data.skills);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchDevData(); }, []);

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkill) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/dev/skills', { name: newSkill }, { headers: { Authorization: `Bearer ${token}` } });
            setNewSkill('');
            fetchDevData();
        } catch (err) { console.error(err); }
    };

    const addXP = async (skill_id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/dev/skills/${skill_id}/xp`, { xp_gained: 50 }, { headers: { Authorization: `Bearer ${token}` } });
            fetchDevData();
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="min-h-screen p-8 text-green-400 font-mono">Initializing System...</div>;

    return (
        <div className="min-h-screen p-8 max-w-6xl mx-auto font-mono text-green-400 bg-black">
            <BackButton />
            <header className="flex justify-between items-center mb-12 border-b border-green-500/30 pb-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3"><FiTerminal /> SYS.DEV</h1>
                    <p className="text-green-600/80">root@lifeos:~# ./run_skill_tree.sh</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold">{profile.total_hours_coded} hrs</div>
                    <div className="text-green-600 text-sm">TOTAL UPTIME</div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profiles & Stats */}
                <div className="space-y-6">
                    <div className="border border-green-500/30 p-6 rounded-lg bg-green-950/20">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FiGithub /> Integrations</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-green-600 block mb-1">GITHUB_USER</label>
                                <input type="text" defaultValue={profile.github_username || ''} placeholder="Not linked" className="w-full bg-black border border-green-500/30 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-400" />
                            </div>
                            <div>
                                <label className="text-xs text-green-600 block mb-1">LEETCODE_USER</label>
                                <input type="text" defaultValue={profile.leetcode_username || ''} placeholder="Not linked" className="w-full bg-black border border-green-500/30 rounded px-3 py-2 text-green-400 focus:outline-none focus:border-green-400" />
                            </div>
                            <button className="w-full mt-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/50 py-2 rounded transition-colors">
                                SYNC DATA
                            </button>
                        </div>
                    </div>

                    <div className="border border-green-500/30 p-6 rounded-lg bg-green-950/20">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FiCode /> Daily Grind</h2>
                        <p className="text-sm text-green-600 mb-4">Target: {profile.daily_coding_goal_hours} hrs</p>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const token = localStorage.getItem('token');
                                await axios.post('/api/dev/log-hours', { hours: e.target.hours.value }, { headers: { Authorization: `Bearer ${token}` } });
                                e.target.reset();
                                fetchDevData();
                            } catch(err){}
                        }} className="flex gap-2">
                            <input name="hours" type="number" step="0.5" required placeholder="Hours..." className="w-full bg-black border border-green-500/30 rounded px-3 py-2 focus:outline-none focus:border-green-400" />
                            <button type="submit" className="bg-green-500 text-black px-4 font-bold rounded hover:bg-green-400">LOG</button>
                        </form>
                    </div>
                </div>

                {/* Skill Tree */}
                <div className="lg:col-span-2 border border-green-500/30 p-6 rounded-lg bg-green-950/20">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><FiCpu /> SKILL_TREE</h2>
                        <form onSubmit={handleAddSkill} className="flex gap-2">
                            <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="New tech..." className="bg-black border border-green-500/30 rounded px-3 py-1 focus:outline-none focus:border-green-400 text-sm" />
                            <button type="submit" className="bg-green-500/20 text-green-400 px-2 rounded hover:bg-green-500/40"><FiPlus /></button>
                        </form>
                    </div>

                    {skills.length === 0 ? (
                        <div className="text-center text-green-600/50 py-12">
                            [ NO SKILLS FOUND. INITIALIZE NEW NODE. ]
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {skills.map(skill => {
                                const xpRequired = skill.level * 100;
                                const progress = (skill.xp / xpRequired) * 100;
                                return (
                                    <div key={skill.id} className="border border-green-500/20 p-4 rounded bg-black relative group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-lg">{skill.name}</span>
                                            <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded font-bold">LVL {skill.level}</span>
                                        </div>
                                        <div className="text-xs text-green-600 mb-1">{skill.xp} / {xpRequired} XP</div>
                                        <div className="h-1.5 bg-green-950 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <button onClick={() => addXP(skill.id)} className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 flex justify-center items-center font-bold transition-opacity">
                                            +50 XP (Simulate Study)
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
