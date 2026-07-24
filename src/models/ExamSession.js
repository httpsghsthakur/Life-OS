const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ExamSession = sequelize.define('ExamSession', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    exam_type: {
        type: DataTypes.ENUM('Semester', 'Competitive', 'School', 'Custom'),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    total_study_hours: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    completion_percentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true
});

module.exports = ExamSession;
