const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ExamSubject = sequelize.define('ExamSubject', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    exam_session_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    progress_percentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = ExamSubject;
