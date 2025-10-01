const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET } = require('../middleware/auth');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Campos obrigatórios faltando' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: 'E-mail já cadastrado' });

    // por segurança, role só aceita 'admin' se já existir um admin (ou permita via seed)
    const user = await User.create({ name, email, password, role: role === 'admin' ? 'admin' : 'client' });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'E-mail e senha obrigatórios' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const valid = await user.checkPassword(password);
    if (!valid) return res.status(400).json({ error: 'Senha inválida' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};
