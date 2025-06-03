# 설치 라이브러리
npm install @reduxjs/toolkit react-redux
npm install react-router-dom
npm install styled-components


# commit convention(커밋 메시지 규칙)

# 커밋 메시지 작성 규칙 (Conventional Commits)

형식: <타입>: <변경 요약>

## 사용 가능한 타입 목록
- feat: 새로운 기능 추가
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 스타일 변경 (포맷, 세미콜론 등)
- refactor: 코드 리팩토링 (기능 변경 없음)
- test: 테스트 코드 추가 및 수정
- chore: 빌드 설정, 패키지 추가 등 기타 작업

## 타입 예시
- feat: 회원가입 API 구현
- fix: 인기글 조회 쿼리 오류 수정
- refactor: 도메인 구조 분리
- docs: ERD 및 API 명세 문서화
- chore: application.yml DB 연결 설정

## 작성 예시
feat: 회원가입 API 구현

이메일 중복 체크 및 비밀번호 암호화 로직 포함.
회원가입 성공 시 Redis에 인증 토큰 저장.

fix: 인기글 조회 쿼리 오류 수정

쿼리에서 GROUP BY 절 누락으로 인기글 정렬이 잘못됨.
INNER JOIN을 LEFT JOIN으로 변경하여 게시글 없는 유저도 포함되도록 수정.
