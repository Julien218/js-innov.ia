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
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};