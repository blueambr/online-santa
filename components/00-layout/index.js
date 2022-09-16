import { useRouter } from "next/router";
import Image from "next/image";
import settings from "lib/en/settings";
import settingsRu from "lib/ru/settings";
import Head from "next/head";
import Header from "@/sections/Header";

const Layout = ({ children, data }) => {
  const { title, bgImage } = data;
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
      </Head>
      {bgImage && (
        <div className="fixed h-screen w-screen">
          <Image
            className="brightness-50"
            src={bgImage.src}
            alt="Atmospheric background image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <Header data={header} />
      <div className="relative z-10 pb-14 lg:pb-28">{children}</div>
    </>
  );
};

export default Layout;
