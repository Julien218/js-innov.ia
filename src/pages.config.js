/**
 * pages.config.js - Page routing configuration
 * Pages are registered here for the current runtime.
 */
import AIMusic from './pages/AIMusic';
import Admin from './pages/Admin';
import Applications from './pages/Applications';
import Automations from './pages/Automations';
import Blog from './pages/Blog';
import BlogAdmin from './pages/BlogAdmin';
import BlogPost from './pages/BlogPost';
import CRM from './pages/CRM';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import ContentStudio from './pages/ContentStudio';
import CreativeStudio from './pages/CreativeStudio';
import DevisWebsite from './pages/DevisWebsite';
import ExperimentalHome from './pages/ExperimentalHome';
import FormBuilder from './pages/FormBuilder';
import Home from './pages/Home';
import Innovations from './pages/Innovations';
import LogoSenergieDour from './pages/LogoSenergieDour';
import MusicShop from './pages/MusicShop';
import News from './pages/News';
import OrderConfirmation from './pages/OrderConfirmation';
import Partners from './pages/Partners';
import PaymentCancel from './pages/PaymentCancel';
import PaymentSuccess from './pages/PaymentSuccess';
import PublicForm from './pages/PublicForm';
import QuoteDashboard from './pages/QuoteDashboard';
import SEOAudit from './pages/SEOAudit';
import SEODashboard from './pages/SEODashboard';
import Showcase from './pages/Showcase';
import Templates from './pages/Templates';
import Pricing from './pages/Pricing';
import PageManager from './pages/PageManager';
import Commande from './pages/Commande';
import Fidelite from './pages/Fidelite';
import __Layout from './Layout.jsx';

export const PAGES = {
  AIMusic,
  Admin,
  Applications,
  Automations,
  Blog,
  BlogAdmin,
  BlogPost,
  CRM,
  Cart,
  Checkout,
  Contact,
  ContentStudio,
  CreativeStudio,
  DevisWebsite,
  ExperimentalHome,
  FormBuilder,
  Home,
  Innovations,
  LogoSenergieDour,
  MusicShop,
  News,
  OrderConfirmation,
  Partners,
  PaymentCancel,
  PaymentSuccess,
  PublicForm,
  QuoteDashboard,
  SEOAudit,
  SEODashboard,
  Showcase,
  Templates,
  Pricing,
  PageManager,
  Commande,
  Fidelite,
};

export const pagesConfig = {
  mainPage: 'Home',
  Pages: PAGES,
  Layout: __Layout,
};
