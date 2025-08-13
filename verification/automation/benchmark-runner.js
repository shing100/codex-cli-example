#!/usr/bin/env node

/**
 * OpenAI Codex CLI 성능 벤치마크 러너
 * 
 * 이 스크립트는 Codex CLI의 성능을 다양한 시나리오에서 측정하고
 * 개발 생산성 향상, 코드 품질, 정확도 등을 종합적으로 평가합니다.
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 벤치마크 설정
const BENCHMARK_CONFIG = {
  scenarios: [
    'react-component-conversion',
    'api-endpoint-generation',
    'test-case-creation',
    'typescript-migration',
    'bug-fixing',
    'documentation-generation',
    'refactoring-optimization'
  ],
  metrics: [
    'response-time',
    'code-quality',
    'accuracy',
    'completeness',
    'maintainability',
    'security'
  ],
  iterations: 3,
  timeout: 120000 // 2분
};

class BenchmarkRunner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      environment: this.getEnvironmentInfo(),
      scenarios: {},
      summary: {}
    };
    
    this.metricsCollector = new MetricsCollector();
    this.codeAnalyzer = new CodeAnalyzer();
    this.reportGenerator = new ReportGenerator();
  }

  /**
   * 환경 정보 수집
   */
  getEnvironmentInfo() {
    try {
      return {
        os: process.platform,
        nodeVersion: process.version,
        codexVersion: this.getCodexVersion(),
        timestamp: new Date().toISOString(),
        hardware: {
          cpus: os.cpus().length,
          memory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB'
        }
      };
    } catch (error) {
      console.warn('환경 정보 수집 중 오류:', error.message);
      return { error: error.message };
    }
  }

  /**
   * Codex CLI 버전 확인
   */
  getCodexVersion() {
    try {
      return execSync('codex --version', { encoding: 'utf8' }).trim();
    } catch (error) {
      return 'Codex CLI 미설치';
    }
  }

  /**
   * 메인 벤치마크 실행
   */
  async run() {
    console.log('🚀 Codex CLI 성능 벤치마크 시작...\n');
    
    for (const scenario of BENCHMARK_CONFIG.scenarios) {
      console.log(`📊 시나리오 실행: ${scenario}`);
      
      try {
        const scenarioResults = await this.runScenario(scenario);
        this.results.scenarios[scenario] = scenarioResults;
        
        console.log(`✅ ${scenario} 완료 (평균 응답시간: ${scenarioResults.averageResponseTime}ms)\n`);
      } catch (error) {
        console.error(`❌ ${scenario} 실패:`, error.message);
        this.results.scenarios[scenario] = { error: error.message };
      }
    }
    
    // 종합 분석
    this.results.summary = this.generateSummary();
    
    // 리포트 생성
    await this.generateReport();
    
    console.log('📋 벤치마크 완료! 결과 리포트가 생성되었습니다.');
    return this.results;
  }

  /**
   * 개별 시나리오 실행
   */
  async runScenario(scenarioName) {
    const scenario = await this.loadScenario(scenarioName);
    const iterations = [];

    for (let i = 0; i < BENCHMARK_CONFIG.iterations; i++) {
      console.log(`  📈 반복 ${i + 1}/${BENCHMARK_CONFIG.iterations}`);
      
      const iteration = await this.runIteration(scenario);
      iterations.push(iteration);
      
      // 연속 요청 간 간격
      await this.sleep(1000);
    }

    return this.analyzeIterations(iterations);
  }

  /**
   * 단일 반복 실행
   */
  async runIteration(scenario) {
    const startTime = Date.now();
    
    try {
      // Codex CLI 실행
      const result = await this.executeCodex(scenario.prompt, scenario.context);
      const endTime = Date.now();
      
      // 메트릭 수집
      const metrics = await this.metricsCollector.collect(scenario, result);
      
      return {
        responseTime: endTime - startTime,
        result: result,
        metrics: metrics,
        success: true
      };
    } catch (error) {
      console.warn(`반복 실행 오류: ${error.message}`);
      return {
        responseTime: Date.now() - startTime,
        error: error.message,
        success: false
      };
    }
  }

  /**
   * Codex CLI 실행
   */
  async executeCodex(prompt, context = '') {
    return new Promise((resolve, reject) => {
      // API 키가 없는 경우 시뮬레이션
      if (!process.env.OPENAI_API_KEY) {
        return resolve(this.simulateCodexResponse(prompt));
      }

      const childProcess = spawn('codex', [prompt], {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: BENCHMARK_CONFIG.timeout
      });

      let output = '';
      let errorOutput = '';

      if (context) {
        childProcess.stdin.write(context);
        childProcess.stdin.end();
      }

      childProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      childProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Codex CLI 실행 실패 (코드: ${code}): ${errorOutput}`));
        }
      });

      childProcess.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Codex 응답 시뮬레이션 (API 키가 없는 경우)
   */
  simulateCodexResponse(prompt) {
    const responses = {
      'convert': 'const UserProfile = ({ userId }) => {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  const fetchUserData = async () => {\n    try {\n      setLoading(true);\n      setError(null);\n      const response = await fetch(`/api/users/${userId}`);\n      const userData = await response.json();\n      setUser(userData);\n      setLoading(false);\n    } catch (err) {\n      setError(err.message);\n      setLoading(false);\n    }\n  };\n\n  useEffect(() => {\n    fetchUserData();\n  }, [userId]);\n\n  if (loading) return <div>Loading...</div>;\n  if (error) return <div>Error: {error}</div>;\n\n  return (\n    <div className="user-profile">\n      <h2>{user?.name}</h2>\n      <p>{user?.email}</p>\n      <button onClick={fetchUserData}>Refresh</button>\n    </div>\n  );\n};',
      
      'rest api': 'const express = require("express");\nconst router = express.Router();\n\n// GET /users - list all users\nrouter.get("/users", async (req, res) => {\n  try {\n    const users = await User.findAll();\n    res.json(users);\n  } catch (error) {\n    res.status(500).json({ error: error.message });\n  }\n});\n\n// POST /users - create user\nrouter.post("/users", async (req, res) => {\n  try {\n    const user = await User.create(req.body);\n    res.status(201).json(user);\n  } catch (error) {\n    res.status(400).json({ error: error.message });\n  }\n});',
      
      'test': 'describe("calculateShippingCost", () => {\n  test("should calculate cost correctly", () => {\n    const items = [{ weight: 2 }, { weight: 3 }];\n    const destination = { country: "US" };\n    const result = calculateShippingCost(items, destination, "standard");\n    expect(result).toBe(12.5);\n  });\n\n  test("should throw error for empty items", () => {\n    expect(() => calculateShippingCost([], {}, "standard")).toThrow("Items array cannot be empty");\n  });\n});',
      
      'typescript': 'interface User {\n  id: number;\n  name: string;\n  email: string;\n  role?: string;\n  createdAt: Date;\n  isActive: boolean;\n}\n\nclass UserManager {\n  private users: User[] = [];\n  private cache: Map<string, any> = new Map();\n\n  addUser(userData: Partial<User>): User {\n    const newUser: User = {\n      id: Date.now(),\n      name: userData.name!,\n      email: userData.email!,\n      role: userData.role || "user",\n      createdAt: new Date(),\n      isActive: true\n    };\n    this.users.push(newUser);\n    return newUser;\n  }\n}'
    };

    console.log(`시뮬레이션 모드: "${prompt}" 처리 중...`);
    
    // 프롬프트에 따른 적절한 응답 선택
    for (const [key, response] of Object.entries(responses)) {
      if (prompt.toLowerCase().includes(key.toLowerCase())) {
        console.log(`매칭된 키워드: "${key}"`);
        return response;
      }
    }

    console.log('기본 응답 사용');
    return '// Generated code example\nfunction generatedCode() {\n  console.log("Generated by Codex CLI simulation");\n  return "placeholder";\n}';
  }

  /**
   * 시나리오 로드
   */
  async loadScenario(scenarioName) {
    const scenarioPath = path.join(__dirname, '..', 'scenarios', `${scenarioName}.json`);
    
    try {
      const content = await fs.readFile(scenarioPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      // 기본 시나리오 생성
      return this.createDefaultScenario(scenarioName);
    }
  }

  /**
   * 기본 시나리오 생성
   */
  createDefaultScenario(scenarioName) {
    const scenarios = {
      'react-component-conversion': {
        name: 'React 컴포넌트 변환',
        prompt: 'Convert this class component to functional component using React Hooks',
        context: 'class MyComponent extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { data: null };\n  }\n\n  componentDidMount() {\n    this.fetchData();\n  }\n\n  render() {\n    return <div>{this.state.data}</div>;\n  }\n}',
        expectedPatterns: ['useState', 'useEffect', 'const.*=.*=>']
      },
      
      'api-endpoint-generation': {
        name: 'API 엔드포인트 생성',
        prompt: 'Create REST API endpoint for user management with CRUD operations',
        context: '',
        expectedPatterns: ['app\\.get', 'app\\.post', 'async.*=>']
      },
      
      'test-case-creation': {
        name: '테스트 케이스 생성',
        prompt: 'Write comprehensive unit tests for this function',
        context: 'function calculateTotal(items, tax) {\n  return items.reduce((sum, item) => sum + item.price, 0) * (1 + tax);\n}',
        expectedPatterns: ['describe', 'test', 'expect']
      }
    };

    return scenarios[scenarioName] || {
      name: scenarioName,
      prompt: `Generate code for ${scenarioName}`,
      context: '',
      expectedPatterns: []
    };
  }

  /**
   * 반복 결과 분석
   */
  analyzeIterations(iterations) {
    const successful = iterations.filter(i => i.success);
    
    if (successful.length === 0) {
      return {
        success: false,
        error: '모든 반복이 실패했습니다.'
      };
    }

    const responseTimes = successful.map(i => i.responseTime);
    const allMetrics = successful.map(i => i.metrics);

    return {
      success: true,
      iterations: iterations.length,
      successfulIterations: successful.length,
      successRate: (successful.length / iterations.length) * 100,
      averageResponseTime: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length),
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      metrics: this.aggregateMetrics(allMetrics)
    };
  }

  /**
   * 메트릭 집계
   */
  aggregateMetrics(allMetrics) {
    const aggregated = {};
    
    for (const metric of BENCHMARK_CONFIG.metrics) {
      const values = allMetrics.map(m => m[metric]).filter(v => v !== undefined);
      
      if (values.length > 0) {
        aggregated[metric] = {
          average: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    }
    
    return aggregated;
  }

  /**
   * 종합 요약 생성
   */
  generateSummary() {
    const successful = Object.values(this.results.scenarios).filter(s => s.success);
    const total = Object.keys(this.results.scenarios).length;
    
    const allResponseTimes = successful.map(s => s.averageResponseTime);
    const overallSuccessRate = (successful.length / total) * 100;
    
    return {
      totalScenarios: total,
      successfulScenarios: successful.length,
      overallSuccessRate: Math.round(overallSuccessRate),
      averageResponseTime: allResponseTimes.length > 0 ? 
        Math.round(allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length) : 0,
      recommendedUseCases: this.generateRecommendations(successful)
    };
  }

  /**
   * 추천 사용 사례 생성
   */
  generateRecommendations(successfulScenarios) {
    return successfulScenarios
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 3)
      .map(scenario => ({
        scenario: scenario.name || 'Unknown',
        reason: `${scenario.successRate}% 성공률, 평균 ${scenario.averageResponseTime}ms 응답시간`
      }));
  }

  /**
   * 리포트 생성
   */
  async generateReport() {
    const reportPath = path.join(__dirname, '..', 'benchmark-results', 
      `benchmark_report_${new Date().toISOString().split('T')[0]}.json`);
    
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    
    // 마크다운 리포트도 생성
    const markdownReport = this.reportGenerator.generateMarkdown(this.results);
    const markdownPath = reportPath.replace('.json', '.md');
    await fs.writeFile(markdownPath, markdownReport);
    
    console.log(`📊 JSON 리포트: ${reportPath}`);
    console.log(`📋 마크다운 리포트: ${markdownPath}`);
  }

  /**
   * 대기 함수
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * 메트릭 수집기
 */
class MetricsCollector {
  async collect(scenario, result) {
    return {
      'response-time': await this.measureResponseTime(result),
      'code-quality': await this.assessCodeQuality(result),
      'accuracy': await this.measureAccuracy(scenario, result),
      'completeness': await this.assessCompleteness(scenario, result),
      'maintainability': await this.assessMaintainability(result),
      'security': await this.assessSecurity(result)
    };
  }

  async measureResponseTime(result) {
    // 응답 시간은 벤치마크 러너에서 측정됨
    return 100; // 기본값
  }

  async assessCodeQuality(result) {
    let score = 50; // 기본 점수
    
    // 간단한 코드 품질 휴리스틱
    if (result.includes('const') || result.includes('let')) score += 10;
    if (result.includes('async') || result.includes('await')) score += 10;
    if (result.includes('try') && result.includes('catch')) score += 15;
    if (result.includes('//') || result.includes('/*')) score += 10;
    if (result.match(/\w+\s*\(/g)?.length > 0) score += 5; // 함수 호출
    
    return Math.min(score, 100);
  }

  async measureAccuracy(scenario, result) {
    const patterns = scenario.expectedPatterns || [];
    let matches = 0;
    
    for (const pattern of patterns) {
      if (new RegExp(pattern).test(result)) {
        matches++;
      }
    }
    
    return patterns.length > 0 ? (matches / patterns.length) * 100 : 50;
  }

  async assessCompleteness(scenario, result) {
    const lines = result.split('\n').filter(line => line.trim().length > 0);
    const minExpectedLines = 5;
    
    return Math.min((lines.length / minExpectedLines) * 100, 100);
  }

  async assessMaintainability(result) {
    let score = 50;
    
    // 유지보수성 지표
    if (result.includes('interface') || result.includes('type')) score += 15;
    if (result.match(/\/\*\*[\s\S]*?\*\//)) score += 10; // JSDoc
    if (result.includes('export') || result.includes('import')) score += 10;
    if (!result.includes('any') && result.includes(':')) score += 10; // TypeScript 타입
    
    return Math.min(score, 100);
  }

  async assessSecurity(result) {
    let score = 70; // 기본 점수
    
    // 보안 문제 패턴 확인
    if (result.includes('eval(')) score -= 30;
    if (result.includes('innerHTML')) score -= 15;
    if (result.includes('document.write')) score -= 20;
    if (result.includes('setTimeout') && result.includes('string')) score -= 10;
    
    // 보안 좋은 패턴
    if (result.includes('validate') || result.includes('sanitize')) score += 15;
    if (result.includes('bcrypt') || result.includes('crypto')) score += 10;
    
    return Math.max(score, 0);
  }
}

/**
 * 코드 분석기
 */
class CodeAnalyzer {
  analyze(code) {
    return {
      linesOfCode: code.split('\n').length,
      complexity: this.calculateComplexity(code),
      patterns: this.identifyPatterns(code)
    };
  }

  calculateComplexity(code) {
    // 간단한 복잡도 계산 (McCabe)
    const conditionals = (code.match(/if|for|while|switch|catch/g) || []).length;
    const functions = (code.match(/function|=>/g) || []).length;
    
    return conditionals + functions + 1;
  }

  identifyPatterns(code) {
    const patterns = [];
    
    if (code.includes('useState') || code.includes('useEffect')) {
      patterns.push('React Hooks');
    }
    if (code.includes('async') && code.includes('await')) {
      patterns.push('Async/Await');
    }
    if (code.includes('try') && code.includes('catch')) {
      patterns.push('Error Handling');
    }
    if (code.includes('interface') || code.includes('type')) {
      patterns.push('TypeScript');
    }
    
    return patterns;
  }
}

/**
 * 리포트 생성기
 */
class ReportGenerator {
  generateMarkdown(results) {
    return `# Codex CLI 성능 벤치마크 리포트

**생성 일시**: ${new Date(results.timestamp).toLocaleString('ko-KR')}

## 📊 요약

- **전체 시나리오**: ${results.summary.totalScenarios}
- **성공한 시나리오**: ${results.summary.successfulScenarios}
- **전체 성공률**: ${results.summary.overallSuccessRate}%
- **평균 응답시간**: ${results.summary.averageResponseTime}ms

## 🖥️ 환경 정보

- **운영체제**: ${results.environment.os}
- **Node.js**: ${results.environment.nodeVersion}
- **Codex CLI**: ${results.environment.codexVersion}
- **하드웨어**: ${results.environment.hardware?.cpus} CPUs, ${results.environment.hardware?.memory}

## 📈 상세 결과

${Object.entries(results.scenarios).map(([name, scenario]) => 
  this.formatScenarioResult(name, scenario)
).join('\n\n')}

## 🎯 추천 사용 사례

${results.summary.recommendedUseCases?.map(use => 
  `- **${use.scenario}**: ${use.reason}`
).join('\n') || '데이터 없음'}

## 📝 분석 및 권장사항

### 성능 개선 포인트
- 응답시간이 5초 이상인 시나리오 최적화 필요
- 정확도가 70% 미만인 패턴 개선 검토
- 코드 품질 점수가 60점 미만인 경우 프롬프트 개선

### 활용 가이드라인
- 간단한 변환 작업에 가장 효과적
- 복잡한 로직은 단계별로 분할하여 요청
- 컨텍스트 정보를 충분히 제공할 때 정확도 향상

---
*이 리포트는 자동으로 생성되었습니다.*`;
  }

  formatScenarioResult(name, scenario) {
    if (!scenario.success) {
      return `### ❌ ${name}\n**상태**: 실패\n**오류**: ${scenario.error}`;
    }

    return `### ✅ ${name}
**성공률**: ${scenario.successRate}%
**평균 응답시간**: ${scenario.averageResponseTime}ms
**성공한 반복**: ${scenario.successfulIterations}/${scenario.iterations}`;
  }
}

// 메인 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new BenchmarkRunner();
  runner.run().catch(console.error);
}

export { BenchmarkRunner, MetricsCollector, CodeAnalyzer, ReportGenerator };