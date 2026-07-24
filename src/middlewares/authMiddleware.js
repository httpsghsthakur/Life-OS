const { supabaseAdmin } = require('../config/supabaseClient');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Validate the JWT against Supabase Auth
        const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !supabaseUser) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        // Look up or auto-provision the local user profile
        let localUser = await User.findByPk(supabaseUser.id);

        if (!localUser) {
            localUser = await User.findOne({ where: { email: supabaseUser.email } });
        }

        if (!localUser) {
            // First-time login: create a local profile linked to the Supabase Auth UUID
            localUser = await User.create({
                id: supabaseUser.id,
                username: supabaseUser.user_metadata?.username || supabaseUser.email.split('@')[0],
                email: supabaseUser.email
            });
        }

        const ExamSession = require('../models/ExamSession');
        const activeExam = await ExamSession.findOne({ where: { user_id: localUser.id, is_active: true } });

        // Populate req.user with the same shape all controllers expect
        req.user = {
            id: localUser.id,
            username: localUser.username,
            email: localUser.email,
            is_in_exam_mode: !!activeExam
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
