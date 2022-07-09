import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faUser } from "@fortawesome/free-solid-svg-icons";

const Menu = ({ data }) => {
  const getIcon = (req) => {
    switch (req) {
      case "door-open":
        return faDoorOpen;
      case "user":
        return faUser;
    }
  };

  return (
    <section className="py-8">
      <div className="container">
        <nav className="flex flex-col justify-center gap-4 md:flex-row">
          {data.map((item) => (
            <Link href={item.href} key={item.id}>
              <a className="block basis-1/2 rounded-lg border-2 border-primary bg-base-100 p-4 text-center md:basis-1/3">
                <FontAwesomeIcon icon={getIcon(item.icon)} size="3x" />
                <div className="text-3xl">{item.text}</div>
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default Menu;
