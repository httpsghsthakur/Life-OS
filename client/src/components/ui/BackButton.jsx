import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function BackButton({ to = "/", label = "Back to Dashboard" }) {
    const navigate = useNavigate();

    if (to) {
        return (
            <Link 
                to={to} 
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all shadow-sm mb-6 cursor-pointer"
            >
                <FiArrowLeft size={16} /> {label}
            </Link>
        );
    }

    return (
        <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all shadow-sm mb-6 cursor-pointer"
        >
            <FiArrowLeft size={16} /> {label || "Back"}
        </button>
    );
}
