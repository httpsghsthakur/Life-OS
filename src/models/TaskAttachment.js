const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TaskAttachment = sequelize.define('TaskAttachment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    task_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    milestone_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('github', 'pdf', 'image', 'url', 'video', 'document'),
        defaultValue: 'url'
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = TaskAttachment;
