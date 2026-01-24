import { RouteObject } from "react-router-dom";
import { lazy } from "react";

/* EXISTING PAGES */
const HomePage = lazy(() => import("../pages/home/page"));
const MonthViewPage = lazy(() => import("../pages/month/page"));
const DayDetailPage = lazy(() => import("../pages/day/page"));
const FestivalsPage = lazy(() => import("../pages/festivals/page"));
const NotFound = lazy(() => import("../pages/NotFound"));

/* 🔮 RASHIPHALALU PAGES */
const RashiphalaluHome = lazy(
  () => import("../pages/rashiphalalu/page")
);
const RasiSelectionPage = lazy(
  () => import("../pages/rashiphalalu/rasi")
);
const RashiDetailPage = lazy(
  () => import("../pages/rashiphalalu/detail")
);

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },

  /* 🔮 RASHIPHALALU ROUTES */
  {
    path: "/rashiphalalu",
    element: <RashiphalaluHome />,
  },
  {
    path: "/rashiphalalu/:type",
    element: <RasiSelectionPage />,
  },
  {
    path: "/rashiphalalu/:type/:rasi",
    element: <RashiDetailPage />,
  },

  /* EXISTING ROUTES */
  {
    path: "/month",
    element: <MonthViewPage />,
  },
  {
    path: "/day",
    element: <DayDetailPage />,
  },
  {
    path: "/festivals",
    element: <FestivalsPage />,
  },

  /* FALLBACK */
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
