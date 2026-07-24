const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserBadge = sequelize.define('UserBadge', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    badge_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true,
    updatedAt: false
});

module.exports = UserBadge;
