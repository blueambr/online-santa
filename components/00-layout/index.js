import Head from "next/head";

const Layout = ({ children, data }) => {
  const { title } = data;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </>
  );
};

export default Layout;
