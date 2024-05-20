import { useRoutes } from "react-router-dom";
import routes from "../routes";
import ErrorPage from "../pages/404";

const useIs404Page = () => {
  const element = useRoutes(routes);
  return element.type === ErrorPage;
};

export default useIs404Page;
