// 예제 4: JavaScript를 TypeScript로 마이그레이션
// Codex 명령어: codex "Convert this JavaScript code to TypeScript with proper type annotations"

// BEFORE: JavaScript 코드
/* 
function createUser(userData) {
  return {
    id: Math.random().toString(36),
    ...userData,
    createdAt: new Date(),
    isActive: true
  };
}

function updateUser(user, updates) {
  return { ...user, ...updates, updatedAt: new Date() };
}

class UserService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.cache = new Map();
  }
  
  async getUser(id) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    
    const user = await this.apiClient.get(`/users/${id}`);
    this.cache.set(id, user);
    return user;
  }
  
  async createUser(userData) {
    const user = createUser(userData);
    const response = await this.apiClient.post('/users', user);
    this.cache.set(response.id, response);
    return response;
  }
}
*/

// AFTER: TypeScript로 변환된 코드 (Codex 결과)

// 타입 정의
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
}

interface UserCreateData {
  name: string;
  email: string;
  age?: number;
}

interface UserUpdateData {
  name?: string;
  email?: string;
  age?: number;
  isActive?: boolean;
}

interface ApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
  put<T>(url: string, data: any): Promise<T>;
  delete(url: string): Promise<void>;
}

// 함수들
function createUser(userData: UserCreateData): Omit<User, 'id'> {
  return {
    ...userData,
    createdAt: new Date(),
    isActive: true
  };
}

function updateUser(user: User, updates: UserUpdateData): User {
  return { 
    ...user, 
    ...updates, 
    updatedAt: new Date() 
  };
}

// 클래스
class UserService {
  private apiClient: ApiClient;
  private cache: Map<string, User>;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
    this.cache = new Map<string, User>();
  }

  async getUser(id: string): Promise<User | null> {
    if (this.cache.has(id)) {
      const cachedUser = this.cache.get(id);
      return cachedUser || null;
    }

    try {
      const user = await this.apiClient.get<User>(`/users/${id}`);
      this.cache.set(id, user);
      return user;
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      return null;
    }
  }

  async createUser(userData: UserCreateData): Promise<User> {
    const userTemplate = createUser(userData);
    const user = await this.apiClient.post<User>('/users', userTemplate);
    this.cache.set(user.id, user);
    return user;
  }

  async updateUser(id: string, updates: UserUpdateData): Promise<User | null> {
    const existingUser = await this.getUser(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    const updatedUser = updateUser(existingUser, updates);
    const response = await this.apiClient.put<User>(`/users/${id}`, updatedUser);
    this.cache.set(id, response);
    return response;
  }

  async deleteUser(id: string): Promise<void> {
    await this.apiClient.delete(`/users/${id}`);
    this.cache.delete(id);
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

// 사용 예제
/* 
Codex 명령어: "Add usage examples with error handling"

// API 클라이언트 구현
class HttpApiClient implements ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async put<T>(url: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async delete(url: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
}

// 사용 예제
async function example() {
  const apiClient = new HttpApiClient('https://api.example.com');
  const userService = new UserService(apiClient);

  try {
    // 새 사용자 생성
    const newUser = await userService.createUser({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });
    console.log('Created user:', newUser);

    // 사용자 조회
    const user = await userService.getUser(newUser.id);
    console.log('Retrieved user:', user);

    // 사용자 업데이트
    const updatedUser = await userService.updateUser(newUser.id, {
      age: 31,
      isActive: true
    });
    console.log('Updated user:', updatedUser);
  } catch (error) {
    console.error('Error:', error);
  }
}
*/

export { User, UserCreateData, UserUpdateData, ApiClient, UserService, createUser, updateUser };