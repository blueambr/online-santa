import connectDB from "utils/connectDB";
import Event from "models/Event";
import Layout from "@/layout";
import HeroEvent from "@/sections/HeroEvent";

const EventPage = ({ event }) => {
  return (
    <>
      <Layout data={{ title: event.name }}>
        <HeroEvent data={{ title: event.name }} />
      </Layout>
    </>
  );
};

export const getServerSideProps = async (context) => {
  try {
    connectDB();

    const event = await Event.findOne({
      collectionRef: context.query.collectionRef,
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
