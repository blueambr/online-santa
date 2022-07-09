import data from "lib/pages/events";
import Layout from "@/layout";

const Events = () => {
  const { page } = data;

  return (
    <>
      <Layout data={page}>
        <h1>Events page</h1>
      </Layout>
    </>
  );
};

export default Events;
