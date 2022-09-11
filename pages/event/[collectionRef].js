import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import GlobalContext from "context";
import Event from "models/Event";
import connectDB from "utils/connectDB";
import relay from "utils/relay";
import data from "lib/en/pages/event";
import dataRu from "lib/ru/pages/event";
import Layout from "@/layout";
import Preloader from "@/elements/Preloader";
import Alert from "@/modules/Alert";
import TelegramLoginWidget from "@/modules/TelegramLoginWidget";
import Hero from "@/sections/Hero";
import FormEvent from "@/sections/FormEvent";
import InfoEvent from "@/sections/InfoEvent";

const EventPage = ({ event }) => {
  const globalContext = useContext(GlobalContext);
  const { user } = globalContext;
  const router = useRouter();
  const { locale } = router;
  const { collectionRef, collectionSchema, status, registrationClosed } = event;

  const getData = () => {
    switch (locale) {
      case "en":
        return data[collectionRef];
      case "ru":
        return dataRu[collectionRef];
    }
  };

  const {
    page,
    hero,
    form,
    info,
    registrationClosed: registrationClosedData,
  } = getData();

  const doesParticipate = () => {
    if (user) {
      let { participant } = user;

      if (participant) {
        participant = JSON.parse(participant);

        return participant.find((event) => event === collectionRef);
      }

      return false;
    }

    if (user === null) {
      return null;
    }

    return false;
  };

  const [isParticipant, setIsParticipant] = useState(doesParticipate());
  const [userParticipant, setUserParticipant] = useState(null);
  const [recipientParticipant, setRecipientParticipant] = useState(null);

  useEffect(() => {
    (async () => {
      const doesParticipateResult = doesParticipate();

      setIsParticipant(doesParticipateResult);

      if (doesParticipateResult) {
        let up;

        await relay(
          "/api/participant/get",
          "POST",
          {
            collectionRef,
            collectionSchema,
            id: user.id,
          },
          (res) => {
            up = res.participant;

            setUserParticipant(up);
          },
          (err) => alert(err)
        );

        if (status === "ongoing") {
          if (up.recipient) {
            relay(
              "/api/participant/get",
              "POST",
              {
                collectionRef,
                collectionSchema,
                id: up.recipient,
              },
              (res) => {
                setRecipientParticipant(res.participant);
              },
              (err) => alert(err)
            );
          } else {
            setRecipientParticipant(false);
          }
        }
      }
    })();
  }, [user]);

  return (
    <>
      <Layout data={page}>
        <Hero data={hero} />
        {user === null || isParticipant === null ? (
          <Preloader />
        ) : !user ? (
          <div className="text-center">
            <TelegramLoginWidget />
          </div>
        ) : isParticipant ? (
          <InfoEvent
            data={{ info, status, userParticipant, recipientParticipant }}
          />
        ) : !registrationClosed ? (
          <FormEvent data={form} event={event} />
        ) : (
          <section className="container">
            <Alert data={registrationClosedData} />
          </section>
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
