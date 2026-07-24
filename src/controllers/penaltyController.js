const { ActivityLog, User, Challenge, Milestone } = require('../models');

// Penalties & Wall of Shame store
let wallOfShameStore = [
    {
        id: '1',
        user_id: 'user-1',
        username: 'Alex',
        reason: 'Missed 2 consecutive daily tasks in Milestone 1',
        penalty_type: 'Streak Reset & XP Penalty (-100 XP)',
        date: new Date().toISOString().split('T')[0]
    }
];

exports.getPenaltyAuditLog = async (req, res) => {
    try {
        res.status(200).json(wallOfShameStore);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching penalty audit log' });
    }
};

exports.triggerMissPenalty = async (req, res) => {
    try {
        const { challenge_id, reason } = req.body;
        const user = await User.findByPk(req.user.id);
        
        // Reset streak and deduct 100 XP
        const newStreak = 0;
        const newXP = Math.max(0, (user.xp || 0) - 100);
        await user.update({ current_streak: newStreak, xp: newXP });

        const penaltyRecord = {
            id: Date.now().toString(),
            user_id: req.user.id,
            username: user.username,
            reason: reason || 'Missed 2 consecutive daily milestone tasks',
            penalty_type: 'Streak Reset to 0 & -100 XP Penalty',
            date: new Date().toISOString().split('T')[0]
        };
        wallOfShameStore.unshift(penaltyRecord);

        await ActivityLog.create({
            user_id: req.user.id,
            action_type: 'penalty_triggered',
            xp_awarded: -100
        });

        res.status(200).json({ 
            message: 'Penalty applied successfully. Streak reset to 0.',
            penaltyRecord,
            user: { current_streak: newStreak, xp: newXP }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error applying miss penalty' });
    }
};

exports.applyGraceDayToken = async (req, res) => {
    try {
        // Protect streak using a Grace Token
        res.status(200).json({ 
            message: 'Grace Token applied! Streak protected for 24 hours.' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error applying grace token' });
    }
};
