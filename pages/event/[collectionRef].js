import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import GlobalContext from "context";
import connectDB from "utils/connectDB";
import Event from "models/Event";
import data from "lib/en/pages/event";
import dataRu from "lib/ru/pages/event";
import Layout from "@/layout";
import Hero from "@/sections/Hero";
import FormEvent from "@/sections/FormEvent";
import InfoEvent from "@/sections/InfoEvent";
import TelegramLoginWidget from "@/modules/TelegramLoginWidget";

const EventPage = ({ event }) => {
  const globalContext = useContext(GlobalContext);
  const { user } = globalContext;
  const router = useRouter();
  const { locale } = router;
  const { collectionRef } = event;

  const getData = () => {
    switch (locale) {
      case "en":
        return data[collectionRef];
      case "ru":
        return dataRu[collectionRef];
    }
  };

  const { page, hero, form } = getData();

  const doesParticipate = () => {
    if (user) {
      let { participant } = user;

      if (participant) {
        participant = JSON.parse(participant);

        return participant.find((event) => event === collectionRef);
      }

      return false;
    }

    return null;
  };

  const [isParticipant, setIsParticipant] = useState(doesParticipate());

  useEffect(() => {
    setIsParticipant(doesParticipate());
  }, [user]);

  return (
    <>
      <Layout data={page}>
        <Hero data={hero} />
        {user === null || isParticipant === null ? (
          <div className="text-center">
            <h1 className="font-serif text-6xl text-neutral-content">
              Loading...
            </h1>
          </div>
        ) : !user ? (
          <div className="text-center">
            <TelegramLoginWidget />
          </div>
        ) : isParticipant ? (
          <InfoEvent />
        ) : (
          <FormEvent data={form} event={event} />
        )}
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
