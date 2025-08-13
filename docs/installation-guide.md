# OpenAI Codex CLI 설치 및 설정 가이드

## 📋 설치 전 준비사항

### 시스템 요구사항
- **운영체제**: macOS 12+, Ubuntu 20.04+/Debian 10+, Windows 11 (WSL2 필요)
- **메모리**: 최소 4GB RAM, 권장 8GB
- **Node.js**: 18.0.0 이상 (npm 방식 설치 시)
- **Git**: 2.23+ (선택사항, 버전 관리용)

### OpenAI API 키 준비
1. [OpenAI 플랫폼](https://platform.openai.com/)에서 계정 생성
2. API 키 발급 및 저장

## 🚀 설치 방법

### 방법 1: npm을 통한 글로벌 설치 (권장)

```bash
# Node.js 버전 확인
node --version  # v18.0.0 이상 필요

# Codex CLI 설치
npm install -g @openai/codex

# 설치 확인
codex --version
```

### 방법 2: Homebrew 설치 (macOS)

```bash
# Homebrew가 설치되어 있지 않은 경우
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Codex CLI 설치
brew install codex

# 설치 확인
codex --version
```

### 방법 3: 바이너리 다운로드

GitHub 릴리스 페이지에서 운영체제별 바이너리를 다운로드:
```bash
# Linux/macOS
curl -L https://github.com/openai/codex/releases/latest/download/codex-linux -o codex
chmod +x codex
sudo mv codex /usr/local/bin/

# Windows (PowerShell)
Invoke-WebRequest -Uri "https://github.com/openai/codex/releases/latest/download/codex-windows.exe" -OutFile "codex.exe"
```

## 🔧 초기 설정

### 1. API 키 설정

#### 대화형 설정 (권장)
```bash
codex auth
# OpenAI API 키 입력 프롬프트가 나타남
```

#### 환경변수 설정
```bash
# Linux/macOS
export OPENAI_API_KEY="your-api-key-here"
echo 'export OPENAI_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc

# Windows (PowerShell)
$env:OPENAI_API_KEY="your-api-key-here"
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "your-api-key-here", "User")
```

#### 설정 파일 사용
```bash
# ~/.config/codex/config.json 생성
mkdir -p ~/.config/codex
cat > ~/.config/codex/config.json << EOF
{
  "apiKey": "your-api-key-here",
  "model": "gpt-4",
  "organization": "your-org-id"
}
EOF
```

### 2. 기본 설정 확인

```bash
# 연결 테스트
codex --test-connection

# 현재 설정 확인
codex config show

# 사용 가능한 모델 확인
codex models list
```

### 3. 프로젝트별 설정

프로젝트 루트에 `.codex.json` 파일 생성:

```json
{
  "model": "gpt-4",
  "sandbox": "limited",
  "context": {
    "include": ["src/**/*.js", "src/**/*.ts"],
    "exclude": ["node_modules/**", "*.test.js"]
  },
  "prompts": {
    "refactor": "Refactor this code to be more maintainable:",
    "test": "Write unit tests for this function:",
    "document": "Add JSDoc comments to this code:"
  }
}
```

## 🛡️ 보안 설정

### 샌드박스 모드 설정

```bash
# 안전 모드 (읽기 전용)
codex config set sandbox safe

# 제한 모드 (파일 수정 허용, 시스템 명령 제한)
codex config set sandbox limited

# 전체 모드 (모든 작업 허용, 주의 필요)
codex config set sandbox full
```

### API 키 보안

1. **환경변수 사용 권장**: 설정 파일보다 환경변수가 더 안전
2. **키 로테이션**: 정기적으로 API 키 갱신
3. **권한 제한**: 필요한 최소 권한만 부여
4. **모니터링**: API 사용량 정기 확인

## 🔍 설치 문제 해결

### 일반적인 문제들

#### 1. 권한 오류 (npm 설치 시)
```bash
# 해결 방법 1: sudo 사용 (권장하지 않음)
sudo npm install -g @openai/codex

# 해결 방법 2: npm 설정 변경 (권장)
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @openai/codex
```

#### 2. Node.js 버전 문제
```bash
# nvm 설치 및 최신 Node.js 사용
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

#### 3. 네트워크 연결 문제
```bash
# 프록시 설정 (필요한 경우)
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 또는 환경변수로
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

#### 4. API 키 인증 오류
```bash
# API 키 재설정
codex auth --reset

# 설정 파일 확인
codex config show

# 연결 테스트
codex --test-connection
```

### Windows 전용 문제

#### WSL2 설정 (Windows 11)
```powershell
# WSL2 활성화
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 재부팅 후 WSL2를 기본값으로 설정
wsl --set-default-version 2

# Ubuntu 설치
wsl --install -d Ubuntu
```

## ✅ 설치 검증

### 기본 테스트
```bash
# 버전 확인
codex --version

# 도움말 확인
codex --help

# 연결 테스트
codex --test-connection

# 간단한 명령 테스트
echo "console.log('hello');" | codex "Add error handling to this code"
```

### 고급 테스트
```bash
# 프로젝트 폴더에서 테스트
mkdir test-project && cd test-project
echo "function add(a, b) { return a + b; }" > utils.js
codex "Add TypeScript type annotations to this function"

# 대화형 모드 테스트
codex
# > "Create a simple React component"
# > exit
```

## 🔄 업데이트

### npm을 통한 업데이트
```bash
# 현재 버전 확인
npm list -g @openai/codex

# 최신 버전으로 업데이트
npm update -g @openai/codex

# 특정 버전 설치
npm install -g @openai/codex@1.2.3
```

### Homebrew를 통한 업데이트
```bash
# 업데이트
brew upgrade codex

# 버전 확인
brew list --versions codex
```

## 📚 다음 단계

설치가 완료되었다면:

1. [기본 사용법 가이드](./usage-guide.md) 확인
2. [예제 모음](../examples/) 둘러보기
3. [모범 사례](./best-practices.md) 학습
4. [문제 해결 가이드](./troubleshooting.md) 북마크

## 🆘 도움이 필요한 경우

- **공식 문서**: https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started
- **GitHub Issues**: https://github.com/openai/codex/issues
- **커뮤니티 포럼**: https://community.openai.com/
- **Discord**: OpenAI 공식 Discord 서버

설치 과정에서 문제가 발생하면 위 리소스를 참고하거나 이슈를 등록해 주세요.