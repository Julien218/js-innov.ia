// Build trigger: force rebuild for /ecranespacec route
import { lazy, Suspense } from 'react';
import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { lazyPagesConfig as pagesConfig } from './config/lazyPages'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SaasLayout from './components/saas/SaasLayout';
import SaasLanding from './pages/saas/SaasLanding';
import SaasChatbot from './components/chatbot/AIChatbot';
import { resolveProductExperience } from './lib/productHostRouter';
import __Layout from './Layout.jsx';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const DynamicPageView = lazy(() => import('./pages/DynamicPageView'));
const Visuels = lazy(() => import('./pages/Visuels'));
const SaasHome = lazy(() => import('./pages/saas/SaasHome'));
const SaasPacks = lazy(() => import('./pages/saas/SaasPacks'));
const SaasAnalyse = lazy(() => import('./pages/saas/SaasAnalyse'));
const SaasAdmin = lazy(() => import('./pages/saas/SaasAdmin'));
const SaasAgents = lazy(() => import('./pages/saas/SaasAgents'));
const SaasContact = lazy(() => import('./pages/saas/SaasContact'));
const SaasDevis = lazy(() => import('./pages/saas/SaasDevis'));
const SaasClientDashboard = lazy(() => import('./pages/saas/SaasClientDashboard'));
const SaasEvents = lazy(() => import('./pages/saas/SaasEvents'));
const SaasLegal = lazy(() => import('./pages/saas/SaasLegal'));
const SaasChatbotAdmin = lazy(() => import('./pages/saas/SaasChatbotAdmin'));
const EcranLed = lazy(() => import('./pages/saas/EcranLed'));
const EcranEspaceC = lazy(() => import('./pages/saas/EcranEspaceC'));
const Ps = lazy(() => import('./pages/Ps'));
const CockpitConnectedSite = lazy(() => import('./pages/CockpitConnectedSite'));
const CataloguePricingDraft = lazy(() => import('./pages/CataloguePricingDraft'));
const HainoFlowLanding = lazy(() => import('./pages/HainoFlowLanding'));

const { Pages, Layout } = pagesConfig;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const DomainAwareHome = () => {
  const experience = resolveProductExperience(window.location.hostname);

  if (experience === 'hainoflow') {
    return <SaasLayout><HainoFlowLanding /><SaasChatbot /></SaasLayout>;
  }

  if (experience === 'signage') {
    return <EcranLed />;
  }

  if (experience === 'cockpit') {
    return <CockpitConnectedSite />;
  }

  return <SaasLayout><SaasLanding /><SaasChatbot /></SaasLayout>;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

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
      <Route path="/" element={<DomainAwareHome />} />
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
      <Route path="/hainoflow" element={<SaasLayout><HainoFlowLanding /><SaasChatbot /></SaasLayout>} />
      {/* Draft-only route: intentionally absent from public navigation. */}
      <Route path="/catalogue-tarifs-brouillon" element={<SaasLayout><CataloguePricingDraft /></SaasLayout>} />
      <Route path="/ecran" element={<EcranLed />} />
      <Route path="/ecranespacec" element={<EcranEspaceC />} />
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
          <Suspense fallback={<div className="fixed inset-0 grid place-items-center bg-[#060610] text-sm font-bold text-white/60">Chargement sécurisé…</div>}>
            <AuthenticatedApp />
          </Suspense>
        </Router>
        <Toaster />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
