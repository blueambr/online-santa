import connectDB from "utils/connectDB";
import Event from "models/Event";
import Layout from "@/layout";
import HeroEvent from "@/sections/HeroEvent";
import FormEvent from "@/sections/FormEvent";

const EventPage = ({ event }) => {
  return (
    <>
      <Layout data={{ title: event.name }}>
        <HeroEvent data={event} />
        <FormEvent />
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
