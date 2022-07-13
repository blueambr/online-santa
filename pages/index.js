import { useRouter } from "next/router";
import Link from "next/link";
import data from "lib/en/pages";
import dataRu from "lib/ru/pages";
import Layout from "@/layout";

const Home = () => {
  const router = useRouter();
  const { locale } = router;

  const getData = () => {
    switch (locale) {
      case "en":
        return data;
      case "ru":
        return dataRu;
    }
  };

  const { page, title } = getData();

  return (
    <>
      <Layout data={page}>
        <h1 className="font-serif text-6xl text-neutral-content">{title}</h1>
        <Link href="/event/onlinesanta-2023">
          <a className="font-serif text-6xl text-neutral-content">
            Online Santa 2023 Link
          </a>
        </Link>
      </Layout>
    </>
  );
};

export default Home;
