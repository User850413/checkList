## 개요

체크리스트!

## NOTE

- api 컨벤션 싹 맞추기

### 구현된 기능

- 로그인 / 로그아웃 기능
- 내 리스트 페이지
  - 리스트 추가, 리스트 수정, 리스트 삭제
  - 리스트 내 항목 추가, 삭제
  - 리스트 공유
  - 리스트 관심사별 필터링
- 전체 리스트 페이지
  - 공유된 리스트 받아오기(내 리스트에 추가됨)
- 마이 페이지
  - 바이오 수정 가능
  - 관심사 수정 가능
  - 완료한 관심사 목록 통계

### 기능 필요사항

- 회원 탈퇴 가능하게
- 리스트 색상 변경 가능하게
- ui 및 ux 개선

### 기능 추가사항

- 항목이 언제 업데이트 되었는지
- 퍼센트 리스트도 있었으면

_생각나는 게 있으면 계속 추가하기_

### 기술 스택

- Next App Router
- Tailwind
- React-query
- JWT(Json Web Token)
- ChakraUI
- Framer Motion

### 백엔드 관련

- mongoDB - mongoose
- httpOnly option 사용

### 미들웨어

- 토큰 검증 로직

### AI 보조 도구

- [챗 GPT](https://chatgpt.com/)
- [코드래빗](https://www.coderabbit.ai/)

### 컨벤션

- **폴더명 :** _스네이크 표기법 (ex. checkList)_
- **브랜치명 :** _태그: 기술명_
- **커밋명 :** _MM/DD :깃모지: : 기술명_

### 인증 및 인가 프로세스

1. 로그인 시 response의 httpOnly 쿠키로 accessToken 및 refreshToken 발급(db에 저장)
2. 이후 api 요청 시 미들웨어로 accessToken 검증
3. 상태코드 401일 시 인터셉터로 /api/refresh 요청
4. refreshToken 유효할 시 새 accessToken(15m) 발급, refreshToken(7d) 만료 시 새 로그인 필요

(25/01/21 마지막 수정)
