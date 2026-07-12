/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import Commande from './pages/Commande';
import Fidelite from './pages/Fidelite';
import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
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
import DynamicPageView from './pages/DynamicPageView';
import Commande from './pages/Commande';
import Fidelite from './pages/Fidelite';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIMusic": AIMusic,
    "Admin": Admin,
    "Applications": Applications,
    "Automations": Automations,
    "Blog": Blog,
    "BlogAdmin": BlogAdmin,
    "BlogPost": BlogPost,
    "CRM": CRM,
    "Cart": Cart,
    "Checkout": Checkout,
    "Contact": Contact,
    "ContentStudio": ContentStudio,
    "DevisWebsite": DevisWebsite,
    "ExperimentalHome": ExperimentalHome,
    "FormBuilder": FormBuilder,
    "Home": Home,
    "Innovations": Innovations,
    "LogoSenergieDour": LogoSenergieDour,
    "MusicShop": MusicShop,
    "News": News,
    "OrderConfirmation": OrderConfirmation,
    "Partners": Partners,
    "PaymentCancel": PaymentCancel,
    "PaymentSuccess": PaymentSuccess,
    "PublicForm": PublicForm,
    "QuoteDashboard": QuoteDashboard,
    "SEOAudit": SEOAudit,
    "SEODashboard": SEODashboard,
    "Showcase": Showcase,
    "Templates": Templates,
    "Pricing": Pricing,
    "PageManager": PageManager,
    "Commande": Commande,
    "Fidelite": Fidelite,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};