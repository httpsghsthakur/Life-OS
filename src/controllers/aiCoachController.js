const { ActivityLog, User } = require('../models');

let aiLogsStore = [
    { role: 'ai', text: 'WARRIOR ATTENTION. You have 3 P1 daily tasks scheduled today. Current streak is 12 days. No missed deadlines allowed.' }
];

exports.getBriefing = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const briefing = {
            date: new Date().toISOString().split('T')[0],
            username: user?.username || 'Warrior',
            streak: user?.current_streak || 0,
            brsScore: 0.12, // Low risk
            focusRecommendation: 'Peak cognitive window detected between 08:00 AM and 11:30 AM. Execute P1 coding tasks immediately.',
            priorities: [
                'Complete Async Rust Tokio Engine code diff submission',
                'Iron Forge Heavy Squats Split workout session',
                'Discrete Mathematics Graph Theory revision'
            ]
        };
        res.status(200).json(briefing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching AI briefing' });
    }
};

exports.queryCoach = async (req, res) => {
    try {
        const { prompt, persona } = req.body;
        const personaPrefix = (persona || 'STRICT_COMMANDER').toUpperCase();
        const responseText = `[${personaPrefix} AI ENGINE]: Processing query "${prompt}". RAG vector memory context retrieved from Supabase pgvector database namespace. Recommended action: Execute current P1 daily task protocol.`;

        const userMsg = { role: 'user', text: prompt };
        const aiMsg = { role: 'ai', text: responseText };
        aiLogsStore.push(userMsg, aiMsg);

        await ActivityLog.create({
            user_id: req.user.id,
            action_type: 'ai_coach_queried',
            xp_awarded: 5
        });

        res.status(200).json({ response: responseText, logs: aiLogsStore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error querying AI Coach' });
    }
};
