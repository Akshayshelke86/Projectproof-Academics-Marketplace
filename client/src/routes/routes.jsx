import { lazy } from 'react';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('../pages/landing/LandingPage'));
const HomePage = lazy(() => import('../pages/home/HomePage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const OrdersPage = lazy(() => import('../pages/orders/OrdersPage'));
const InvoicesPage = lazy(() => import('../pages/orders/OrdersPage')); // Assuming same component as before
const CryptoWalletPage = lazy(() => import('../pages/crytowallet/CryptoWalletPage'));
const ProjectsPage = lazy(() => import('../pages/projects/ProjectsPage'));
const DetailPage = lazy(() => import('../pages/detail/DetailPage'));
const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const RegisterPage = lazy(() => import('../pages/register/RegisterPage'));
const MarketplacePage = lazy(() => import('../pages/marketplace/MarketplacePage'));
const SubmitProjectPage = lazy(() => import('../pages/submit/SubmitProjectPage'));
const ProjectReviewPage = lazy(() => import('../pages/review/ProjectReviewPage'));

const WalletPage = lazy(() => import('../pages/dashboard/WalletPage'));
const WishlistPage = lazy(() => import('../pages/dashboard/WishlistPage'));
const PublicProfilePage = lazy(() => import('../pages/profile/PublicProfilePage'));
const LegalPages = lazy(() => import('../pages/legal/LegalPages'));

export const routes = [
  // ... existing routes
  {
    path: "/profile/:id",
    element: <PublicProfilePage />,
  },
  {
    path: "/wallet",
    element: <WalletPage />,
  },
  {
    path: "/wishlist",
    element: <WishlistPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/marketplace",
    element: <MarketplacePage />,
  },
  {
    path: "/submit-project",
    element: <SubmitProjectPage />,
  },
  {
    path: "/projects",
    element: <ProjectReviewPage />,
  },
  {
    path: "/detail/:id",
    element: <DetailPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  },
  {
    path: "/invoices",
    element: <InvoicesPage />,
  },
  {
    path: "/cryptowallet",
    element: <CryptoWalletPage />,
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
  {
    path: "/legal/:slug",
    element: <LegalPages />,
  },
];
