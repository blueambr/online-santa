import Link from "next/link";

const Event = ({ data }) => {
  const { event, eventLinkTitle, locale } = data;

  return (
    <Link href={`/event/${event.collectionRef}`}>
      <a
        className="card w-full border border-transparent bg-primary text-primary-content shadow-xl transition hover:border-base-content hover:bg-base-200 hover:text-base-content"
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
      <ul className="flex flex-wrap justify-center gap-8" role="list">
        {events.map((event) => (
          <li className="w-full md:w-[calc(50%-1rem)]" key={event._id}>
            <Event data={{ event, eventLinkTitle, locale }} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Events;
