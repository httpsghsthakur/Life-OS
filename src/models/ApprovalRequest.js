const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ApprovalRequest = sequelize.define('ApprovalRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    milestone_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    requester_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    reviewer_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    evidence_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reflection: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = ApprovalRequest;
