import { useRouter } from "next/router";
import settings from "lib/en/settings";
import settingsRu from "lib/ru/settings";
import Head from "next/head";
import Header from "@/sections/Header";

const Layout = ({ children, data }) => {
  const { title } = data;
  const router = useRouter();
  const { locale } = router;

  const getSettings = () => {
    switch (locale) {
      case "en":
        return settings;
      case "ru":
        return settingsRu;
    }
  };

  const { header } = getSettings();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header data={header} />
      {children}
    </>
  );
};

export default Layout;
