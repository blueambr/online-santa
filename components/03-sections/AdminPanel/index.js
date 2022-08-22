const AdminPanel = ({ data }) => {
  return (
    <section className="container py-12 lg:py-16">
      <ul role="list">
        {data.map((item) => (
          <li key={item.id}>
            <h2 className="font-sans text-lg font-normal lg:text-xl">
              {item.title}
            </h2>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminPanel;
