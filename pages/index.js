import data from "lib/pages";
import Layout from "@/layout";

const Home = () => {
  const { page } = data;

  return (
    <>
      <Layout data={page}>
        <h1 className="h1">Home page</h1>
      </Layout>
    </>
  );
};

export default Home;
