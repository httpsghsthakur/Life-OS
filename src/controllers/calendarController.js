const { ActivityLog, User } = require('../models');

// In-memory time blocks store for calendar engine (fallback if SQL table not initialized)
let calendarEventsStore = [
    { id: '1', user_id: 'user-1', title: 'SYS.DEV: Async Rust Tokio Engine', block_type: 'deep_work', time: '08:00 - 09:30 AM', category: 'Coding', completed: true, color: '#4F46E5' },
    { id: '2', user_id: 'user-1', title: 'Iron Forge: Heavy Squats & Calves Split', block_type: 'workout', time: '10:00 - 11:15 AM', category: 'Fitness', completed: true, color: '#EF4444' },
    { id: '3', user_id: 'user-1', title: 'Academic Revision: Discrete Mathematics', block_type: 'study', time: '01:00 - 02:30 PM', category: 'Exam Prep', completed: false, color: '#06B6D4' },
    { id: '4', user_id: 'user-1', title: 'Second Brain Note Synthesis', block_type: 'reading', time: '03:30 - 04:30 PM', category: 'Knowledge', completed: false, color: '#A855F7' },
    { id: '5', user_id: 'user-1', title: 'Evening Reflection & AI Recovery Briefing', block_type: 'recovery', time: '08:00 - 08:30 PM', category: 'Mindset', completed: false, color: '#22C55E' }
];

let focusSessionsStore = [];

exports.getCalendarEvents = async (req, res) => {
    try {
        res.status(200).json(calendarEventsStore);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching calendar events' });
    }
};

exports.createCalendarEvent = async (req, res) => {
    try {
        const { title, block_type, time, category, color } = req.body;
        const newEvent = {
            id: Date.now().toString(),
            user_id: req.user.id,
            title: title || 'New Time Block',
            block_type: block_type || 'deep_work',
            time: time || '09:00 - 10:00 AM',
            category: category || 'General',
            completed: false,
            color: color || '#4F46E5'
        };
        calendarEventsStore.push(newEvent);
        res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating calendar event' });
    }
};

exports.toggleCalendarEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = calendarEventsStore.find(e => e.id === id);
        if (event) {
            event.completed = !event.completed;
            if (event.completed) {
                await ActivityLog.create({
                    user_id: req.user.id,
                    action_type: 'calendar_block_completed',
                    xp_awarded: 25
                });
                await User.increment({ xp: 25 }, { where: { id: req.user.id } });
            }
            return res.status(200).json(event);
        }
        res.status(404).json({ message: 'Time block not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating calendar event' });
    }
};

exports.logFocusSession = async (req, res) => {
    try {
        const { duration_minutes, block_type } = req.body;
        const session = {
            id: Date.now().toString(),
            user_id: req.user.id,
            duration_minutes: duration_minutes || 25,
            block_type: block_type || 'deep_work',
            created_at: new Date()
        };
        focusSessionsStore.push(session);

        await ActivityLog.create({
            user_id: req.user.id,
            action_type: 'focus_session_completed',
            xp_awarded: 50
        });
        await User.increment({ xp: 50 }, { where: { id: req.user.id } });

        res.status(201).json({ message: 'Focus session logged successfully', session });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging focus session' });
    }
};
