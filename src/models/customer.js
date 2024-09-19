'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Customer.belongsTo(models.Account, {foreignKey: 'customer_id'});
        }
    }

    Customer.init({
        customer_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            references: {
                model: 'Account',
                key: 'account_id'
            }
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        gender: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        date_of_birth: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        point: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Customer',
        tableName: 'Customer',
        timestamps: true,
        underscored: true
    });

    return Customer;
};
