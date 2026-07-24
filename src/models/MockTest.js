const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MockTest = sequelize.define('MockTest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    exam_session_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time_taken_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weak_areas: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    incorrect_questions: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true
});

module.exports = MockTest;
