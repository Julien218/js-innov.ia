import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DynamicPageView from './pages/DynamicPageView';
import Visuels from './pages/Visuels';
import WebOSHome from './pages/WebOSHome';
import WebOSPortfolio from './pages/WebOSPortfolio';
import WebOSServices from './pages/WebOSServices';
import WebOSOffre from './pages/WebOSOffre';
import WebOSContact from './pages/WebOSContact';
import WebOSAdmin from './pages/WebOSAdmin';
import WebOSMentions from './pages/WebOSMentions';
import WebOSLayout from './components/webos/WebOSLayout';
import SaasLayout from './components/saas/SaasLayout';
import SaasHome from './pages/saas/SaasHome';
import SaasPacks from './pages/saas/SaasPacks';
import SaasAnalyse from './pages/saas/SaasAnalyse';
import SaasAdmin from './pages/saas/SaasAdmin';
import SaasAgents from './pages/saas/SaasAgents';
import SaasContact from './pages/saas/SaasContact';
import SaasDevis from './pages/saas/SaasDevis';
import SaasLanding from './pages/saas/SaasLanding';
import SaasClientDashboard from './pages/saas/SaasClientDashboard';
import SaasEvents from './pages/saas/SaasEvents';
import SaasLegal from './pages/saas/SaasLegal';
import SaasChatbot from './components/chatbot/AIChatbot';
import SaasChatbotAdmin from './pages/saas/SaasChatbotAdmin';
import EcranLed from './pages/saas/EcranLed';
import Ps from './pages/Ps';
import CockpitConnectedSite from './pages/CockpitConnectedSite';
import __Layout from './Layout.jsx';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<SaasLayout><SaasLanding /><SaasChatbot /></SaasLayout>} />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/Visuels" element={
        <__Layout currentPageName="Visuels">
          <Visuels />
        </__Layout>
      } />
      <Route path="/page/:slug" element={
        <__Layout currentPageName="DynamicPageView">
          <DynamicPageView />
        </__Layout>
      } />
      {/* WebOS Routes */}
      <Route path="/webos" element={<WebOSLayout><WebOSHome /></WebOSLayout>} />
      <Route path="/webos-portfolio" element={<WebOSLayout><WebOSPortfolio /></WebOSLayout>} />
      <Route path="/webos-services" element={<WebOSLayout><WebOSServices /></WebOSLayout>} />
      <Route path="/webos-offre" element={<WebOSLayout><WebOSOffre /></WebOSLayout>} />
      <Route path="/webos-contact" element={<WebOSLayout><WebOSContact /></WebOSLayout>} />
      <Route path="/webos-admin" element={<WebOSLayout><WebOSAdmin /></WebOSLayout>} />
      <Route path="/webos-mentions" element={<WebOSLayout><WebOSMentions /></WebOSLayout>} />
      {/* SaaS Routes */}
      <Route path="/saas" element={<SaasLayout><SaasHome /><SaasChatbot /></SaasLayout>} />
      <Route path="/saas-packs" element={<SaasLayout><SaasPacks /><SaasChatbot /></SaasLayout>} />
      <Route path="/saas-analyse" element={<SaasLayout><SaasAnalyse /></SaasLayout>} />
      <Route path="/saas-admin" element={<SaasLayout><SaasAdmin /></SaasLayout>} />
      <Route path="/saas-agents" element={<SaasLayout><SaasAgents /><SaasChatbot /></SaasLayout>} />
      <Route path="/saas-contact" element={<SaasLayout><SaasContact /></SaasLayout>} />
      <Route path="/saas-mentions" element={<SaasLayout><SaasLegal type="mentions" /></SaasLayout>} />
      <Route path="/saas-confidentialite" element={<SaasLayout><SaasLegal type="confidentialite" /></SaasLayout>} />
      <Route path="/saas-cgv" element={<SaasLayout><SaasLegal type="cgv" /></SaasLayout>} />
      <Route path="/saas-devis" element={<SaasLayout><SaasDevis /></SaasLayout>} />
      <Route path="/saas-landing" element={<SaasLayout><SaasLanding /></SaasLayout>} />
      <Route path="/saas-client" element={<SaasLayout><SaasClientDashboard /></SaasLayout>} />
      <Route path="/saas-events" element={<SaasLayout><SaasEvents /></SaasLayout>} />
      <Route path="/saas-chatbot-admin" element={<SaasLayout><SaasChatbotAdmin /></SaasLayout>} />
      <Route path="/cockpit" element={<CockpitConnectedSite />} />
      <Route path="/site-cockpit" element={<CockpitConnectedSite />} />
      <Route path="/ecran" element={<EcranLed />} />
      <Route path="/ps" element={<Ps />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
