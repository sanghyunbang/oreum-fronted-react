-- ✅ 0. 데이터베이스 생성 및 선택
CREATE DATABASE oreum_test DEFAULT CHARACTER SET utf8mb4;
USE oreum_test;

-- ✅ 1. users: 사용자 정보 저장 테이블
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,                         -- 사용자 고유 ID (PK)
  email VARCHAR(100) UNIQUE NOT NULL,                             -- 로그인 이메일 (중복 불가)
  password_hash VARCHAR(255),                                     -- 비밀번호 해시 (소셜 로그인 시 NULL)
  name VARCHAR(100),                                              -- 실명 (필수 아님)
  nickname VARCHAR(50),                                           -- 닉네임 (화면에 표시됨)
  profile_image TEXT,                                             -- 프로필 이미지 URL (S3 등)
  address VARCHAR(255),                                           -- 사용자 주소
  points INT DEFAULT 0,                                           -- 포인트 (활동 보상 등)
  role ENUM('user', 'admin') DEFAULT 'user',                      -- 권한 구분 (관리자 여부)
  status ENUM('active', 'inactive', 'banned') DEFAULT 'active',   -- 계정 상태
  last_login DATETIME,                                            -- 마지막 로그인 시각
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP                   -- 가입 시각
);

-- ✅ 2. boards: 사용자 생성형 커뮤니티 테이블 [0625 수정 name 삭제제]
CREATE TABLE boards (
  board_id INT PRIMARY KEY AUTO_INCREMENT,                        -- 커뮤니티 고유 ID
  title VARCHAR(255) NOT NULL,                                    -- 커뮤니티 제목 (예: "북한산")
  description TEXT,                                               -- 설명 텍스트
  creator_id INT NOT NULL,                                        -- 생성자 ID (users 참조)
  thumbnail_url VARCHAR(255),                                     -- 썸네일 이미지 (S3 URL 등)
  is_private BOOLEAN DEFAULT FALSE,                               -- 비공개 여부 (검색 노출 여부)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                  -- 생성일
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP                   -- 수정일
              ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(user_id)
);

-- ✅ 3. board_members: 사용자의 커뮤니티 가입 정보
CREATE TABLE board_members (
  id INT PRIMARY KEY AUTO_INCREMENT,                              -- 가입 레코드 ID
  board_id INT NOT NULL,                                          -- 커뮤니티 ID
  user_id INT NOT NULL,                                           -- 사용자 ID
  role ENUM('member', 'admin') DEFAULT 'member',                  -- 권한 (운영진인지 여부)
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,                   -- 가입 시각
  UNIQUE (board_id, user_id),                                     -- 중복 가입 방지
  FOREIGN KEY (board_id) REFERENCES boards(board_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ✅ 4. posts: 게시글 공통 테이블 (모든 게시글 기본 정보 저장) -> [0625: content Not null 없앰] 
CREATE TABLE posts (
  post_id INT PRIMARY KEY AUTO_INCREMENT,                         -- 게시글 고유 ID
  user_id INT NOT NULL,                                           -- 작성자 ID
  board_id INT NOT NULL,                                          -- 소속 커뮤니티 ID
  type ENUM('general', 'curation', 'meeting') NOT NULL,           -- 게시글 유형
  title VARCHAR(255) NOT NULL,                                    -- 제목
  content TEXT ,                                                  -- 본문 내용
  like_count INT DEFAULT 0,                                       -- 좋아요 수
  comment_count INT DEFAULT 0,                                    -- 댓글 수
  is_deleted BOOLEAN DEFAULT FALSE,                               -- 삭제 여부 (소프트 삭제)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                  -- 작성일
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP                   -- 수정일
              ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (board_id) REFERENCES boards(board_id)
);

-- ✅ 5. curation_details: 큐레이션 게시글 전용 상세 정보 -> [0625 수정] curation_id 도입. 프라이머리 키로 변경(기존 post_id)
CREATE TABLE curation_details (
  curation_id INT AUTO_INCREMENT PRIMARY KEY,                    -- 자체 PK
  post_id INT UNIQUE,                                            -- 연결된 게시글 ID (UNIQUE + FK)
  mountain_name VARCHAR(100),                                    -- 산 이름
  isUpward BOOLEAN,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);


-- ✅ 6. meeting_details: 모임/동행 게시글 전용 상세 정보
CREATE TABLE meeting_details (
  post_id INT PRIMARY KEY,                                        -- 연결된 게시글 ID
  hiking_date DATETIME NOT NULL,                                  -- 등산 예정일
  mountain_name VARCHAR(100) NOT NULL,                            -- 산 이름
  meet_location TEXT,                                             -- 집합 장소 상세 설명
  difficulty ENUM('easy', 'normal', 'hard'),                      -- 난이도
  participant_limit INT DEFAULT 10,                               -- 모집 정원
  current_participants INT DEFAULT 0,                             -- 현재 신청 인원
  meeting_description TEXT,                                       -- 상세 설명 (준비물 등)
  fee INT DEFAULT 0,                                              -- 참가비 (0이면 무료)
  thumbnail_url VARCHAR(500),                                     -- 썸네일 이미지
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- ✅ 7. bookmarks: 북마크 테이블
CREATE TABLE bookmarks (
  bookmark_id INT PRIMARY KEY AUTO_INCREMENT,                     -- 북마크 ID
  user_id INT NOT NULL,                                           -- 사용자 ID
  post_id INT NOT NULL,                                           -- 북마크한 게시글 ID
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                  -- 북마크 생성 시각
  UNIQUE (user_id, post_id),                                      -- 중복 북마크 방지
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

-- ✅ 8. reports: 신고 기능 (게시글 신고)
CREATE TABLE reports (
  report_id INT PRIMARY KEY AUTO_INCREMENT,                       -- 신고 ID
  reporter_id INT NOT NULL,                                       -- 신고한 사용자
  post_id INT NOT NULL,                                           -- 신고 대상 게시글
  reason TEXT NOT NULL,                                           -- 신고 사유
  status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending', -- 처리 상태
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                  -- 신고 접수 시간
  FOREIGN KEY (reporter_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- ✅ 9. post_media: 게시글에 첨부된 S3 미디어 파일
CREATE TABLE post_media (
  media_id INT PRIMARY KEY AUTO_INCREMENT,                        -- 미디어 ID
  post_id INT NOT NULL,                                           -- 연결된 게시글 ID
  media_type ENUM('image', 'video') NOT NULL,                     -- 미디어 타입
  media_url VARCHAR(1000) NOT NULL,                               -- S3 URL 경로
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                  -- 업로드 시각
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- ✅ 10. comments: 게시글 댓글 (대댓글 포함)
CREATE TABLE comments (
  comment_id INT PRIMARY KEY AUTO_INCREMENT,                      -- 댓글 ID
  post_id INT NOT NULL,                                           -- 댓글이 속한 게시글
  user_id INT NOT NULL,                                           -- 작성자 ID
  parent_id INT DEFAULT NULL,                                     -- 부모 댓글 ID (대댓글일 경우)
  content TEXT NOT NULL,                                          -- 댓글 내용
  like_count INT DEFAULT 0,                                       -- 좋아요 수
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                  -- 작성 시각
  updated_at DATETIME,                                            -- 수정 시각
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (parent_id) REFERENCES comments(comment_id) ON DELETE CASCADE
);

-- ✅ 11. post_likes: 게시글 좋아요 기록
CREATE TABLE post_likes (
  like_id INT PRIMARY KEY AUTO_INCREMENT,                         -- 좋아요 ID
  post_id INT NOT NULL,                                           -- 좋아요 대상 게시글
  user_id INT NOT NULL,                                           -- 누른 사용자
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                  -- 누른 시간
  UNIQUE (post_id, user_id),                                      -- 중복 방지
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ✅ 12. meeting_participants: 모임/동행 게시글 참가 신청 테이블
CREATE TABLE meeting_participants (
  id INT PRIMARY KEY AUTO_INCREMENT,                              -- 신청 고유 ID
  post_id INT NOT NULL,                                           -- 참가할 모임 게시글 ID
  user_id INT NOT NULL,                                           -- 참가자 ID
  status ENUM('applied', 'accepted', 'rejected') DEFAULT 'applied', -- 신청 상태
  message TEXT,                                                   -- 신청 메시지 (선택사항)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                  -- 신청 일시

  UNIQUE (post_id, user_id),                                      -- 중복 신청 방지
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,  -- 반드시 posts.type = 'meeting' 인지 백엔드에서 확인 필요
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


use oreum_test;
select * from users;
select * from boards;

--


create table goods(
   id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    category varchar(64) not null,
    brand varchar(64),
    price int not null,
    salePercent int default 0,
    description text,
   img text,
    likes int default 0,
    status ENUM('판매중', '품절', '판매종료') NOT NULL DEFAULT '판매중',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE GoodsOptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    goods_id INT NOT NULL,
    option_name VARCHAR(50) NOT NULL default "옵션없음",
    stock_qty INT DEFAULT 0,
    FOREIGN KEY (goods_id) REFERENCES Goods(id) ON DELETE CASCADE
);

CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goods_option_id INT NOT NULL,
    qty INT NOT NULL DEFAULT 1,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (goods_option_id) REFERENCES GoodsOptions(id) ON DELETE CASCADE,
    UNIQUE(user_id, goods_option_id)  -- 같은 옵션 중복 추가 방지
);

CREATE TABLE likes (
  user_id INT NOT NULL,
  goods_id INT NOT NULL,
  liked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, goods_id),                 -- 중복 방지: 한 유저가 한 상품에 대해 한 번만 좋아요 가능
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (goods_id) REFERENCES goods(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  receiver_name VARCHAR(100) NOT NULL,
  receiver_phone VARCHAR(20),
  zipcode VARCHAR(10),
  address_basic VARCHAR(255),
  address_detail VARCHAR(255),
  request TEXT,
  used_point INT DEFAULT 0,
  total_price INT NOT NULL,
  status ENUM('결제대기', '결제완료', '배송중', '배송완료', '취소') DEFAULT '결제대기',
  ordered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status_updated_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  goods_options_id INT NOT NULL,
  qty INT NOT NULL,
  item_price INT NOT NULL,  -- 단가 (할인 반영)
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (goods_options_id) REFERENCES GoodsOptions(id) ON DELETE CASCADE
);






-- [0625 수정을 위한 쿼리문]

-- [boards테이블 수정]

USE oreum_test;
-- 1. name 컬럼 제거
ALTER TABLE boards DROP COLUMN name;

-- 2. title 컬럼에 UNIQUE 제약 조건 추가
ALTER TABLE boards ADD CONSTRAINT unique_title UNIQUE (title);

-- [curation_detail 테이블 수정]

SHOW CREATE TABLE curation_details; -- 1. 외래키 제약 찾기
ALTER TABLE curation_details DROP FOREIGN KEY curation_details_ibfk_1; -- 2. 외래키 제약 일단 제거
ALTER TABLE curation_details DROP PRIMARY KEY;--기존 pk 제거

-- 3.새로운 cruation_id 추가
ALTER TABLE curation_details
ADD COLUMN curation_id INT AUTO_INCREMENT PRIMARY KEY FIRST;

-- 4. post_id unique키로하고 다시 제약
ALTER TABLE curation_details
ADD CONSTRAINT unique_post_id UNIQUE (post_id),
ADD CONSTRAINT fk_post_id FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE;

-- 5. ongoDB로 보낸것들은 날리기
ALTER TABLE curation_details
DROP COLUMN route_description,
DROP COLUMN caution,
DROP COLUMN nearby_attractions,
DROP COLUMN geo_json;

-- 6. 상행 하행 추가
ALTER TABLE curation_details
ADD COLUMN isUpward BOOLEAN NOT NULL DEFAULT TRUE;


-- [posts 테이블]

-- posts NOT NULL 조건 삭제
ALTER TABLE posts
MODIFY content TEXT NULL;


-- [orders 테이블 수정]

-- 1. status ENUM 값 변경
ALTER TABLE orders 
MODIFY COLUMN status ENUM('결제대기', '결제완료', '배송중', '배송완료', '결제취소') DEFAULT '결제대기';

-- 2. status_updated_at 기본값 추가
ALTER TABLE orders 
MODIFY COLUMN status_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- [order_items 테이블 수정]
-- 3. review_written 컬럼 추가
ALTER TABLE order_items 
ADD COLUMN review_written BOOLEAN DEFAULT FALSE;

-- [reviews 테이블 추가]
CREATE TABLE reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_item_id INT NOT NULL,
  order_id INT NOT NULL,
  rating INT NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- [0627 수정을 위한 쿼리문]

-- [goods 테이블 수정]
-- description TEXT -> LONGTEXT 변경
ALTER TABLE goods MODIFY description LONGTEXT;

-- [0630 posts 테이블 수정 : searchGeo 칼럼 추가]

ALTER TABLE orders
ADD COLUMN imp_uid VARCHAR(255) NULL,
ADD COLUMN merchant_uid VARCHAR(255) NULL;

-- [0701 orders 테이블 수정 : imp_uid , merchant_uid 칼럼 추가]


USE OREUM_TEST;

ALTER TABLE posts
ADD COLUMN searchGeo VARCHAR(255);

COMMIT;

