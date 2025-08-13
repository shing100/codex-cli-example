# OpenAI Codex CLI 모범 사례 가이드

## 🎯 효과적인 프롬프트 작성

### 1. 명확하고 구체적인 지시사항

#### ✅ 좋은 예시
```bash
# 구체적이고 명확한 지시
codex "Convert this class component to a functional component using React Hooks, preserving all lifecycle methods and state management"

# 기술적 요구사항 포함
codex "Add TypeScript interfaces for this API response, including optional fields and proper error handling"

# 코딩 스타일 지정
codex "Refactor this function to use modern ES6+ syntax with async/await and proper error handling"
```

#### ❌ 피해야 할 예시
```bash
# 너무 모호함
codex "fix this"

# 컨텍스트 부족
codex "make it better"

# 목표가 불분명
codex "update the code"
```

### 2. 단계별 접근법

#### 복잡한 작업을 작은 단위로 분할
```bash
# 1단계: 인터페이스 정의
codex "First, create TypeScript interfaces for the User and Product models"

# 2단계: 서비스 계층 구현
codex "Now create a service class that uses these interfaces for API calls"

# 3단계: 에러 핸들링 추가
codex "Add comprehensive error handling and validation to the service"

# 4단계: 테스트 작성
codex "Write unit tests for all service methods"
```

### 3. 컨텍스트 제공

#### 프로젝트 구조와 기존 패턴 설명
```bash
# 기존 아키텍처 고려
codex "Add a new user authentication middleware that follows our existing Express.js middleware pattern in the auth/ directory"

# 코딩 스타일 가이드 참조
codex "Refactor this component following our team's React coding standards: functional components, custom hooks, and TypeScript"

# 기존 라이브러리 활용
codex "Implement form validation using the existing Yup schema validation pattern used in other components"
```

## 🛠️ 워크플로우 최적화

### 1. 프로젝트 설정

#### .codex.json 설정 최적화
```json
{
  "model": "gpt-4",
  "sandbox": "limited",
  "context": {
    "include": [
      "src/**/*.{js,ts,tsx,jsx}",
      "lib/**/*.ts",
      "docs/**/*.md",
      "*.config.js",
      "package.json",
      "README.md"
    ],
    "exclude": [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "*.test.{js,ts}",
      "*.spec.{js,ts}",
      ".git/**"
    ]
  },
  "prompts": {
    "component": "Create a ${TYPE} component with TypeScript, following our design system patterns:",
    "api": "Create a REST API endpoint with proper validation, error handling, and documentation:",
    "test": "Write comprehensive tests using Jest and React Testing Library:",
    "refactor": "Refactor this code for better maintainability, performance, and TypeScript compliance:",
    "docs": "Add comprehensive JSDoc documentation with examples and type information:"
  },
  "templates": {
    "react-component": "./templates/component.template",
    "api-route": "./templates/api.template",
    "hook": "./templates/hook.template"
  }
}
```

### 2. 개발 워크플로우 통합

#### Git 훅과 연동
```bash
# pre-commit 훅에서 코드 품질 개선
#!/bin/sh
# .git/hooks/pre-commit

echo "Running Codex code review..."
git diff --cached --name-only --diff-filter=M | while read file; do
  if [[ $file == *.js ]] || [[ $file == *.ts ]]; then
    codex "Review this code for potential issues and suggest improvements" --file "$file"
  fi
done
```

#### CI/CD 파이프라인 통합
```yaml
# .github/workflows/code-review.yml
name: Automated Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  codex-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Codex
        run: npm install -g @openai/codex
      - name: Review Changed Files
        run: |
          git diff origin/main...HEAD --name-only | xargs -I {} codex "Review this file for potential improvements" --file {}
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

### 3. 팀 협업

#### 공통 프롬프트 템플릿 공유
```bash
# 팀 공용 템플릿 디렉토리 생성
mkdir -p .codex/templates

# 컴포넌트 생성 템플릿
cat > .codex/templates/component.template << 'EOF'
Create a React functional component with the following requirements:
- TypeScript with proper prop types
- Styled with our design system (Tailwind CSS)
- Accessibility features (ARIA labels, keyboard navigation)
- Error boundary handling
- Unit tests with React Testing Library
- JSDoc documentation

Component specification: ${COMPONENT_SPEC}
EOF
```

## 🔒 보안 모범 사례

### 1. 샌드박스 모드 활용

#### 프로젝트별 보안 레벨 설정
```bash
# 오픈소스 프로젝트 - 제한된 모드
cd opensource-project
echo '{"sandbox": "limited"}' > .codex.json

# 내부 프로젝트 - 안전 모드
cd internal-project  
echo '{"sandbox": "safe"}' > .codex.json

# 개인 실험 프로젝트 - 전체 모드 (주의)
cd experimental-project
echo '{"sandbox": "full"}' > .codex.json
```

### 2. 민감한 정보 보호

#### 환경변수 및 시크릿 관리
```bash
# .gitignore에 추가
echo ".codex/secrets.json" >> .gitignore
echo ".env.local" >> .gitignore

# 민감한 정보가 포함된 파일 제외
cat > .codex.json << 'EOF'
{
  "context": {
    "exclude": [
      "*.env*",
      "secrets/**",
      "config/production.json",
      "**/secrets.json"
    ]
  }
}
EOF
```

### 3. 코드 검토 자동화

#### 자동 보안 스캔
```bash
# 보안 취약점 검사 프롬프트
codex "Review this code for security vulnerabilities, focusing on input validation, SQL injection, XSS, and authentication issues"

# 민감한 정보 노출 검사
codex "Check this code for any hardcoded secrets, API keys, or sensitive information that should be moved to environment variables"
```

## 📊 성능 최적화

### 1. 컨텍스트 관리

#### 파일 크기 및 포함 범위 최적화
```json
{
  "context": {
    "maxFileSize": "100KB",
    "maxFiles": 50,
    "include": [
      "src/components/**/*.tsx",
      "src/hooks/**/*.ts",
      "src/utils/**/*.ts"
    ],
    "exclude": [
      "**/*.test.ts",
      "**/*.stories.tsx",
      "node_modules/**"
    ]
  }
}
```

### 2. 캐시 활용

#### 반복적인 작업 최적화
```bash
# 자주 사용하는 프롬프트를 별칭으로 저장
alias codex-component='codex "Create a React TypeScript component with proper props, hooks, and testing"'
alias codex-api='codex "Create an Express.js API endpoint with validation and error handling"'
alias codex-test='codex "Write comprehensive unit tests using Jest and proper mocking"'

# 프로젝트별 설정 저장
codex config save-project my-react-app
```

## 📋 코드 품질 관리

### 1. 일관된 코딩 스타일

#### ESLint 및 Prettier 통합
```bash
# 코드 스타일 적용
codex "Refactor this code to follow our ESLint configuration and add proper TypeScript types"

# 자동 포맷팅 후 개선
prettier --write src/**/*.{js,ts,tsx}
codex "Review the formatted code and suggest additional improvements for readability and maintainability"
```

### 2. 테스트 커버리지 개선

#### 테스트 자동 생성 워크플로우
```bash
# 1. 기능 구현
codex "Implement a user authentication service with login, logout, and token refresh"

# 2. 테스트 케이스 생성
codex "Create comprehensive unit tests for the authentication service, including edge cases and error scenarios"

# 3. 통합 테스트 추가
codex "Add integration tests for the authentication flow using supertest"

# 4. 커버리지 확인 및 개선
npm run test:coverage
codex "Review the test coverage report and suggest additional test cases for uncovered code paths"
```

### 3. 문서화 자동화

#### 자동 문서 생성
```bash
# API 문서 생성
codex "Generate comprehensive API documentation for these Express.js routes, including request/response examples"

# README 업데이트
codex "Update the README.md file to reflect the new features and include setup instructions"

# 타입 문서 생성
codex "Generate TypeScript documentation for all exported interfaces and types"
```

## 🚀 생산성 향상 팁

### 1. 자주 사용하는 명령어 스크립트화

#### Bash 스크립트 예제
```bash
#!/bin/bash
# codex-helpers.sh

# 새 React 컴포넌트 생성
create-component() {
  local name=$1
  local type=${2:-"functional"}
  
  echo "Creating $type component: $name"
  codex "Create a React $type component named $name with TypeScript, proper props interface, and basic styling" --output "src/components/$name.tsx"
  
  echo "Creating test file..."
  codex "Create comprehensive unit tests for the $name component" --output "src/components/$name.test.tsx"
  
  echo "Creating storybook story..."
  codex "Create a Storybook story for the $name component with different variants" --output "src/components/$name.stories.tsx"
}

# API 엔드포인트 생성
create-api() {
  local resource=$1
  
  echo "Creating API endpoints for $resource"
  codex "Create full CRUD API endpoints for $resource with validation, error handling, and documentation" --output "src/routes/$resource.ts"
  
  echo "Creating tests..."
  codex "Create integration tests for all $resource API endpoints" --output "src/routes/$resource.test.ts"
}
```

### 2. IDE 통합

#### VS Code 확장 프로그램 연동
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Codex: Refactor Current File",
      "type": "shell",
      "command": "codex",
      "args": [
        "Refactor this code for better maintainability and TypeScript compliance",
        "--file",
        "${file}"
      ],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Codex: Generate Tests",
      "type": "shell", 
      "command": "codex",
      "args": [
        "Create comprehensive unit tests for this file",
        "--file",
        "${file}",
        "--output",
        "${fileDirname}/${fileBasenameNoExtension}.test.${fileExtname}"
      ]
    }
  ]
}
```

### 3. 학습 및 개발

#### 코드 리뷰 자동화
```bash
# 코드 리뷰 체크리스트
codex-review() {
  local file=$1
  
  echo "🔍 Reviewing $file..."
  
  echo "1. Security check:"
  codex "Review this code for security vulnerabilities" --file "$file"
  
  echo "2. Performance check:"
  codex "Analyze this code for performance bottlenecks and suggest optimizations" --file "$file"
  
  echo "3. Best practices check:"
  codex "Review this code against industry best practices and coding standards" --file "$file"
  
  echo "4. Test coverage check:"
  codex "Identify areas that need additional test coverage" --file "$file"
}
```

## 📚 지속적인 학습

### 1. 새로운 기술 습득

#### 학습 도우미로 활용
```bash
# 새로운 라이브러리 학습
codex "Explain how to use React Query for data fetching and provide a practical example"

# 디자인 패턴 학습
codex "Demonstrate the Observer pattern in TypeScript with a real-world example"

# 최신 기능 탐색
codex "Show me how to use the latest React 18 features like Suspense and Concurrent Rendering"
```

### 2. 코드 분석 및 이해

#### 레거시 코드 분석
```bash
# 복잡한 코드 이해
codex "Explain what this complex function does, how it works, and suggest ways to improve its readability"

# 아키텍처 분석
codex "Analyze this application architecture and explain the design patterns being used"
```

이러한 모범 사례들을 따르면 OpenAI Codex CLI를 더욱 효과적으로 활용할 수 있습니다. 중요한 것은 일관성 있게 적용하고 팀 전체가 공유하는 것입니다.