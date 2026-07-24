const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DailyReflection = sequelize.define('DailyReflection', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    milestone_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    what_learned: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    difficulties_faced: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tomorrow_improvements: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    mood_score: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    }
}, {
    timestamps: true
});

module.exports = DailyReflection;
