#!/bin/bash

# =============================================================================
# OpenAI Codex CLI 예제 검증 마스터 스크립트
# =============================================================================

set -e  # 에러 발생 시 즉시 종료

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로깅 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RESULTS_DIR="$PROJECT_ROOT/verification/benchmark-results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="$RESULTS_DIR/verification_report_$TIMESTAMP.md"

# 결과 디렉토리 생성
mkdir -p "$RESULTS_DIR"

# 전역 변수
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# =============================================================================
# 헬퍼 함수들
# =============================================================================

check_prerequisites() {
    log_info "환경 점검 중..."
    
    # Node.js 확인
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        log_success "Node.js 확인됨: $NODE_VERSION"
    else
        log_warning "Node.js가 설치되지 않음 (일부 테스트 제한됨)"
    fi
    
    # OpenAI Codex CLI 확인
    if command -v codex >/dev/null 2>&1; then
        CODEX_VERSION=$(codex --version 2>/dev/null || echo "버전 확인 불가")
        log_success "Codex CLI 확인됨: $CODEX_VERSION"
        return 0
    else
        log_warning "Codex CLI가 설치되지 않음 (시뮬레이션 모드로 실행)"
        return 1
    fi
}

# API 키 확인
check_api_key() {
    if [ -n "$OPENAI_API_KEY" ]; then
        log_success "OpenAI API 키 설정됨"
        return 0
    else
        log_warning "OpenAI API 키가 설정되지 않음 (일부 테스트 제한됨)"
        return 1
    fi
}

# 테스트 결과 기록
record_test_result() {
    local test_name="$1"
    local status="$2"
    local details="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    case $status in
        "PASS")
            PASSED_TESTS=$((PASSED_TESTS + 1))
            log_success "✅ $test_name"
            ;;
        "FAIL")
            FAILED_TESTS=$((FAILED_TESTS + 1))
            log_error "❌ $test_name"
            [ -n "$details" ] && log_error "   Details: $details"
            ;;
        "SKIP")
            SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
            log_warning "⏭️  $test_name (SKIPPED)"
            [ -n "$details" ] && log_warning "   Reason: $details"
            ;;
    esac
}

# =============================================================================
# 개별 예제 검증 함수들
# =============================================================================

test_react_component_example() {
    log_info "React 컴포넌트 예제 검증 중..."
    
    local example_file="$PROJECT_ROOT/examples/basic/react-component-example.js"
    
    if [ ! -f "$example_file" ]; then
        record_test_result "React Component Example - File Existence" "FAIL" "파일이 존재하지 않음"
        return 1
    fi
    
    # 구문 검사 (Node.js 사용)
    if command -v node >/dev/null 2>&1; then
        if node -c "$example_file" >/dev/null 2>&1; then
            record_test_result "React Component Example - Syntax Check" "PASS"
        else
            record_test_result "React Component Example - Syntax Check" "FAIL" "구문 오류 발견"
            return 1
        fi
    else
        record_test_result "React Component Example - Syntax Check" "SKIP" "Node.js 없음"
    fi
    
    # 내용 검증
    if grep -q "class UserProfile extends React.Component" "$example_file" && \
       grep -q "const UserProfile = ({ userId })" "$example_file"; then
        record_test_result "React Component Example - Content Validation" "PASS"
    else
        record_test_result "React Component Example - Content Validation" "FAIL" "Before/After 예제가 완전하지 않음"
    fi
    
    # Codex 명령어 포함 여부 확인
    if grep -q "codex.*Convert this class component" "$example_file"; then
        record_test_result "React Component Example - Codex Command" "PASS"
    else
        record_test_result "React Component Example - Codex Command" "FAIL" "Codex 명령어가 누락됨"
    fi
}

test_api_creation_example() {
    log_info "API 생성 예제 검증 중..."
    
    local example_file="$PROJECT_ROOT/examples/basic/api-creation-example.js"
    
    if [ ! -f "$example_file" ]; then
        record_test_result "API Creation Example - File Existence" "FAIL" "파일이 존재하지 않음"
        return 1
    fi
    
    # Express.js 관련 코드 확인
    if grep -q "express" "$example_file" && \
       grep -q "router\." "$example_file"; then
        record_test_result "API Creation Example - Express Code" "PASS"
    else
        record_test_result "API Creation Example - Express Code" "FAIL" "Express.js 코드가 누락됨"
    fi
    
    # CRUD 오퍼레이션 확인
    local crud_operations=("GET" "POST" "PUT" "DELETE")
    local missing_operations=""
    
    for op in "${crud_operations[@]}"; do
        if ! grep -q "$op" "$example_file"; then
            missing_operations="$missing_operations $op"
        fi
    done
    
    if [ -z "$missing_operations" ]; then
        record_test_result "API Creation Example - CRUD Operations" "PASS"
    else
        record_test_result "API Creation Example - CRUD Operations" "FAIL" "누락된 오퍼레이션:$missing_operations"
    fi
}

test_typescript_migration_example() {
    log_info "TypeScript 마이그레이션 예제 검증 중..."
    
    local example_file="$PROJECT_ROOT/examples/advanced/typescript-migration.ts"
    
    if [ ! -f "$example_file" ]; then
        record_test_result "TypeScript Migration - File Existence" "FAIL" "파일이 존재하지 않음"
        return 1
    fi
    
    # TypeScript 특정 문법 확인
    if grep -q "interface" "$example_file" && \
       grep -q "type" "$example_file" && \
       grep -q ": string" "$example_file"; then
        record_test_result "TypeScript Migration - TS Syntax" "PASS"
    else
        record_test_result "TypeScript Migration - TS Syntax" "FAIL" "TypeScript 문법이 불완전함"
    fi
    
    # TypeScript 컴파일 테스트 (tsc가 있는 경우)
    if command -v tsc >/dev/null 2>&1; then
        if tsc --noEmit --target es2020 "$example_file" >/dev/null 2>&1; then
            record_test_result "TypeScript Migration - Compilation" "PASS"
        else
            record_test_result "TypeScript Migration - Compilation" "FAIL" "컴파일 오류"
        fi
    else
        record_test_result "TypeScript Migration - Compilation" "SKIP" "tsc 없음"
    fi
}

test_database_migration_example() {
    log_info "데이터베이스 마이그레이션 예제 검증 중..."
    
    local example_file="$PROJECT_ROOT/examples/advanced/database-migration.sql"
    
    if [ ! -f "$example_file" ]; then
        record_test_result "Database Migration - File Existence" "FAIL" "파일이 존재하지 않음"
        return 1
    fi
    
    # SQL 기본 문법 확인
    if grep -q "CREATE TABLE" "$example_file" && \
       grep -q "PRIMARY KEY" "$example_file" && \
       grep -q "REFERENCES" "$example_file"; then
        record_test_result "Database Migration - SQL Syntax" "PASS"
    else
        record_test_result "Database Migration - SQL Syntax" "FAIL" "SQL 문법이 불완전함"
    fi
    
    # 보안 관련 테이블 확인
    if grep -q "users" "$example_file" && \
       grep -q "user_sessions" "$example_file" && \
       grep -q "password_reset_tokens" "$example_file"; then
        record_test_result "Database Migration - Security Tables" "PASS"
    else
        record_test_result "Database Migration - Security Tables" "FAIL" "보안 관련 테이블이 누락됨"
    fi
}

test_ecommerce_api_example() {
    log_info "E-commerce API 예제 검증 중..."
    
    local example_file="$PROJECT_ROOT/examples/real-world/e-commerce-api.js"
    
    if [ ! -f "$example_file" ]; then
        record_test_result "E-commerce API - File Existence" "FAIL" "파일이 존재하지 않음"
        return 1
    fi
    
    # Express.js 및 의존성 확인
    if grep -q "express" "$example_file" && \
       grep -q "jwt" "$example_file" && \
       grep -q "bcrypt" "$example_file"; then
        record_test_result "E-commerce API - Dependencies" "PASS"
    else
        record_test_result "E-commerce API - Dependencies" "FAIL" "필수 의존성이 누락됨"
    fi
    
    # 주요 기능 확인
    local features=("auth" "products" "cart" "orders")
    local missing_features=""
    
    for feature in "${features[@]}"; do
        if ! grep -q "$feature" "$example_file"; then
            missing_features="$missing_features $feature"
        fi
    done
    
    if [ -z "$missing_features" ]; then
        record_test_result "E-commerce API - Core Features" "PASS"
    else
        record_test_result "E-commerce API - Core Features" "FAIL" "누락된 기능:$missing_features"
    fi
}

# =============================================================================
# 설정 파일 검증
# =============================================================================

test_codex_configuration() {
    log_info "Codex 설정 파일 검증 중..."
    
    local config_file="$PROJECT_ROOT/config/.codex.json"
    
    if [ ! -f "$config_file" ]; then
        record_test_result "Codex Configuration - File Existence" "FAIL" "설정 파일이 존재하지 않음"
        return 1
    fi
    
    # JSON 유효성 검사
    if command -v node >/dev/null 2>&1; then
        if node -e "JSON.parse(require('fs').readFileSync('$config_file', 'utf8'))" >/dev/null 2>&1; then
            record_test_result "Codex Configuration - JSON Validity" "PASS"
        else
            record_test_result "Codex Configuration - JSON Validity" "FAIL" "유효하지 않은 JSON"
            return 1
        fi
    else
        record_test_result "Codex Configuration - JSON Validity" "SKIP" "Node.js 없음"
    fi
    
    # 필수 필드 확인
    if grep -q "model" "$config_file" && \
       grep -q "sandbox" "$config_file" && \
       grep -q "context" "$config_file"; then
        record_test_result "Codex Configuration - Required Fields" "PASS"
    else
        record_test_result "Codex Configuration - Required Fields" "FAIL" "필수 필드가 누락됨"
    fi
}

# =============================================================================
# 실제 Codex CLI 테스트 (선택적)
# =============================================================================

test_codex_cli_integration() {
    log_info "Codex CLI 통합 테스트 중..."
    
    if ! command -v codex >/dev/null 2>&1; then
        record_test_result "Codex CLI Integration - CLI Available" "SKIP" "Codex CLI 미설치"
        return 0
    fi
    
    if [ -z "$OPENAI_API_KEY" ]; then
        record_test_result "Codex CLI Integration - API Key" "SKIP" "API 키 미설정"
        return 0
    fi
    
    # 간단한 테스트 실행
    local test_prompt="// Convert this to TypeScript\nfunction add(a, b) { return a + b; }"
    local temp_file=$(mktemp)
    echo "$test_prompt" > "$temp_file"
    
    if timeout 30 codex "Add TypeScript type annotations" --file "$temp_file" >/dev/null 2>&1; then
        record_test_result "Codex CLI Integration - Basic Test" "PASS"
    else
        record_test_result "Codex CLI Integration - Basic Test" "FAIL" "API 호출 실패 또는 타임아웃"
    fi
    
    rm -f "$temp_file"
}

# =============================================================================
# 문서 검증
# =============================================================================

test_documentation_completeness() {
    log_info "문서 완성도 검증 중..."
    
    # README.md 확인
    if [ -f "$PROJECT_ROOT/README.md" ] && [ -s "$PROJECT_ROOT/README.md" ]; then
        record_test_result "Documentation - README.md" "PASS"
    else
        record_test_result "Documentation - README.md" "FAIL" "README.md가 없거나 비어있음"
    fi
    
    # 설치 가이드 확인
    if [ -f "$PROJECT_ROOT/docs/installation-guide.md" ]; then
        record_test_result "Documentation - Installation Guide" "PASS"
    else
        record_test_result "Documentation - Installation Guide" "FAIL" "설치 가이드가 없음"
    fi
    
    # 모범 사례 가이드 확인
    if [ -f "$PROJECT_ROOT/docs/best-practices.md" ]; then
        record_test_result "Documentation - Best Practices" "PASS"
    else
        record_test_result "Documentation - Best Practices" "FAIL" "모범 사례 가이드가 없음"
    fi
    
    # PLAN.md 확인
    if [ -f "$PROJECT_ROOT/PLAN.md" ]; then
        record_test_result "Documentation - Development Plan" "PASS"
    else
        record_test_result "Documentation - Development Plan" "FAIL" "개발 계획이 없음"
    fi
}

# =============================================================================
# 리포트 생성
# =============================================================================

generate_report() {
    log_info "검증 리포트 생성 중..."
    
    cat > "$REPORT_FILE" << EOF
# OpenAI Codex CLI 예제 검증 리포트

**생성 일시**: $(date '+%Y-%m-%d %H:%M:%S')
**검증 버전**: $TIMESTAMP

## 📊 검증 결과 요약

- **총 테스트**: $TOTAL_TESTS
- **통과**: $PASSED_TESTS
- **실패**: $FAILED_TESTS  
- **건너뜀**: $SKIPPED_TESTS
- **성공률**: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%

## 📋 상세 결과

### 기본 예제 검증
- React 컴포넌트 예제
- API 생성 예제  
- 테스트 생성 예제

### 고급 예제 검증
- TypeScript 마이그레이션
- 데이터베이스 마이그레이션

### 실제 프로젝트 예제
- E-commerce API

### 설정 및 문서
- Codex 설정 파일
- 문서 완성도
- Codex CLI 통합 테스트

## 🔧 환경 정보

- **운영체제**: $(uname -s)
- **Node.js**: $(node --version 2>/dev/null || echo "미설치")
- **Codex CLI**: $(codex --version 2>/dev/null || echo "미설치")
- **API 키**: $([ -n "$OPENAI_API_KEY" ] && echo "설정됨" || echo "미설정")

## 📝 권장 사항

EOF

    # 실패한 테스트가 있는 경우 권장 사항 추가
    if [ $FAILED_TESTS -gt 0 ]; then
        cat >> "$REPORT_FILE" << EOF
### 🚨 즉시 수정 필요한 항목
- 실패한 테스트 $FAILED_TESTS개 확인 및 수정 필요
- 예제 코드 구문 검사 및 내용 보완
- 누락된 문서 또는 설정 파일 추가

EOF
    fi
    
    if [ $SKIPPED_TESTS -gt 0 ]; then
        cat >> "$REPORT_FILE" << EOF
### ⚠️ 선택적 개선 항목
- 건너뛴 테스트 $SKIPPED_TESTS개에 대한 환경 구성
- Codex CLI 설치 및 API 키 설정
- TypeScript 컴파일러 설치

EOF
    fi
    
    cat >> "$REPORT_FILE" << EOF
### ✅ 다음 단계
1. 실패한 테스트 수정
2. 성능 벤치마크 시스템 구축  
3. 고급 워크플로우 가이드 작성
4. 커뮤니티 기여 시스템 구축

---
*이 리포트는 자동으로 생성되었습니다.*
EOF
    
    log_success "검증 리포트 생성 완료: $REPORT_FILE"
}

# =============================================================================
# 메인 실행 로직
# =============================================================================

main() {
    echo "================================================================="
    echo "🧪 OpenAI Codex CLI 예제 검증 시스템"
    echo "================================================================="
    echo ""
    
    # 환경 점검
    CODEX_AVAILABLE=false
    API_KEY_AVAILABLE=false
    
    if check_prerequisites; then
        CODEX_AVAILABLE=true
    fi
    
    if check_api_key; then
        API_KEY_AVAILABLE=true
    fi
    
    echo ""
    log_info "검증 시작..."
    echo ""
    
    # 기본 예제 테스트
    echo "🔹 기본 예제 검증"
    test_react_component_example
    test_api_creation_example
    
    echo ""
    echo "🔹 고급 예제 검증"
    test_typescript_migration_example
    test_database_migration_example
    
    echo ""
    echo "🔹 실제 프로젝트 예제 검증"
    test_ecommerce_api_example
    
    echo ""
    echo "🔹 설정 및 문서 검증"
    test_codex_configuration
    test_documentation_completeness
    
    echo ""
    echo "🔹 통합 테스트"
    if [ "$CODEX_AVAILABLE" = true ] && [ "$API_KEY_AVAILABLE" = true ]; then
        test_codex_cli_integration
    else
        record_test_result "Codex CLI Integration" "SKIP" "환경 미구성"
    fi
    
    echo ""
    echo "================================================================="
    echo "📊 최종 결과"
    echo "================================================================="
    echo "총 테스트: $TOTAL_TESTS"
    echo "통과: $PASSED_TESTS"
    echo "실패: $FAILED_TESTS"
    echo "건너뜀: $SKIPPED_TESTS"
    echo "성공률: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
    echo ""
    
    # 리포트 생성
    generate_report
    
    # 최종 상태 코드 반환
    if [ $FAILED_TESTS -eq 0 ]; then
        log_success "모든 검증 완료! 🎉"
        return 0
    else
        log_error "$FAILED_TESTS개의 테스트가 실패했습니다."
        return 1
    fi
}

# 스크립트가 직접 실행된 경우에만 main 함수 호출
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi