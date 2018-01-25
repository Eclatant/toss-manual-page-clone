import Head from "next/head";

const Layout = ({ children }) => (
  <div>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <title>토스 결제 시작하기</title>
      <link
        href="//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css"
        rel="stylesheet"
        type="text/css"
      />
    </Head>
    {children}
  </div>
);

export default Layout;
