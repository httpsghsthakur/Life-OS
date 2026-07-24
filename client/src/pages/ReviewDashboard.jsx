import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiStar } from 'react-icons/fi';
import BackButton from '../components/ui/BackButton';

export default function ReviewDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [ratings, setRatings] = useState({
        rating_understanding: 5,
        rating_consistency: 5,
        rating_quality: 5,
        rating_overall: 5,
        comment: ''
    });

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/reviews/pending', { headers: { Authorization: `Bearer ${token}` } });
            setRequests(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRequests(); }, []);

    const submitEvaluation = async (is_approved) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/reviews/evaluate/${selectedRequest.id}`, {
                ...ratings,
                is_approved
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            setSelectedRequest(null);
            fetchRequests(); // refresh list
        } catch (err) { alert(err.response?.data?.message || "Error"); }
    };

    return (
        <div className="min-h-screen p-8 max-w-5xl mx-auto">
            <BackButton />
            <header className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Pending Reviews</h1>
                <p className="text-textSecondary">Your friends rely on your honesty to build discipline.</p>
            </header>

            {loading ? <div>Loading...</div> : requests.length === 0 ? (
                <div className="glass p-12 rounded-3xl text-center">
                    <p className="text-textSecondary">No pending approval requests. Great job!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* List */}
                    <div className="space-y-4">
                        {requests.map(req => (
                            <div key={req.id} onClick={() => setSelectedRequest(req)} className={`glass p-5 rounded-2xl cursor-pointer transition-colors ${selectedRequest?.id === req.id ? 'border-primary' : 'border-white/10 hover:border-white/30'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="font-bold text-lg">{req.requester.username}</div>
                                    <span className="text-xs font-bold px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-md">Pending</span>
                                </div>
                                <div className="text-sm text-textSecondary">Submitted milestone for: <span className="text-white">{req.Milestone.title}</span></div>
                            </div>
                        ))}
                    </div>

                    {/* Detail panel */}
                    {selectedRequest && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold mb-6">Review Submission</h2>
                            
                            <div className="mb-6 space-y-4">
                                <div>
                                    <h4 className="text-sm text-textSecondary uppercase tracking-wider mb-1">Evidence URL</h4>
                                    <a href={selectedRequest.evidence_url} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">{selectedRequest.evidence_url}</a>
                                </div>
                                <div>
                                    <h4 className="text-sm text-textSecondary uppercase tracking-wider mb-1">Reflection</h4>
                                    <p className="bg-white/5 p-4 rounded-xl italic">"{selectedRequest.reflection}"</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <h4 className="text-sm text-textSecondary uppercase tracking-wider">Rate their work</h4>
                                {['understanding', 'consistency', 'quality', 'overall'].map(metric => (
                                    <div key={metric} className="flex justify-between items-center">
                                        <span className="capitalize text-sm">{metric}</span>
                                        <input 
                                            type="range" min="1" max="5" 
                                            value={ratings[`rating_${metric}`]} 
                                            onChange={(e) => setRatings({...ratings, [`rating_${metric}`]: parseInt(e.target.value)})}
                                            className="w-1/2 accent-primary"
                                        />
                                    </div>
                                ))}
                                <div>
                                    <textarea 
                                        placeholder="Leave a comment (optional)..."
                                        value={ratings.comment} onChange={(e) => setRatings({...ratings, comment: e.target.value})}
                                        className="w-full mt-4 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-white h-20 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => submitEvaluation(false)} className="flex-1 py-3 rounded-xl font-medium bg-accent/20 text-accent hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2">
                                    <FiXCircle /> Reject
                                </button>
                                <button onClick={() => submitEvaluation(true)} className="flex-1 py-3 rounded-xl font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                                    <FiCheckCircle /> Approve
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
