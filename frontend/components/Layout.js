import Head from "next/head";

const Layout = ({ children }) => (
  <div>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <title>토스 결제 시작하기</title>
    </Head>
    {children}
  </div>
);

export default Layout;
