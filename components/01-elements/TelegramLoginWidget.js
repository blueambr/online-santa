import { useEffect, useRef } from "react";

const TelegramLoginWidget = () => {
  const wrapper = useRef(null);

  const onTelegramAuth = (user) => {
    console.log(user);
  };

  useEffect(() => {
    const script = document.createElement("script");

    window.TelegramLoginWidget = {
      onTelegramAuth: (user) => onTelegramAuth(user),
    };

    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?19";
    script.setAttribute("data-telegram-login", "OnlineSantaBot");
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
