import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import cookieCutter from "cookie-cutter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHouse,
  faLanguage,
  faMoon,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Header = ({ data }) => {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { icon, title, nav } = data;
  const getIcon = (req) => {
    switch (req) {
      case "bars":
        return faBars;
      case "house":
        return faHouse;
      case "language":
        return faLanguage;
      case "moon":
        return faMoon;
      case "sun":
        return faSun;
      case "user":
        return faUser;
    }
  };

  const renderNavItems = () =>
    nav.map((item) => {
      if (item.isLanguageSelector) {
        return (
          <div className="collapse" key={item.id}>
            <input
              type="checkbox"
              className="peer !min-h-0 !px-4 !py-2"
              title={item.title}
            />
            <div className="collapse-title flex min-h-0 items-center px-4 py-2">
              <FontAwesomeIcon
                className="mr-4 w-6"
                icon={getIcon(item.icon)}
                size="lg"
              />
              <div className="text-lg">{item.text}</div>
            </div>
            <div className="collapse-content !px-0 !pb-0">
              <ul role="list">
                {item.langs.map((lang) => (
                  <li key={lang.id}>
                    <button
                      className="block w-full px-4 py-2 text-left"
                      type="button"
                      onClick={() => {
                        cookieCutter.set("NEXT_LOCALE", lang.locale);
                        router.push({ pathname, query }, asPath, {
                          locale: lang.locale,
                        });
                      }}
                    >
                      {lang.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      } else if (item.isThemeSwitcher) {
        return mounted ? (
          <button
            className="flex items-center px-4 py-2"
            key={item.id}
            type="button"
            onClick={() => {
              if (theme === "forest") {
                setTheme("emerald");
              } else {
                setTheme("forest");
              }
            }}
          >
            <FontAwesomeIcon
              className="mr-4 w-6"
              icon={getIcon(theme === "forest" ? item.icon : item.iconDark)}
              size="lg"
            />
            <div className="text-lg">
              {theme === "forest" ? item.text : item.textDark}
            </div>
          </button>
        ) : null;
      } else {
        return (
          <Link href={item.href} key={item.id}>
            <a className="flex items-center px-4 py-2">
              <FontAwesomeIcon
                className="mr-4 w-6"
                icon={getIcon(item.icon)}
                size="lg"
              />
              <div className="text-lg">{item.text}</div>
            </a>
          </Link>
        );
      }
    });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed left-1/2 bottom-4 -translate-x-1/2">
      <div className="dropdown-top dropdown">
        <label
          className="relative block h-14 w-14 cursor-pointer rounded-full bg-primary"
          tabIndex="0"
          title={title}
        >
          <FontAwesomeIcon
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-content"
            icon={getIcon(icon)}
            size="2xl"
          />
        </label>
        <nav
          className="dropdown-content rounded-box left-1/2 mb-2 w-64 -translate-x-1/2 bg-base-100 py-2 shadow shadow-primary"
          tabIndex="0"
        >
          {renderNavItems()}
        </nav>
      </div>
    </header>
  );
};

export default Header;
