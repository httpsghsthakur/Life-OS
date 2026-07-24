const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    approval_request_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    reviewer_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    rating_understanding: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
        defaultValue: 5
    },
    rating_consistency: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
        defaultValue: 5
    },
    rating_quality: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
        defaultValue: 5
    },
    rating_overall: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
        defaultValue: 5
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Review;
