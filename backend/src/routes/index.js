const express = require('express');
const {authenticate, users} = require('../utils/util')

const router = express.Router();

const orders = [];


router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body,'req.body')
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    res.json({ userId: user.id, username: user.username, walletBalance: user.walletBalance, success:true });
  } else {
    res.status(401).json({ message: 'Login failed' });
  }
});

router.get('/wallet/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find((u) => u.id === parseInt(userId));

  if (user) {
    res.json({ walletBalance: user.walletBalance });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.get('/catalogue', (req, res) => {
  const catalogue = [
    { id: 1, name: 'Gift Card 1', price: 10 },
    { id: 2, name: 'Gift Card 2', price: 20 },
  ];

  res.json(catalogue);
});

router.post('/orders', authenticate, (req, res) => {
  const { cardId } = req.body;
  const order = { id: orders.length + 1, cardId, userId: req.user.id, status: 'Pending' };
  orders.push(order);

  res.json({ orderId: order.id, claimUrl: `https://your-claim-url/${order.id}` });
});

router.get('/orders', (req, res) => {
  res.json(orders);
});

router.get('/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orders.find((o) => o.id === parseInt(orderId));

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});


module.exports = router;
