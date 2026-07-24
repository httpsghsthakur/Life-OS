const { User, Friend, Challenge, Milestone, MilestoneTask } = require('../models');

async function seedDemoPartnerForUser(userId) {
    try {
        if (!userId) return;

        // 1. Find or create demo partner
        let demoPartner = await User.findOne({ where: { username: 'alex_partner' } });
        if (!demoPartner) {
            demoPartner = await User.create({
                username: 'alex_partner',
                email: 'alex_partner@lifeos.dev',
                password: 'demopartnerpassword123',
                level: 4,
                xp: 1850,
                current_streak: 12,
                discipline_score: 92
            });
        }

        if (demoPartner.id === userId) return;

        // 2. Ensure accepted Friend relationship exists
        const existingFriend = await Friend.findOne({
            where: {
                user_id: userId,
                friend_id: demoPartner.id
            }
        });

        if (!existingFriend) {
            await Friend.create({
                user_id: userId,
                friend_id: demoPartner.id,
                status: 'accepted'
            });
        } else if (existingFriend.status !== 'accepted') {
            existingFriend.status = 'accepted';
            await existingFriend.save();
        }

        // Also ensure inverse relationship
        const inverseFriend = await Friend.findOne({
            where: {
                user_id: demoPartner.id,
                friend_id: userId
            }
        });

        if (!inverseFriend) {
            await Friend.create({
                user_id: demoPartner.id,
                friend_id: userId,
                status: 'accepted'
            });
        } else if (inverseFriend.status !== 'accepted') {
            inverseFriend.status = 'accepted';
            await inverseFriend.save();
        }

        // 3. Ensure demo partner has sample active challenge
        const existingChallenge = await Challenge.findOne({ where: { user_id: demoPartner.id } });
        if (!existingChallenge) {
            const ch = await Challenge.create({
                user_id: demoPartner.id,
                title: 'DSA & System Design 10-Day Sprint',
                description: 'Complete 5 LeetCode hard problems daily and build distributed cache',
                category: 'Coding & Architecture',
                status: 'active'
            });

            const ms1 = await Milestone.create({
                challenge_id: ch.id,
                title: 'Milestone 1: Trees & Graphs Mastery',
                day_number: 1,
                target_date: new Date().toISOString().split('T')[0],
                status: 'in_progress'
            });

            await MilestoneTask.create({
                milestone_id: ms1.id,
                title: 'Solve 3 LeetCode Hard Binary Tree Questions',
                priority: 'P1',
                energy_level: '⚡ High Energy',
                estimated_minutes: 90,
                is_completed: true
            });

            await MilestoneTask.create({
                milestone_id: ms1.id,
                title: 'Design LRU Cache in C++',
                priority: 'P2',
                energy_level: '💡 Deep Focus',
                estimated_minutes: 60,
                is_completed: true
            });
        }
    } catch (err) {
        console.error('Error seeding demo partner:', err);
    }
}

async function seedDemoPartnerForAllUsers() {
    try {
        const users = await User.findAll();
        for (const u of users) {
            if (u.username !== 'alex_partner') {
                await seedDemoPartnerForUser(u.id);
            }
        }
    } catch (err) {
        console.error('Error seeding for all users:', err);
    }
}

module.exports = {
    seedDemoPartnerForUser,
    seedDemoPartnerForAllUsers
};
