import data from "lib/pages";
import Layout from "@/layout";
import Menu from "@/sections/Menu";

const Home = () => {
  const { page, menu } = data;

  return (
    <>
      <Layout data={page}>
        <div className="flex h-full flex-col justify-center">
          <Menu data={menu} />
        </div>
      </Layout>
    </>
  );
};

export default Home;
