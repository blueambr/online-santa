import connectDB from "utils/connectDB";
import Event from "models/Event";
import Layout from "@/layout";

const EventPage = ({ event }) => {
  return (
    <>
      <Layout data={{ title: event.name }}>
        <h1 className="font-serif text-6xl">{event.name}</h1>
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
