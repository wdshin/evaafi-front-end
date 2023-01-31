import IRoute from "./interfaces/route";
import BasePage from "./pages/BasePage/BasePage";

// pages

const mainRoutes: IRoute[] = [
    {
        name: 'Base',
        path: '/',
        component: BasePage,
        auth: false
    },
];

const routes: IRoute[] = [...mainRoutes];

export default routes;
