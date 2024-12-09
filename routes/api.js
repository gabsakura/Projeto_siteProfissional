const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verificarToken, verificarAdmin } = require('../middleware/auth');

module.exports = (db) => {
  // Rota de login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
          console.error('Erro ao buscar usuário:', err);
          return res.status(500).json({ error: 'Erro interno do servidor' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const senhaValida = await bcrypt.compare(password, user.password);
        if (!senhaValida) {
          return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
          { 
            id: user.id,
            email: user.email,
            tipo: user.tipo
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          token,
          user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipo: user.tipo
          }
        });
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Rota para dados financeiros (protegida)
  router.get('/financial_data', verificarToken, (req, res) => {
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM financial_data';
    const params = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Erro ao buscar dados financeiros:', err);
        return res.status(500).json({ error: 'Erro ao buscar dados' });
      }
      res.json({ data: rows });
    });
  });

  // Rota para inventário (protegida)
  router.get('/inventory', verificarToken, (req, res) => {
    db.all('SELECT * FROM inventory', (err, rows) => {
      if (err) {
        console.error('Erro ao buscar inventário:', err);
        return res.status(500).json({ error: 'Erro ao buscar dados' });
      }
      res.json({ data: rows });
    });
  });

  // Rota para atualizar item do inventário
  router.put('/inventory/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { item, quantity, descricao, preco } = req.body;

    if (!item || typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Dados inválidos para atualizar item' });
    }

    db.run(
      "UPDATE inventory SET item = ?, quantity = ?, descricao = ?, preco = ? WHERE id = ?",
      [item, quantity, descricao, preco, id],
      function(err) {
        if (err) {
          console.error('Erro ao atualizar item:', err.message);
          return res.status(500).json({ error: 'Erro ao atualizar item' });
        }
        res.json({ message: 'Item atualizado com sucesso!' });
      }
    );
  });

  // ... outras rotas ...

  return router;
}; 