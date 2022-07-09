import data from "lib/pages/user";
import Layout from "@/layout";

const User = () => {
  const { page } = data;

  return (
    <>
      <Layout data={page}>
        <h1>User page</h1>
      </Layout>
    </>
  );
};

export default User;
