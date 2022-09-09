import { useRouter } from "next/router";
import relay from "utils/relay";
import data from "lib/en/pages";
import dataRu from "lib/ru/pages";
import Layout from "@/layout";
import Events from "@/sections/Events";

const Home = ({ events }) => {
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

  const { page, eventLinkTitle } = getData();

  return (
    <>
      <Layout data={page}>
        <Events data={{ events, eventLinkTitle, locale }} />
      </Layout>
    </>
  );
};

export default Home;

export const getServerSideProps = async () => {
  let events;

  await relay(
    "http://onlinesanta.loc/api/events/get",
    "GET",
    null,
    (res) => (events = res.events)
  );

  return {
    props: { events },
  };
};
