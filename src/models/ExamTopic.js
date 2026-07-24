const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ExamTopic = sequelize.define('ExamTopic', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    subject_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    revision_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0, max: 3 }
    }
}, {
    timestamps: true
});

module.exports = ExamTopic;
