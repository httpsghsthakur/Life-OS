import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
    FiBookOpen, FiShare2, FiSearch, FiPlus, FiTag, FiFileText, 
    FiLink2, FiCpu, FiFolder, FiCheck, FiEdit3, FiZap 
} from 'react-icons/fi';
import BackButton from '../components/ui/BackButton';

export default function KnowledgeDashboard() {
    const { user } = useContext(AuthContext);
    const [selectedNote, setSelectedNote] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'graph' | 'journals'

    const [notes, setNotes] = useState([
        { 
            id: '1', 
            title: 'Tokio Async Runtime Architecture in Rust', 
            category: 'SYS.DEV', 
            updatedAt: '2 Hours Ago', 
            content: 'The Tokio runtime provides an asynchronous execution engine for Rust built on top of epoll/kqueue. Tasks are scheduled across worker threads using a work-stealing algorithm.',
            tags: ['rust', 'async', 'tokio', 'concurrency'],
            links: ['Rust Memory Safety', 'Epoll Linux System Calls']
        },
        { 
            id: '2', 
            title: 'Hypertrophy & Progressive Overload Mechanics', 
            category: 'Iron Forge', 
            updatedAt: 'Yesterday', 
            content: 'Hypertrophy is driven by three primary mechanisms: mechanical tension, metabolic stress, and muscle damage. Mechanical tension through heavy compound lifting remains the dominant driver.',
            tags: ['fitness', 'hypertrophy', 'squat', 'biomechanics'],
            links: ['Caloric Surplus Strategy', 'Recovery Sleep Cycles']
        },
        { 
            id: '3', 
            title: 'Discrete Mathematics: Graph Theory Proofs', 
            category: 'Academics', 
            updatedAt: '3 Days Ago', 
            content: 'A graph G is bipartite if and only if G contains no odd cycles. Handshaking Lemma states that the sum of degrees of all vertices equals twice the number of edges.',
            tags: ['math', 'graphs', 'discrete_math', 'exams'],
            links: ['Adjacency Matrix Multiplication', 'Eulerian Paths']
        }
    ]);

    const filteredNotes = notes.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 md:p-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="ambient-glow top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/15"></div>
            <div className="ambient-glow bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10"></div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <BackButton />

                {/* Page Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest mb-1">
                            <FiShare2 /> Knowledge Management & Second Brain Engine
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                            <FiBookOpen className="text-purple-400" /> Second Brain Vault
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Bi-directional wiki-linking, Notion-style block editor, and AI RAG knowledge search.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 text-xs hover:scale-105 transition-all">
                            <FiPlus /> New Knowledge Note
                        </button>
                    </div>
                </header>

                {/* SEARCH BAR & CONTROLS */}
                <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search notes, tags, [[wiki-links]]..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveTab('notes')}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${activeTab === 'notes' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-white/5 text-slate-400'}`}
                        >
                            Notes Vault
                        </button>
                        <button 
                            onClick={() => setActiveTab('graph')}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${activeTab === 'graph' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-white/5 text-slate-400'}`}
                        >
                            Knowledge Graph Canvas
                        </button>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                {activeTab === 'graph' ? (
                    <div className="glass-panel p-8 rounded-2xl border border-purple-500/30 flex flex-col items-center justify-center min-h-[400px] text-center">
                        <div className="w-20 h-20 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 animate-pulse">
                            <FiShare2 size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Interactive D3.js Knowledge Graph Canvas</h3>
                        <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
                            Visualizing 18 connected node relationships across SYS.DEV coding notes, Iron Forge fitness split guides, and academic exam subjects.
                        </p>
                        <div className="flex gap-2">
                            {['[[Rust Tokio Runtime]]', '[[Hypertrophy Mechanics]]', '[[Graph Theory]]', '[[Milestone Sprint 1]]'].map((tag, idx) => (
                                <span key={idx} className="bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[11px] px-3 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Notes List */}
                        <div className="space-y-4">
                            {filteredNotes.map(note => (
                                <div 
                                    key={note.id}
                                    onClick={() => setSelectedNote(note)}
                                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedNote?.id === note.id ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-600/10' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold">
                                            {note.category}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono">{note.updatedAt}</span>
                                    </div>
                                    <h3 className="font-bold text-sm text-white mb-2 leading-snug">{note.title}</h3>
                                    <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">{note.content}</p>
                                    
                                    <div className="flex flex-wrap gap-1.5">
                                        {note.tags.map((t, idx) => (
                                            <span key={idx} className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                                                #{t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Note Viewer / Block Editor */}
                        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-purple-500/20 flex flex-col justify-between">
                            {selectedNote ? (
                                <div>
                                    <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10">
                                        <div>
                                            <span className="text-xs font-mono text-purple-400 font-bold uppercase">{selectedNote.category}</span>
                                            <h2 className="text-2xl font-bold text-white mt-1">{selectedNote.title}</h2>
                                        </div>
                                        <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                            <FiEdit3 />
                                        </button>
                                    </div>

                                    <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-300 space-y-4">
                                        <p>{selectedNote.content}</p>

                                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-[11px] my-4">
                                            <strong>🧠 AI Second Brain Connection:</strong> This note is linked directly to Milestone 1 of your 100-day Goal Sprint.
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                                                <FiLink2 className="text-purple-400" /> Bi-Directional Backlinks & References
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedNote.links.map((link, idx) => (
                                                    <span key={idx} className="bg-purple-600/20 border border-purple-500/40 text-purple-300 font-mono text-xs px-3 py-1 rounded-xl cursor-pointer hover:bg-purple-600 hover:text-white transition-all">
                                                        [[{link}]]
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="min-h-[300px] flex flex-col items-center justify-center text-center text-slate-500">
                                    <FiFileText size={48} className="mb-3 opacity-30 text-purple-400" />
                                    <p className="text-sm font-semibold">Select a knowledge note from the left vault to inspect content & backlinks.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
