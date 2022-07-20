import { useEffect, useState } from "react";
import GlobalContext from "context";
import getCookie from "utils/cookies";
import relay from "utils/relay";
import "styles/main.css";

const App = ({ Component, pageProps }) => {
  const [user, setUser] = useState(null);

  const checkAuthorization = () => {
    const hash = getCookie("TELEGRAM_AUTH_HASH");

    if (hash) {
      relay("/api/user/get", "POST", hash, (res) => {
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
