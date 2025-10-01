const { Order, OrderItem, Product } = require("../models");

exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { items, total } = req.body;

  try {
    if (!items || !items.length) {
      return res.status(400).json({ error: "Carrinho vazio" });
    }

    // criar pedido
    const order = await Order.create({ userId, total, status: "pendente" });

    // criar itens do pedido
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);

      if (!product) {
        return res.status(400).json({ error: `Produto ${item.product_id} não encontrado` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Estoque insuficiente para ${product.name}` });
      }

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      // reduzir estoque
      product.stock -= item.quantity;
      await product.save();
    }

    return res
      .status(201)
      .json({ message: "Pedido criado com sucesso", orderId: order.id });
  } catch (err) {
    console.error("Erro ao criar pedido:", err);
    return res.status(500).json({ error: "Erro ao criar pedido" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, include: [Product] }],
      order: [["createdAt", "DESC"]],
    });
    return res.json(orders);
  } catch (err) {
    console.error("Erro ao buscar pedidos do cliente:", err);
    return res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, include: [Product] }],
      order: [["createdAt", "DESC"]],
    });
    return res.json(orders);
  } catch (err) {
    console.error("Erro ao buscar pedidos:", err);
    return res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
};