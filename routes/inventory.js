const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');

module.exports = (db) => {
  // GET - Buscar todos os itens
  router.get('/inventory', verificarToken, (req, res) => {
    db.all('SELECT id, item, quantity, descricao, preco FROM inventory', [], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar inventário:', err);
        return res.status(500).json({ error: 'Erro ao buscar inventário' });
      }
      res.json({ data: rows });
    });
  });

  // POST - Criar novo item
  router.post('/inventory', verificarToken, (req, res) => {
    const { item, quantity, descricao, preco } = req.body;

    db.run(
      'INSERT INTO inventory (item, quantity, descricao, preco) VALUES (?, ?, ?, ?)',
      [item, quantity, descricao, preco],
      function(err) {
        if (err) {
          console.error('Erro ao inserir item:', err);
          return res.status(500).json({ error: 'Erro ao criar item' });
        }
        res.json({
          id: this.lastID,
          item,
          quantity,
          descricao,
          preco
        });
      }
    );
  });

  // PUT - Atualizar item existente
  router.put('/inventory/:id', verificarToken, (req, res) => {
    const { item, quantity, descricao, preco } = req.body;
    const { id } = req.params;

    db.run(
      'UPDATE inventory SET item = ?, quantity = ?, descricao = ?, preco = ? WHERE id = ?',
      [item, quantity, descricao, preco, id],
      (err) => {
        if (err) {
          console.error('Erro ao atualizar item:', err);
          return res.status(500).json({ error: 'Erro ao atualizar item' });
        }
        res.json({
          id,
          item,
          quantity,
          descricao,
          preco
        });
      }
    );
  });

  // DELETE - Remover item
  router.delete('/inventory/:id', verificarToken, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM inventory WHERE id = ?', [id], (err) => {
      if (err) {
        console.error('Erro ao excluir item:', err);
        return res.status(500).json({ error: 'Erro ao excluir item' });
      }
      res.json({ message: 'Item excluído com sucesso' });
    });
  });

  return router;
}; 