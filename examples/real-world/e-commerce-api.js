// 예제 6: 실제 프로젝트 - E-commerce API
// Codex 명령어: codex "Create a complete e-commerce API with products, cart, and orders"

const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// 임시 데이터 저장소 (실제로는 데이터베이스 사용)
let products = [
  { id: 1, name: 'Laptop', price: 999.99, stock: 10, category: 'Electronics' },
  { id: 2, name: 'Phone', price: 699.99, stock: 5, category: 'Electronics' },
  { id: 3, name: 'Book', price: 29.99, stock: 100, category: 'Books' }
];

let users = [];
let carts = [];
let orders = [];

// Codex가 생성할 수 있는 완전한 E-commerce API:

/* 
1. 사용자 인증 시스템
Codex 명령어: "Create user authentication with JWT"
*/

// 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// 회원가입
app.post('/api/auth/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;
  
  // 이미 존재하는 사용자 확인
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    name,
    createdAt: new Date()
  };

  users.push(user);
  
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );

  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

// 로그인
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

/* 
2. 상품 관리 API
Codex 명령어: "Create product management endpoints with search and filtering"
*/

// 모든 상품 조회 (검색 및 필터링 포함)
app.get('/api/products', (req, res) => {
  let filteredProducts = [...products];
  
  // 카테고리 필터링
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  // 가격 범위 필터링
  if (req.query.minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(req.query.minPrice));
  }
  if (req.query.maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(req.query.maxPrice));
  }
  
  // 검색
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // 정렬
  if (req.query.sortBy) {
    const sortBy = req.query.sortBy;
    const order = req.query.order === 'desc' ? -1 : 1;
    
    filteredProducts.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1 * order;
      if (a[sortBy] > b[sortBy]) return 1 * order;
      return 0;
    });
  }
  
  // 페이지네이션
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    pagination: {
      current: page,
      total: Math.ceil(filteredProducts.length / limit),
      count: filteredProducts.length
    }
  });
});

// 특정 상품 조회
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

/* 
3. 장바구니 관리 API
Codex 명령어: "Create shopping cart functionality with add, update, remove items"
*/

// 장바구니 조회
app.get('/api/cart', authenticateToken, (req, res) => {
  let cart = carts.find(c => c.userId === req.user.userId);
  if (!cart) {
    cart = { userId: req.user.userId, items: [], total: 0 };
    carts.push(cart);
  }
  
  // 총액 계산
  cart.total = cart.items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  
  res.json(cart);
});

// 장바구니에 상품 추가
app.post('/api/cart/items', authenticateToken, [
  body('productId').isInt({ min: 1 }),
  body('quantity').isInt({ min: 1 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId, quantity } = req.body;
  
  // 상품 존재 확인
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  // 재고 확인
  if (product.stock < quantity) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }
  
  // 장바구니 찾기 또는 생성
  let cart = carts.find(c => c.userId === req.user.userId);
  if (!cart) {
    cart = { userId: req.user.userId, items: [] };
    carts.push(cart);
  }
  
  // 이미 있는 상품인지 확인
  const existingItem = cart.items.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }
  
  res.json({ message: 'Item added to cart', cart });
});

// 장바구니 아이템 수량 업데이트
app.put('/api/cart/items/:productId', authenticateToken, [
  body('quantity').isInt({ min: 0 })
], (req, res) => {
  const { quantity } = req.body;
  const productId = parseInt(req.params.productId);
  
  const cart = carts.find(c => c.userId === req.user.userId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  const itemIndex = cart.items.findIndex(item => item.productId === productId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }
  
  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    const product = products.find(p => p.id === productId);
    if (product && product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    cart.items[itemIndex].quantity = quantity;
  }
  
  res.json({ message: 'Cart updated', cart });
});

// 장바구니에서 아이템 제거
app.delete('/api/cart/items/:productId', authenticateToken, (req, res) => {
  const productId = parseInt(req.params.productId);
  
  const cart = carts.find(c => c.userId === req.user.userId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  cart.items = cart.items.filter(item => item.productId !== productId);
  res.json({ message: 'Item removed from cart', cart });
});

/* 
4. 주문 관리 API
Codex 명령어: "Create order management with checkout, order history, and status tracking"
*/

// 주문 생성 (체크아웃)
app.post('/api/orders', authenticateToken, [
  body('shippingAddress').notEmpty(),
  body('paymentMethod').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { shippingAddress, paymentMethod } = req.body;
  
  // 장바구니 확인
  const cart = carts.find(c => c.userId === req.user.userId);
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  
  // 재고 확인 및 총액 계산
  let total = 0;
  const orderItems = [];
  
  for (const cartItem of cart.items) {
    const product = products.find(p => p.id === cartItem.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ${cartItem.productId} not found` });
    }
    
    if (product.stock < cartItem.quantity) {
      return res.status(400).json({ 
        error: `Insufficient stock for ${product.name}` 
      });
    }
    
    const itemTotal = product.price * cartItem.quantity;
    total += itemTotal;
    
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: cartItem.quantity,
      total: itemTotal
    });
    
    // 재고 차감
    product.stock -= cartItem.quantity;
  }
  
  // 주문 생성
  const order = {
    id: orders.length + 1,
    userId: req.user.userId,
    items: orderItems,
    total,
    shippingAddress,
    paymentMethod,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  orders.push(order);
  
  // 장바구니 비우기
  cart.items = [];
  
  res.status(201).json(order);
});

// 주문 내역 조회
app.get('/api/orders', authenticateToken, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.userId);
  res.json(userOrders);
});

// 특정 주문 조회
app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const order = orders.find(o => 
    o.id === parseInt(req.params.id) && o.userId === req.user.userId
  );
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json(order);
});

// 주문 상태 업데이트 (관리자용)
app.put('/api/orders/:id/status', authenticateToken, [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
], (req, res) => {
  // 실제로는 관리자 권한 확인 필요
  const { status } = req.body;
  const order = orders.find(o => o.id === parseInt(req.params.id));
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  order.status = status;
  order.updatedAt = new Date();
  
  res.json(order);
});

/* 
5. 관리자 API
Codex 명령어: "Add admin endpoints for product management and order processing"
*/

// 상품 추가 (관리자)
app.post('/api/admin/products', authenticateToken, [
  body('name').notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  body('category').notEmpty()
], (req, res) => {
  // 실제로는 관리자 권한 확인 필요
  
  const { name, price, stock, category, description } = req.body;
  
  const product = {
    id: products.length + 1,
    name,
    price,
    stock,
    category,
    description,
    createdAt: new Date()
  };
  
  products.push(product);
  res.status(201).json(product);
});

// 상품 수정 (관리자)
app.put('/api/admin/products/:id', authenticateToken, (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const { name, price, stock, category, description } = req.body;
  
  products[productIndex] = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    price: price !== undefined ? price : products[productIndex].price,
    stock: stock !== undefined ? stock : products[productIndex].stock,
    category: category || products[productIndex].category,
    description: description || products[productIndex].description,
    updatedAt: new Date()
  };
  
  res.json(products[productIndex]);
});

// 모든 주문 조회 (관리자)
app.get('/api/admin/orders', authenticateToken, (req, res) => {
  // 실제로는 관리자 권한 확인 필요
  res.json(orders);
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 핸들링
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`E-commerce API server running on port ${PORT}`);
});

module.exports = app;