const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ActivityPauseState = sequelize.define('ActivityPauseState', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    exam_session_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    activity_type: {
        type: DataTypes.STRING,
        allowNull: false // e.g., 'Challenge', 'Habit', 'Milestone', 'Fitness'
    },
    activity_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    paused_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    state_snapshot: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = ActivityPauseState;
