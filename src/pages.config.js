import Home from './pages/Home';
import Innovations from './pages/Innovations';
import Templates from './pages/Templates';
import Automations from './pages/Automations';
import Applications from './pages/Applications';
import Contact from './pages/Contact';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import News from './pages/News';
import Showcase from './pages/Showcase';
import MusicShop from './pages/MusicShop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Admin from './pages/Admin';
import FormBuilder from './pages/FormBuilder';
import PublicForm from './pages/PublicForm';
import CRM from './pages/CRM';
import AIMusic from './pages/AIMusic';
import Partners from './pages/Partners';
import ContentStudio from './pages/ContentStudio';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Innovations": Innovations,
    "Templates": Templates,
    "Automations": Automations,
    "Applications": Applications,
    "Contact": Contact,
    "PaymentSuccess": PaymentSuccess,
    "PaymentCancel": PaymentCancel,
    "News": News,
    "Showcase": Showcase,
    "MusicShop": MusicShop,
    "Cart": Cart,
    "Checkout": Checkout,
    "OrderConfirmation": OrderConfirmation,
    "Admin": Admin,
    "FormBuilder": FormBuilder,
    "PublicForm": PublicForm,
    "CRM": CRM,
    "AIMusic": AIMusic,
    "Partners": Partners,
    "ContentStudio": ContentStudio,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};