// 예제 3: 테스트 코드 자동 생성
// Codex 명령어: codex "Write unit tests for this utility function using Jest"

// 원본 함수들
function calculateTax(price, taxRate) {
  if (price < 0 || taxRate < 0) {
    throw new Error('Price and tax rate must be positive numbers');
  }
  return price * taxRate;
}

function formatCurrency(amount, currency = 'USD') {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  });
  return formatter.format(amount);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/* 
Codex가 생성하는 테스트 코드:

const { calculateTax, formatCurrency, validateEmail } = require('./utils');

describe('calculateTax', () => {
  test('should calculate tax correctly', () => {
    expect(calculateTax(100, 0.1)).toBe(10);
    expect(calculateTax(50, 0.2)).toBe(10);
    expect(calculateTax(0, 0.1)).toBe(0);
  });

  test('should throw error for negative price', () => {
    expect(() => calculateTax(-100, 0.1)).toThrow('Price and tax rate must be positive numbers');
  });

  test('should throw error for negative tax rate', () => {
    expect(() => calculateTax(100, -0.1)).toThrow('Price and tax rate must be positive numbers');
  });
});

describe('formatCurrency', () => {
  test('should format USD currency by default', () => {
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(99.99)).toBe('$99.99');
  });

  test('should format different currencies', () => {
    expect(formatCurrency(100, 'EUR')).toContain('100.00');
    expect(formatCurrency(100, 'JPY')).toContain('100');
  });

  test('should handle zero amount', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('validateEmail', () => {
  test('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.org')).toBe(true);
    expect(validateEmail('user+tag@example.co.uk')).toBe(true);
  });

  test('should reject invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('user name@domain.com')).toBe(false);
  });
});
*/

// 고급 테스트 예제 (Codex가 생성할 수 있는)
/* 
Codex 명령어: "Add integration tests for API endpoints with error handling"

const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  describe('GET /api/users', () => {
    test('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/users', () => {
    test('should create new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body).toMatchObject(newUser);
      expect(response.body.id).toBeDefined();
    });

    test('should return error for invalid data', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Test User' }) // missing email
        .expect(400);

      expect(response.body.error).toBe('Name and email are required');
    });
  });
});
*/

module.exports = { calculateTax, formatCurrency, validateEmail };