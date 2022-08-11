import { useRouter } from "next/router";
import connectDB from "utils/connectDB";
import Event from "models/Event";
import data from "lib/en/pages/event";
import dataRu from "lib/ru/pages/event";
import Layout from "@/layout";
import HeroEvent from "@/sections/HeroEvent";
import FormEvent from "@/sections/FormEvent";

const EventPage = ({ event }) => {
  const { collectionRef } = event;
  const router = useRouter();
  const { locale } = router;

  const getData = () => {
    switch (locale) {
      case "en":
        return data[collectionRef];
      case "ru":
        return dataRu[collectionRef];
    }
  };

  const { page, hero, form } = getData();

  return (
    <>
      <Layout data={page}>
        <HeroEvent data={hero} />
        <FormEvent data={form} event={event} />
      </Layout>
    </>
  );
};

export const getServerSideProps = async (context) => {
  try {
    const { res, query } = context;

    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=59");

    connectDB();

    const event = await Event.findOne({
      collectionRef: query.collectionRef,
    }).exec();

    if (!event) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        event: JSON.parse(JSON.stringify(event)),
      },
    };
  } catch (err) {
    console.error("Error:", err);

    return {
      notFound: true,
    };
  }
};

export default EventPage;
