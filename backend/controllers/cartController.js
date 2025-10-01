const { CartItem, Product } = require('../models');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId obrigatório' });

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

    // se já existe, incrementa
    let item = await CartItem.findOne({ where: { userId, productId } });
    if (item) {
      item.quantity = item.quantity + (parseInt(quantity || 1));
      await item.save();
    } else {
      item = await CartItem.create({ userId, productId, quantity: parseInt(quantity || 1) });
    }
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao adicionar ao carrinho' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product }]
    });
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar carrinho' });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const item = await CartItem.findOne({ where: { id, userId } });
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });
    await item.destroy();
    return res.json({ message: 'Item removido' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao remover item' });
  }
};
