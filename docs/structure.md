📁 oreum-frontend-react/ (React 웹 프론트)
oreum-frontend-react/
├── public/
│   └── index.html
├── src/
│   ├── assets/                         # 이미지, 로고, 아이콘 등
│   ├── components/
│   │   ├── auth/                      # 로그인, 회원가입
│   │   ├── board/                     # 게시글 관련
│   │   ├── comment/                   # 댓글, 대댓글
│   │   ├── community/                 # 커뮤니티 생성, 리스트, 설정
│   │   ├── curation/                  # 큐레이션 컴포넌트
│   │   ├── goods/                     # 굿즈 컴포넌트
│   │   ├── map/                       # 지도, 위치, 산 정보
│   │   └── common/                    # 공통 UI (버튼, 모달, 스피너 등)
│
│   ├── constants/                     # 상수 (카테고리, API 상태 코드 등)
│   ├── config/                        # axios, 환경설정
│   ├── hooks/                         # useAuth, useFetch 등 커스텀 훅
│   ├── pages/                         # 페이지 단위
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── BoardPage.jsx
│   │   ├── CommunityPage.jsx
│   │   ├── CurationPage.jsx
│   │   ├── GoodsPage.jsx
│   │   ├── MyPage.jsx
│   │   └── AdminPage.jsx              # 관리자 설정용 페이지
│
│   ├── redux/
│   │   ├── store.js
│   │   ├── userSlice.js
│   │   ├── boardSlice.js
│   │   ├── communitySlice.js
│   │   ├── commentSlice.js
│   │   ├── goodsSlice.js
│   │   └── notificationSlice.js
│
│   ├── routes/
│   │   └── AppRoutes.jsx
│
│   ├── services/
│   │   ├── authService.js
│   │   ├── boardService.js
│   │   ├── commentService.js
│   │   ├── communityService.js
│   │   ├── goodsService.js
│   │   ├── curationService.js
│   │   └── notificationService.js
│
│   ├── utils/                         # 날짜 변환, 정렬 함수 등
│   ├── App.js
│   └── index.js
├── .env
├── README.md
└── package.json