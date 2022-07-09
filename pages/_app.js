import { ThemeProvider } from "next-themes";
import "styles/main.css";

const App = ({ Component, pageProps }) => (
  <ThemeProvider defaultTheme="emerald">
    <Component {...pageProps} />
  </ThemeProvider>
);

export default App;
