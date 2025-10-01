const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const UserModel = require('./user');
const ProductModel = require('./product');
const CartItemModel = require('./cartItem');

const User = UserModel(sequelize, Sequelize.DataTypes);
const Product = ProductModel(sequelize, Sequelize.DataTypes);
const CartItem = CartItemModel(sequelize, Sequelize.DataTypes);

// relações
User.hasMany(CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Product,
  CartItem
};
