![fung-removebg-preview](https://github.com/user-attachments/assets/36ec3e02-c384-4f3f-832c-1038efb3771c)

## **🌟 서비스 소개**

- 'FUNCTION' 은 "**경매**"를 통해 상품을 거래하는 플랫폼입니다
- "긴장감 넘치는 경매의 스릴"울  추구하며,
    
    타임어택 경매 ⏳를 통해 경매가 종료되면, 당첨여부를 바로 확인 가능합니다
    
- 당첨된 후에는 **판매자와 채팅**을 통해 구매를 확정할 수 있습니다

<br>

# **📆 서비스 개발 개요**

## 기획 의도

- 사용자들이 원하는 상품을 얻기 위해 보이지 않는 경쟁을 함으로써 긴장감과 재미를 줍니다.
- 판매자에게는 처음 상품을 올린 가격(시작가)보다 더 높은 가격에 팔 수 있는 기회, 구매자에게는 원하는 상품을 더 저렴하게 구매할 수 있는 기회를 제공합니다.
- 비공개 입찰을 통해 경매 방식으로 거래하는 차별화된 방식입니다.

## **개발 일정**

- **총 진행 기간**: 2024.06.03 ~ 2024.07.04 ( 32일 )
- **설계 기간**: 2024.06.03 ~ 2024.06.05 ( 와이어 프레임, ERD, API)
- **피드백 반영 기간**: 2024.06.06 ~ 2024.06.22 ( 17일 )
- 화면 / 기능 구현, 테스트 기간 : 2024.06.23 ~ 2024.07.04 ( 12일 )

<br>

## **👨‍👨‍👧‍👦 팀원 소개**

[팀 노션](https://www.notion.so/huitopia/2c4fb555828c41f4b69f4a675689e282)

**Da Hee Kim**

- 🐶 Github: [https://github.com/huitopia]

**Ye Been Kim**

- 🐍 Github: [https://github.com/kybcod]

**Jin A An**

- 🐮 Github : [https://github.com/jnn-jnn1]

**Hwa Yeong Joe**

- 🦄 Github: [https://github.com/kiwi85547]

Jeong Yun Heo

- 🐴 Github : [https://github.com/JeongYunheo]

<br>

| Name            | Role                | 
| --------------- | ------------------- |
| 김예빈       | Product     | 
| 김다희       | Chat     | 
| 안진아       | User     | 
| 허정윤       | Board     | 
| 조화영       | QnA     | 

<br>



## **⛓ 기술 스택**

**Backend :  Java, Spring Boot, MyBatis**

**Frontend : React, Vite, Node.js**

**Server :  AWS EC2**

**Management : Git, GitHub, Notion**

**Database : AWS S3, MariaDB, Docker**

<br>

## **⭐️ 주요 기능**

## 회원가입 및 로그인

**회원가입**
![Untitled (1)](https://github.com/user-attachments/assets/637332f8-e6bd-48fd-94d7-ad5ad15bfc92)

  - 클라이언트가 입력한 정보를 바탕으로 회원을 DB에 저장합니다.
  - 입력 정보가 양식에 맞는지 정규 표현식으로 검증합니다.
  - 이메일과 닉네임이 중복이 아닌지 확인합니다.
  - 휴대폰 번호로 인증번호를 보내 유효한 휴대폰 번호인지 확인합니다.
  - 개인정보 수집 동의 여부를 확인합니다.
  - 모든 항목이 확인되었을 때만 회원 가입이 가능합니다.

**로그인**
![Untitled (1)](https://github.com/user-attachments/assets/38c93d61-6964-41cd-8a55-519780e9d671)
  - 클라이언트가 제공한 이메일과 비밀번호로 회원을 조회합니다.
  - 이메일과 비밀번호로 회원임이 검증되면 JWT 토큰을 발급합니다.
  - 발급된 JWT 토큰은 LocalStorage에 저장되어 axios 요청이 발생할 때마다 서버에 전달됩니다
  - JWT 토큰의 정보를 Context에 저장하여 사용자 정보를 애플리케이션 전역에서 사용합니다.

<br>

## 상품 경매
![Untitled (2)](https://github.com/user-attachments/assets/184b4867-c70d-41ab-854c-85eb06fafb89)
- **경매 참여**
    - 경매를 참여하기 전에 모달을 띄워 경매 참여 시 유의사항을 보여줍니다.
    - 경매를 계속 참여할 수 있으며 계속 마지막으로 참여한 가격이 경매에 참여한 가격이 됩니다.
    - 입찰 금액을 입력하면 시작가보다 같거나 높기 전까지 경고 메세지를 띄웁니다.
    - 해당 상품의 경매에 처음 참여할 경우 참여 인원이 변경됩니다.

## 낙찰 여부 확인
![Untitled (3)](https://github.com/user-attachments/assets/126bf293-0d0c-462d-b2e9-2fe111f79f4b)
- **경매 참여 후 낙찰 여부 확인**
    - 경매 참여 후 낙찰 여부는 마이 페이지 입찰내역에서 볼 수 있습니다.
    - **낙찰 성공** :  `낙찰 성공` 벳지로 알려주고 거래하기 버튼을 클릭하면 판매자와의 채팅으로 이어집니다.
    - **낙찰 실패**  : `낙찰 실패` 벳지로 알려줍니다.

## 채팅
**1 : 1 채팅**

![chat_open_and_close](https://github.com/user-attachments/assets/69de7bd1-c754-4372-879b-5b72753e9aeb)
  - 채팅방 입장 시 STOMP 활성화, `<`(뒤로가기) 클릭 시 STOMP 비활성화
  - 두명의 사용자 간의 실시간 1:1 채팅 가능
  - 채팅 전송 시 상대방이 안 읽은 상태면 “전송됨” 표시
  - 실시간으로 상대측에서 메세지 읽고 답장 시 “전송됨" 소멸
  - 상품명 클릭 시 상품 페이지로 이동
  - 닉네임 클릭 시 닉네임 페이지로 이동

![chat_out1](https://github.com/user-attachments/assets/458e9cff-98e7-4e56-9354-a27ac9da2ae5)
    - 채팅방 나가기 클릭 시 메인 화면으로 이동 및 STOMP 비활성화
    - 한 명만 나가기 버튼을 누르면 다른 사용자는 채팅방 유지, 두 명 모두 나가기를 하면 메세지&채팅방 삭제


## 문의 게시판

**FAQ (자주 하는 질문)**

![FAQ_gif](https://github.com/user-attachments/assets/6a30340a-8c0d-409e-86f1-79af82583265)
- 자주 묻는 질문들이 카테고리별로 정리되어 있습니다.
- 질문을 클릭하면 답변이 나타나며, 여러 개의 답변을 한번에 볼 수 있습니다.
- ‘맨 위로’ 버튼을 누르면 화면이 맨 위로 스크롤 됩니다.
    

**1:1 문의게시판**

![이전글 다음글](https://github.com/user-attachments/assets/b8933509-b5a6-4b51-a75b-cff1b5a71900)
- 비밀글을 작성할 수 있고, 본인이 쓴 비밀글만 읽을 수 있습니다.
- 관리자만 답변을 달 수 있으며, 목록에서 답변 상태를 확인할 수 있습니다.
- 첨부한 사진을 크게 확대하여 볼 수 있습니다.
- 이전글, 다음글 버튼을 통해 다음글을 확인할 수 있습니다.

## 자유 게시판 댓글

![Untitled (1)](https://github.com/user-attachments/assets/79e19514-3ffb-4bf9-b79b-7cea477dcc41)
**자유게시판 댓글 리스트**
- 해당 게시물에 댓글 작성이 가능합니다.
- 댓글 리스트 밑에 위치한 ‘답글쓰기’ 버튼을 클릭하면 답글 입력창이 나타납니다.
- 답글을 작성하면 순서에 따라 위치에 따라 정렬됩니다.
- 무한으로 답글을 작성할 수 있습니다.

**부가 기능**
- 메뉴를 클릭하면 수정 및 삭제가 가능합니다.
- 취소 버튼을 누르면 답글 창이 닫힙니다.
- 프로필 사진을 클릭하면 상점으로 이동합니다.

<br>

## 와이어 프레임
![Untitled](https://github.com/user-attachments/assets/8d0aef7c-718c-4d26-8550-56aafd1db143)

<br>

## ERD
![function_diagram](https://github.com/user-attachments/assets/776a5ee9-b643-4176-8ac6-e23f247b470d)


<br>

## **🖼 사용 기술 스택**

## 사용 기술 스택
![Untitled (2)](https://github.com/user-attachments/assets/a9fb2d59-011f-4474-b513-b44ac2e85881)

## **🔨기술 선정 Why ?**

- **Spring Boot**
    - 내장된 톰캣 서버와 다양한 패키지를 통해 RESTful 웹 서비스를 구축할 수 있습니다.
- **AWS EC2**
    - 가상 서버를 사용하여 애플리케이션의 실행 환경을 제공합니다. 웹 애플리케이션, 데이터베이스 서버 등 다양한 형태의 애플리케이션을 호스팅합니다.
- **AWS S3**
    - 데이터의 내구성이 높고 높은 가용성을 제공하여 데이터 손실 없이 안정적으로 저장할 수 있어 파일을 저장할 때 사용합니다.
- **Docker**
    - 애플리케이션을 컨테이너화하여 개발, 테스트, 배포를 진행하였습니다.
- **Websocket**
    - 클라리언트와 서버 간의 실시간 양방향 통신을 가능하게 하여 채팅을 할 수 있도록 하였습니다.
- **STOMP**
    - Websocket을 통해 메시징 프로토콜을 구현하여 백엔드에서는 메시징 브로커와의 통신을 담당하고, 프론트엔드에서는 실시간 메시지 송수신을 처리합니다.
- **MariaDB**
    - MySQL 기반으로 오픈 소스 관계형 데이터베이스 관리 시스템으로 최적화된 쿼리를 작성할 수 있습니다.
- **React**
    - 사용자 인터페이스 구축을 위한 JavaScript 라이브러리로 컴포넌트 기반 구조를 통해 빠른 렌더링과 재사용성을 제공합니다. 단일 페이지 애플리케이션 개발할 때 적합하며, 라우팅, 상태 관리, 데이터 흐름 등을 간편하게 관리할 수 있습니다.
 
<br>

## ⚙ 개발 환경 및 IDE

- Spring Boot 3.2.6
- Java 21.0.3
- React 18.2.0
- Docker 26.1.1
 
<br>

## 🎞 최종산출물
[발표 자료 및 영상](https://www.canva.com/design/DAGJrEM9uQg/YjMCcJizEJdqjEsQd_eRWA/view?utm_content=DAGJrEM9uQg&utm_campaign=designshare&utm_medium=link&utm_source=editor) <br>
[포트폴리오](https://ybk.my.canva.site/)
