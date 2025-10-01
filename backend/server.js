const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//imagens estaticamente
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.use('/api/orders', orderRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Banco sincronizado');
    app.listen(PORT, () => console.log(`Server rodando em http://localhost:${PORT}`));
  } catch (err) {
    console.error('Erro ao iniciar:', err);
  }
})();
