import { useContext } from "react";
import { useRouter } from "next/router";
import GlobalContext from "context";
import data from "lib/en/pages/admin";
import dataRu from "lib/ru/pages/admin";
import Layout from "@/layout";
import Preloader from "@/elements/Preloader";
import Hero from "@/sections/Hero";
import AdminPanel from "@/sections/AdminPanel";

const Admin = () => {
  const globalContext = useContext(GlobalContext);
  const { user } = globalContext;
  const router = useRouter();
  const { locale } = router;

  const getData = () => {
    switch (locale) {
      case "en":
        return data;
      case "ru":
        return dataRu;
    }
  };

  const { page, hero, panel } = getData();

  return (
    <>
      <Layout data={page}>
        {user === null ? (
          <section className="container py-12 lg:py-16">
            <Preloader />
          </section>
        ) : !user || !user.isAdmin ? (
          <section className="container py-12 lg:py-16">
            <div className="text-center">
              <h1 className="font-serif text-6xl text-neutral-content">⛔</h1>
            </div>
          </section>
        ) : (
          <>
            <Hero data={hero} />
            <AdminPanel data={panel} />
          </>
        )}
      </Layout>
    </>
  );
};

export default Admin;
