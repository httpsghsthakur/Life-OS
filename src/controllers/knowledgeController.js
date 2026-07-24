const { ActivityLog, User } = require('../models');

let notesStore = [
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
];

exports.getNotes = async (req, res) => {
    try {
        res.status(200).json(notesStore);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching notes' });
    }
};

exports.createNote = async (req, res) => {
    try {
        const { title, category, content, tags, links } = req.body;
        const newNote = {
            id: Date.now().toString(),
            title: title || 'Untitled Note',
            category: category || 'General',
            updatedAt: 'Just Now',
            content: content || '',
            tags: tags || ['second_brain'],
            links: links || []
        };
        notesStore.unshift(newNote);

        await ActivityLog.create({
            user_id: req.user.id,
            action_type: 'knowledge_note_created',
            xp_awarded: 20
        });
        await User.increment({ xp: 20 }, { where: { id: req.user.id } });

        res.status(201).json(newNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating note' });
    }
};

exports.getGraphData = async (req, res) => {
    try {
        const nodes = notesStore.map(n => ({ id: n.id, label: n.title, category: n.category }));
        const edges = [
            { source: '1', target: '3' },
            { source: '2', target: '1' }
        ];
        res.status(200).json({ nodes, edges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching graph data' });
    }
};
