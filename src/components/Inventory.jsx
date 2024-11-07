import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ item: '', quantity: 1 });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const response = await axios.get('/api/inventory');
    setInventory(response.data.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/inventory/${id}`);
    fetchInventory(); // Atualiza a lista após a exclusão
  };

  const handleAddItem = async () => {
    if (newItem.item && newItem.quantity > 0) {
      await axios.post('/api/inventory', newItem);
      setNewItem({ item: '', quantity: 1 });
      fetchInventory(); // Atualiza a lista após a adição
    }
  };

  return (
    <div>
      <h2>Inventário</h2>
      <div>
        <input
          type="text"
          placeholder="Nome do item"
          value={newItem.item}
          onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
        />
        <button onClick={handleAddItem}>Adicionar Item</button>
      </div>
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            {item.item} - Quantidade: {item.quantity}
            <button onClick={() => handleDelete(item.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Inventory;
