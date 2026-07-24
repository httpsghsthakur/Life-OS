const { User, Badge, UserBadge, ActivityLog } = require('../models');

exports.getProgressionStats = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const xpForCurrentLevel = user.level * 100;
        const xpProgress = Math.min(100, Math.round((user.xp / xpForCurrentLevel) * 100));

        // Streak multiplier formula (1.0x to 2.5x)
        const multiplier = (1.0 + Math.min(user.current_streak * 0.1, 1.5)).toFixed(1);

        res.status(200).json({
            level: user.level,
            xp: user.xp,
            xpForCurrentLevel,
            xpProgressPercentage: xpProgress,
            currentStreak: user.current_streak,
            streakMultiplier: `${multiplier}x`,
            disciplineScore: user.discipline_score
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching progression stats' });
    }
};

exports.awardXP = async (req, res) => {
    try {
        const { xp_amount, action_type } = req.body;
        const user = await User.findByPk(req.user.id);
        
        let newXP = user.xp + (xp_amount || 50);
        let newLevel = user.level;

        // Check level up (XP threshold = Level * 100)
        while (newXP >= newLevel * 100) {
            newXP -= newLevel * 100;
            newLevel += 1;
        }

        await user.update({ xp: newXP, level: newLevel });

        await ActivityLog.create({
            user_id: req.user.id,
            action_type: action_type || 'xp_granted',
            xp_awarded: xp_amount || 50
        });

        res.status(200).json({
            message: newLevel > user.level ? `🎉 LEVEL UP! Reached Level ${newLevel}` : 'XP Granted',
            level: newLevel,
            xp: newXP,
            leveledUp: newLevel > user.level
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error awarding XP' });
    }
};
