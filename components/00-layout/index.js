import Head from "next/head";

const Layout = ({ children, data }) => {
  const { title } = data;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="favicon/manifest.json" />
        <link rel="shortcut icon" href="favicon/favicon.ico" />
        <title>{title}</title>
      </Head>
      {children}
    </>
  );
};

export default Layout;
