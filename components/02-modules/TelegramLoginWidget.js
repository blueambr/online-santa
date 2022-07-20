import { useContext, useEffect, useRef } from "react";
import GlobalContext from "context";
import { setCookie } from "utils/cookies";
import relay from "utils/relay";

const TelegramLoginWidget = () => {
  const globalContext = useContext(GlobalContext);
  const { setUser } = globalContext;
  const wrapper = useRef(null);

  const onTelegramAuth = (user) => {
    const { id, first_name, last_name, username, hash } = user;
    const dbUser = {
      id,
      first_name,
      last_name,
      username,
      hash,
    };

    relay("/api/user/add", "POST", dbUser, () => {
      setCookie("TELEGRAM_AUTH_HASH", hash);
      setUser(dbUser);
    });
  };

  useEffect(() => {
    const script = document.createElement("script");

    window.TelegramLoginWidget = {
      onTelegramAuth: (user) => onTelegramAuth(user),
    };

    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?19";
    script.setAttribute(
      "data-telegram-login",
      process.env.NODE_ENV === "development"
        ? "OnlineSantaTestBot"
        : "OnlineSantaBot"
    );
    script.setAttribute("data-size", "large");
    script.setAttribute("data-request-access", "write");
    script.setAttribute(
      "data-onauth",
      "TelegramLoginWidget.onTelegramAuth(user)"
    );

    if (wrapper) {
      wrapper.current.appendChild(script);
    }
  }, [wrapper]);

  return <div className="inline-block" ref={wrapper} />;
};

export default TelegramLoginWidget;
