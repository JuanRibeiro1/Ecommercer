const { Product } = require('../models');
const path = require('path');

exports.list = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const productData = { name, description, price: parseFloat(price || 0), stock: parseInt(stock || 0), category };

    if (req.file) {
      productData.image_url = '/uploads/' + req.file.filename;
    }

    const product = await Product.create(productData);
    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, stock, category } = req.body;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

    if (req.file) {
      product.image_url = '/uploads/' + req.file.filename;
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    product.category = category ?? product.category;

    await product.save();
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    await product.destroy();
    return res.json({ message: 'Produto excluído' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao excluir produto' });
  }
};
