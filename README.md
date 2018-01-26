# 요구사항

* 사용해야할 기술 스택: React, Next.js, Styled-jsx, Node.js, Express (DB 는 무관)
* 과제: http://tossdev.github.io/gettingstarted.html 와 같은 매뉴얼 홈페이지
* 조건
  1. 컨텐츠는 마크다운 형태로 DB 에서 가져와서 보여줘야 함
  2. 메뉴를 직접 하드 코딩한 현재의 홈페이지와 다르게 마크다운 컨텐츠의 헤더를 기반으로 자동으로 메뉴가 만들어져야 함
  3. 내용별 수정/삭제/추가 기능도 추가
  4. 예시 홈페이지와 같이 각각의 하부 메뉴는 클릭시 펼쳐져야하고 그 부분 클릭하면 스크롤 이동

# 실행방법

* mongodb 가 설치 및 접속되어있어야 합니다. [How To](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
* git clone git@github.com:Eclatant/toss-manual-page-clone.git
* cd toss-manual-page-clone/backend && yarn && yarn start
* cd toss-manual-page-clone/frontend && yarn && yarn dev
* http://localhost:3000 로 접속

(backend 를 node backend/index.js 로 실행하면 readdir 에 쓰이는 경로가 달라져서 에러가 발생할 것입니다.)

# 프로젝트 설명

* 콘텐츠의 대분류는 `###`, 중분류는 `####`으로 입력할 것이라는 전제 하에 제작하였습니다.
* 가장 고민되었던 지점이 markdown 을 parsing 해서 보여주는 과정에서 h3 과 h4 으로 연결되는 링크를 어떻게 가져올 것인지였습니다.
  * h3 또는 h4 를 기준으로 모두 Document 를 나누고 각각에 id 를 부여하는 방법을 먼저 시도했었는데, 대분류와 중분류를 하나의 그룹으로 묶기가 어려워 다른 방법을 찾게 되었습니다.
  * 거듭 검색하다가 [react-markdown](https://github.com/rexxars/react-markdown)의 renderers 옵션을 통해 h3 과 h4 일 때 id 를 부여할 수 있도록 할 수 있어서 해결하였습니다.
* backend 가 실행되면 backend/seed 에 있는 markdown 파일들을 불러들여서 mongodb 에 넣어줍니다. (즉 서버를 재실행하면 seed 기준으로 복구됨)
  * 불러들일 때 Promise.all 을 사용하고 싶었으나 order 를 순서대로 부여해야 해서 순차적으로 수행하도록 하였습니다.
* [partial.js](https://marpple.github.io/partial.js/) 는 Array Method 보다 다양한 장점(조합성, 가독성, [Array.from](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/from) 불필요 등)이 있어서 활용하였습니다.
* [immer](https://github.com/mweststrate/immer) 는 setState 를 위한 manipulation 에 대단히 유용하여서 사용하였습니다.
* 버튼과 메뉴를 보다 이쁘게 보여드리기 위해 [Ant Design](https://ant.design/docs/react/introduce) 를 사용하였습니다. (메뉴 컴포넌트는 이를 위한 State 등이 별도로 필요하여 다시 만든다면 사용여부를 재고해볼 것 같습니다.)
* 여유가 많지 않아, 초기 계획과 달리 아래 사항들은 진행하지 않았습니다..

> Prism 을 활용한 `<code>`, `<pre>` 이쁘게 보이게 하기

> AWS Deploy

> Jest 를 활용한 테스트

> Recompose + shouldComponentUpdate 를 활용한 최적화
