const Hero = ({ data }) => {
  const { name } = data;

  return (
    <>
      <section className="container py-12 text-center lg:py-16">
        <h1 className="font-serif text-4xl font-bold lg:text-5xl">{name}</h1>
      </section>
    </>
  );
};

export default Hero;
