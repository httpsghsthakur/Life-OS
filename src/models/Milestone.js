const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Milestone = sequelize.define('Milestone', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    challenge_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('locked', 'unlocked', 'pending_review', 'approved', 'rejected', 'completed'),
        defaultValue: 'locked'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resources: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Milestone;
