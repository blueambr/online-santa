const HeroEvent = ({ data }) => {
  const { name } = data;

  return (
    <>
      <section className="container text-center">
        <h1 className="font-serif text-4xl font-bold lg:text-5xl">{name}</h1>
      </section>
    </>
  );
};

export default HeroEvent;
