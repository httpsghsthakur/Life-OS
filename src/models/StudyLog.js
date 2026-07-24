const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StudyLog = sequelize.define('StudyLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    exam_session_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    subject_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    session_time: {
        type: DataTypes.ENUM('Morning', 'Afternoon', 'Evening', 'Night'),
        allowNull: false
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    chapters_covered: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = StudyLog;
