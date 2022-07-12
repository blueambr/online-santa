import { useEffect, useRef } from "react";
import relay from "utils/relay";

const TelegramLoginWidget = () => {
  const wrapper = useRef(null);

  const onTelegramAuth = (user) => {
    const { id, first_name, last_name } = user;

    relay("/api/user/add", "POST", { id, first_name, last_name });
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
