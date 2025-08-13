# OpenAI Codex CLI 연구 프로젝트

이 프로젝트는 OpenAI Codex CLI의 사용법을 연구하고 실제 활용 예제를 제공하기 위해 만들어졌습니다.

## 🎯 프로젝트 목표

1. **OpenAI Codex CLI 기능 조사**: 공식 문서와 실제 사용을 통한 기능 분석
2. **실습 예제 작성**: 기초부터 고급까지 다양한 사용 예제 제공  
3. **모범 사례 문서화**: 효과적인 사용법과 워크플로우 정리
4. **한국어 가이드 제공**: 한국 개발자들을 위한 상세한 설명과 예제

## 📁 프로젝트 구조

```
codex-example/
├── README.md                    # 메인 가이드 (한국어)
├── CLAUDE.md                    # Claude Code 설정 파일
├── examples/                    # 실습 예제 모음
│   ├── basic/                   # 기초 예제
│   │   ├── react-component-example.js
│   │   ├── api-creation-example.js
│   │   └── test-generation-example.js
│   ├── advanced/                # 고급 예제
│   │   ├── typescript-migration.ts
│   │   └── database-migration.sql
│   └── real-world/              # 실제 프로젝트 예제
│       └── e-commerce-api.js
├── docs/                        # 문서
│   ├── installation-guide.md    # 설치 가이드
│   └── best-practices.md        # 모범 사례
└── config/                      # 설정 파일
    └── .codex.json              # Codex CLI 설정 예제
```

## 🔧 개발 환경 설정

이 프로젝트를 Claude Code에서 효과적으로 작업하기 위한 설정입니다.

### 주요 명령어

- `npm run docs` - 문서 업데이트 및 정리
- `npm run examples` - 예제 코드 검증
- `npm run lint` - 코드 스타일 검사

### 작업 워크플로우

1. **조사 단계**: OpenAI Codex CLI 공식 문서 및 리소스 분석
2. **실습 단계**: 직접 사용해보며 예제 작성
3. **문서화 단계**: 사용법과 모범 사례 정리
4. **검증 단계**: 예제 코드와 가이드 검토

## 📚 학습 리소스

### 공식 문서
- [OpenAI Codex CLI 시작 가이드](https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started)
- [GitHub 리포지토리](https://github.com/openai/codex)

### 참고 프로젝트
- `claude-code-usage/` - Claude Code 사용법 연구 프로젝트
- `SuperClaude_Framework/` - SuperClaude 프레임워크

## 🎯 Claude Code 작업 지침

### 이 프로젝트에서 작업할 때:

1. **실제 사용 중심**: 이론보다는 실제 활용 가능한 예제에 집중
2. **단계별 접근**: 기초 → 중급 → 고급 순서로 예제 작성
3. **한국어 문서화**: 한국 개발자들이 이해하기 쉬운 설명 제공
4. **실용성 우선**: 실제 개발 현장에서 바로 적용 가능한 내용

### 예제 작성 원칙:

- **Before/After 형식**: 변환 전후 코드를 명확히 보여주기
- **명령어 포함**: 실제 Codex 명령어를 주석으로 기록
- **설명 추가**: 각 예제의 목적과 활용 상황 설명
- **점진적 복잡도**: 간단한 것부터 복잡한 것 순서로 배치

이 프로젝트는 OpenAI Codex CLI를 처음 접하는 개발자부터 고급 사용자까지 모두에게 도움이 되는 종합 가이드를 목표로 합니다.