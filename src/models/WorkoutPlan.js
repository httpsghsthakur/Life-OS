const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WorkoutPlan = sequelize.define('WorkoutPlan', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    day_of_week: {
        type: DataTypes.INTEGER, // 0 = Sunday, 1 = Monday, etc.
        allowNull: false
    },
    muscle_group: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = WorkoutPlan;
