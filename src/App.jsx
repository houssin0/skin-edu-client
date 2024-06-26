import { CssBaseline, ThemeProvider } from "@mui/material";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import RTL from "components/RTL";
import useSettings from "hooks/useSettings";
import { useRoutes, useLocation, matchRoutes } from "react-router-dom";
import routes from "./routes";
import { createCustomTheme } from "theme";
import "./i18n";
import Chatbot from '../src/chatBot/Chatbot';
import AuthContext from "contexts/JWTAuth";
import { useContext } from "react";
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const allPages = useRoutes(routes);
  const { settings } = useSettings();
  const theme = createCustomTheme({
    theme: settings.theme,
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes
  });
  
  const location = useLocation();
  const matchedRoutes = matchRoutes(routes, location);

  const is404Page = !matchedRoutes || matchedRoutes.some(match => match.route.path === '*');

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <RTL>
          <CssBaseline />
          {allPages}
          {isAuthenticated && user.is_approved && !is404Page && <Chatbot />}
          <Toaster />
        </RTL>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
 