import { useEffect, useState } from "react";
import GlobalContext from "context";
import getCookie from "utils/cookies";
import relay from "utils/relay";
import "styles/main.css";

const App = ({ Component, pageProps }) => {
  const [user, setUser] = useState(null);

  const checkAuthorization = () => {
    const telegramAuthCookie = getCookie("TELEGRAM_AUTH");

    if (telegramAuthCookie) {
      const hash = telegramAuthCookie.substring(
        0,
        telegramAuthCookie.indexOf("&id=")
      );
      const id = telegramAuthCookie.substring(
        telegramAuthCookie.indexOf("&id=") + 4
      );

      console.log(hash, id);

      relay("/api/user/get", "POST", { hash, id }, (res) => {
        const { user } = res;

        if (user) {
          setUser(user);
          return;
        }

        setUser(false);
      });
    } else {
      setUser(false);
    }
  };

  useEffect(() => {
    checkAuthorization();
  }, []);

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      <Component {...pageProps} />
    </GlobalContext.Provider>
  );
};

export default App;
