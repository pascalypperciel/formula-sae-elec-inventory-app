import React, { useState, useEffect } from 'react';
import { getItems, addItem } from '../services/ItemService';

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, price: 0 });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await getItems();
    setItems(data);
  };

  const handleAddItem = async () => {
    await addItem(newItem);
    loadItems();
    setNewItem({ name: '', quantity: 0, price: 0 });
  };

  return (
    <div>
      <h1>Inventory</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.quantity} units - ${item.price}
          </li>
        ))}
      </ul>

      <div>
        <h2>Add New Item</h2>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
    </div>
  );
};

export default InventoryPage;
