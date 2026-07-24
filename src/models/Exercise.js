const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Exercise = sequelize.define('Exercise', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    workout_plan_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sets: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reps: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    target_weight: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = Exercise;
