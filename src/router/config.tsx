import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const HomePage = lazy(() => import('../pages/home/page'));
const MonthViewPage = lazy(() => import('../pages/month/page'));
const DayDetailPage = lazy(() => import('../pages/day/page'));
const FestivalsPage = lazy(() => import('../pages/festivals/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/month',
    element: <MonthViewPage />,
  },
  {
    path: '/day',
    element: <DayDetailPage />,
  },
  {
    path: '/festivals',
    element: <FestivalsPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
