// 예제 2: Express.js API 엔드포인트 생성
// Codex 명령어: codex "Create a RESTful API endpoint for user management with CRUD operations"

// 기본 구조
const express = require('express');
const router = express.Router();

// 임시 데이터 (실제로는 데이터베이스 사용)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Codex가 생성할 수 있는 CRUD API 엔드포인트들:

/* 
Codex 명령어와 결과 예제:

1. "Create GET endpoint to fetch all users"
router.get('/users', (req, res) => {
  res.json(users);
});

2. "Create GET endpoint to fetch user by ID"
router.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

3. "Create POST endpoint to create new user"
router.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

4. "Create PUT endpoint to update user"
router.put('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email } = req.body;
  users[userIndex] = { ...users[userIndex], name, email };
  
  res.json(users[userIndex]);
});

5. "Create DELETE endpoint to remove user"
router.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

6. "Add error handling middleware"
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
*/

module.exports = router;

// 사용법:
// const app = express();
// app.use('/api', router);
// app.listen(3000, () => console.log('Server running on port 3000'));