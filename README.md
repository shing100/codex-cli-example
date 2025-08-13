# OpenAI Codex CLI 사용법 및 예제

OpenAI Codex CLI에 대한 종합적인 사용법 조사 및 실습 예제 모음

## 📋 목차

- [개요](#개요)
- [설치 방법](#설치-방법)
- [기본 사용법](#기본-사용법)
- [실습 예제](#실습-예제)
- [고급 기능](#고급-기능)
- [모범 사례](#모범-사례)
- [문제 해결](#문제-해결)

## 📖 개요

OpenAI Codex CLI는 터미널에서 로컬로 실행되는 경량 코딩 에이전트입니다.

### 주요 특징

- **대화형 및 비대화형 모드** 지원
- **ChatGPT 및 OpenAI API** 인증
- **다양한 자율성 수준**의 샌드박스 모드
- **실험적 도구**로 활발한 개발 중
- **코드 리팩토링, 마이그레이션 생성, 테스트 작성** 등 지원

### 시스템 요구사항

- **운영체제**: macOS 12+, Ubuntu 20.04+/Debian 10+, Windows 11 (WSL2)
- **메모리**: 4-8 GB RAM 권장
- **Git**: 2.23+ (선택사항)

## 🚀 설치 방법

### 방법 1: npm을 통한 설치
```bash
npm i -g @openai/codex
```

### 방법 2: Homebrew를 통한 설치 (macOS)
```bash
brew install codex
```

### 설치 확인
```bash
codex --version
```

## 🔧 기본 사용법

### 1. 초기 설정 및 인증

```bash
# OpenAI API 키 설정
codex auth

# 또는 환경변수로 설정
export OPENAI_API_KEY=your_api_key_here
```

### 2. 대화형 모드

```bash
# 대화형 모드 시작
codex

# 프로젝트 디렉토리에서 시작
cd your-project
codex
```

### 3. 비대화형 모드

```bash
# 단일 명령 실행
codex "Refactor this function to use async/await"

# 파일 지정
codex --file src/app.js "Add error handling to this function"
```

## 💡 실습 예제

### 예제 1: React 컴포넌트 리팩토링

**작업**: 클래스형 컴포넌트를 함수형 컴포넌트로 변환

```bash
# 대상 파일이 있는 디렉토리에서
codex "Convert this class component to a functional component using React Hooks"
```

**Before:**
```javascript
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }
  
  componentDidMount() {
    this.fetchData();
  }
  
  fetchData = () => {
    // 데이터 fetch 로직
  }
  
  render() {
    return <div>{this.state.data}</div>;
  }
}
```

**After (Codex 결과):**
```javascript
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = () => {
    // 데이터 fetch 로직
  };
  
  return <div>{data}</div>;
};
```

### 예제 2: 데이터베이스 마이그레이션 생성

```bash
codex "Create a database migration to add user authentication tables"
```

### 예제 3: API 엔드포인트 생성

```bash
codex "Create a RESTful API endpoint for user management with CRUD operations"
```

### 예제 4: 테스트 코드 생성

```bash
codex "Write unit tests for this utility function using Jest"
```

## ⚙️ 고급 기능

### 샌드박스 모드 설정

```bash
# 안전한 모드 (읽기 전용)
codex --sandbox safe

# 제한된 모드 (파일 수정 허용)
codex --sandbox limited

# 전체 액세스 모드
codex --sandbox full
```

### 설정 파일 사용

`.codex.json` 파일을 프로젝트 루트에 생성:

```json
{
  "model": "gpt-4",
  "sandbox": "limited",
  "context": {
    "include": ["src/**/*.js", "src/**/*.ts"],
    "exclude": ["node_modules/**", "*.test.js"]
  }
}
```

### 커스텀 프롬프트 템플릿

```bash
# 프롬프트 템플릿 파일 생성
echo "Refactor the following code to follow ${STYLE} conventions:" > refactor.prompt

# 템플릿 사용
codex --template refactor.prompt --var STYLE=ESLint
```

## 📚 모범 사례

### 1. 명확한 지시사항 제공
```bash
# 좋은 예
codex "Convert this function to TypeScript with proper type annotations and error handling"

# 나쁜 예
codex "fix this"
```

### 2. 컨텍스트 제공
```bash
# 프로젝트 구조와 함께 작업
codex "Add Redux state management to this React component, following the existing store structure"
```

### 3. 단계별 접근
```bash
# 큰 작업을 작은 단위로 분할
codex "First, add TypeScript interfaces for the User model"
codex "Now, update the API service to use these interfaces"
```

## 🔍 활용 시나리오

### 개발 워크플로우

1. **코드 리뷰 준비**
   ```bash
   codex "Review this code for potential bugs and suggest improvements"
   ```

2. **문서화**
   ```bash
   codex "Add JSDoc comments to all functions in this file"
   ```

3. **성능 최적화**
   ```bash
   codex "Optimize this algorithm for better performance"
   ```

4. **보안 강화**
   ```bash
   codex "Add input validation and sanitization to this API endpoint"
   ```

### 학습 및 탐색

1. **새로운 기술 학습**
   ```bash
   codex "Explain how to implement OAuth 2.0 authentication in Express.js"
   ```

2. **코드 분석**
   ```bash
   codex "Explain what this complex function does and how it works"
   ```

## ⚠️ 주의사항

1. **실험적 도구**: Codex CLI는 실험 단계이므로 프로덕션 환경에서 주의 깊게 사용
2. **코드 검토**: 생성된 코드는 항상 검토 후 사용
3. **버전 관리**: 중요한 변경사항은 Git으로 추적
4. **API 비용**: OpenAI API 사용량 모니터링

## 🛠️ 문제 해결

### 일반적인 문제

1. **인증 오류**
   ```bash
   # API 키 재설정
   codex auth --reset
   ```

2. **모델 응답 없음**
   ```bash
   # 다른 모델 시도
   codex --model gpt-3.5-turbo
   ```

3. **네트워크 문제**
   ```bash
   # 연결 테스트
   codex --test-connection
   ```

## 📖 추가 자료

- [OpenAI Codex 공식 문서](https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started)
- [GitHub 리포지토리](https://github.com/openai/codex)
- [커뮤니티 예제](https://github.com/openai/codex/examples)

## 🤝 기여하기

이 프로젝트는 OpenAI Codex CLI 사용법을 연구하고 공유하기 위한 목적으로 만들어졌습니다. 
새로운 예제나 사용법을 발견하시면 언제든지 기여해 주세요!

---

**면책조항**: OpenAI Codex CLI는 실험적 도구입니다. 본 가이드의 정보는 참고용이며, 실제 사용 시에는 공식 문서를 확인하시기 바랍니다.