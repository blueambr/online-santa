import Link from "next/link";

const Event = ({ data }) => {
  const { event, eventLinkTitle, locale } = data;

  return (
    <Link href={`/event/${event.collectionRef}`}>
      <a
        className="card mx-auto w-full bg-primary text-primary-content shadow-xl transition hover:bg-neutral hover:text-neutral-content md:w-1/2 lg:w-1/3"
        rel="noopener noreferrer"
        title={`${eventLinkTitle} ${event.name}`}
      >
        <div className="card-body items-center text-center">
          <h1 className="card-title">{event.name}</h1>
          <p>{locale === "en" ? event.excerpt : event.excerptRu}</p>
        </div>
      </a>
    </Link>
  );
};

const Events = ({ data }) => {
  const { events, eventLinkTitle, locale } = data;

  return (
    <section className="container py-12 lg:py-16">
      <ul role="list">
        {events.map((event) => (
          <li key={event._id}>
            <Event data={{ event, eventLinkTitle, locale }} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Events;
