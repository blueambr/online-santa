const HeroEvent = ({ data }) => {
  const { title } = data;

  return (
    <>
      <section className="container text-center">
        <h1 className="font-serif text-4xl font-bold lg:text-5xl">{title}</h1>
      </section>
    </>
  );
};

export default HeroEvent;
