
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster.jsx';
import { AuthProvider } from '@/contexts/SupabaseAuthContext.jsx';
import { ContentProvider } from '@/contexts/ContentContext.jsx';
import { GlobalSettingsProvider } from '@/contexts/GlobalSettingsContext.jsx';
import { CartProvider } from '@/hooks/useCart.jsx';
import { AdminProvider } from '@/contexts/AdminContext.jsx';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import LuxuryFooter from '@/components/LuxuryFooter.jsx';
import GeoBlocker from '@/components/GeoBlocker.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import PageTransition from '@/components/PageTransition.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import UrlNormalization from '@/components/UrlNormalization.jsx';
import { checkSupabaseHealth } from '@/lib/supabaseHealthCheck.js';
import { supabase } from '@/lib/customSupabaseClient.js';
import { initPerformanceMonitoring } from '@/lib/performanceMonitoring.js';
import SEOHead from '@/components/SEOHead.jsx';
import { OrganizationSchema } from '@/components/SchemaMarkup.jsx';
import { runSEOMonitor } from '@/lib/seoValidationMonitor.js';

// CRITICAL ROUTES - Always loaded
const HomePage = lazy(() => import('@/pages/HomePage.jsx'));
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage.jsx'));

// LAZY LOADED ROUTES - Load on demand
const AboutPage = lazy(() => import('@/pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('@/pages/ContactPage.jsx'));
const PoliciesPage = lazy(() => import('@/pages/PoliciesPage.jsx'));
const FAQPage = lazy(() => import('@/pages/FAQPage.jsx'));
const SitemapPage = lazy(() => import('@/pages/SitemapPage.jsx'));
const ClickAdPage = lazy(() => import('@/pages/ClickAdPage.jsx'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage.jsx'));

const HorsesPage = lazy(() => import('@/pages/HorsesPage.jsx'));
const HorseDetailPage = lazy(() => import('@/pages/HorseDetailPage.jsx'));
const ReservePage = lazy(() => import('@/pages/ReservePage.jsx'));
const ReservationPage = lazy(() => import('@/pages/ReservationPage.jsx'));

const ServicesPage = lazy(() => import('@/pages/ServicesPage.jsx'));

const BlogPage = lazy(() => import('@/pages/BlogPage.jsx'));
const BlogArticlePage = lazy(() => import('@/pages/BlogArticlePage.jsx'));
const FriesianBreedHistoryPage = lazy(() => import('@/pages/FriesianBreedHistoryPage.jsx'));
const FriesianPricingPage = lazy(() => import('@/pages/FriesianPricingPage.jsx'));
const FriesianCareTrainingPage = lazy(() => import('@/pages/FriesianCareTrainingPage.jsx'));
const FriesianTemperamentPage = lazy(() => import('@/pages/FriesianTemperamentPage.jsx'));
const FriesianExportGuidePage = lazy(() => import('@/pages/FriesianExportGuidePage.jsx'));

const LocationsPage = lazy(() => import('@/pages/LocationsPage.jsx'));
const RegionalHubPage = lazy(() => import('@/pages/RegionalHubPage.jsx'));

const ReviewsPage = lazy(() => import('@/pages/ReviewsPage.jsx'));
const FacilityPage = lazy(() => import('@/pages/FacilityPage.jsx'));

const StorePage = lazy(() => import('@/pages/StorePage.jsx'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage.jsx'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage.jsx'));
const SuccessPage = lazy(() => import('@/pages/SuccessPage.jsx'));
const RequestPage = lazy(() => import('@/pages/RequestPage.jsx'));

const AdminPage = lazy(() => import('@/pages/admin/AdminPage.jsx'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard.jsx'));
const AdminBlogPage = lazy(() => import('@/pages/admin/AdminBlogPage.jsx'));
const AdminBlogEditorPage = lazy(() => import('@/pages/admin/AdminBlogEditorPage.jsx'));
const AdminHorseFactsPage = lazy(() => import('@/pages/admin/AdminHorseFactsPage.jsx'));
const AdminHorseManagementPage = lazy(() => import('@/pages/admin/AdminHorseManagementPage.jsx'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage.jsx'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage.jsx'));
const AdminFAQDashboard = lazy(() => import('@/pages/AdminFAQDashboard.jsx'));
const AdminRecentMatchesPage = lazy(() => import('@/pages/admin/AdminRecentMatchesPage.jsx'));

const GlobalStandardEditor = lazy(() => import('@/pages/admin/GlobalStandardEditor.jsx'));
const MeetTheExpertsEditor = lazy(() => import('@/pages/admin/MeetTheExpertsEditor.jsx'));
const GlobalDeliveryEditor = lazy(() => import('@/pages/admin/GlobalDeliveryEditor.jsx'));
const DeliveryReachVideoEditor = lazy(() => import('@/pages/admin/DeliveryReachVideoEditor.jsx'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background flex-col w-full">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-foreground/60 font-serif animate-pulse">Loading Titan Stables...</p>
    </div>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("Uncaught App Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="text-center max-w-md bg-card border border-border p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">Something went wrong</h2>
                <p className="text-foreground/80 mb-6">Please try refreshing the page.</p>
                <button onClick={() => window.location.reload()} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">Refresh Page</button>
            </div>
        </div>
      );
    }
    return this.props.children; 
  }
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState('checking');
  const [configError, setConfigError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    try { 
      initPerformanceMonitoring(); 
    } catch (err) {
      console.warn('Performance monitoring failed to initialize:', err);
    }
    
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
      setConfigError(true);
      setDbStatus('ready');
      return;
    }
    const initApp = async () => {
      try {
        await supabase.auth.refreshSession();
        await checkSupabaseHealth();
      } catch (err) {
        console.warn('Health check failed:', err);
      } finally { 
        setDbStatus('ready'); 
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    try {
      runSEOMonitor();
    } catch (err) {
      console.warn('SEO monitor failed:', err);
    }
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin-login';
  const isAuthRoute = location.pathname === '/admin-login';

  if (configError) return <LoadingFallback />;
  if (dbStatus === 'checking') return <LoadingFallback />;

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <AdminProvider>
            <GlobalSettingsProvider>
              <ContentProvider>
                <CartProvider>
                  <ScrollToTop />
                  <SEOHead title="Titan Stables - Premium KFPS Friesian Horses" description="Premium Friesian horses." />
                  <OrganizationSchema />
                  <UrlNormalization>
                    <GeoBlocker>
                      <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
                        {!isAdminRoute && !isAuthRoute && <Header setIsCartOpen={setIsCartOpen} />}
                        
                        <main className="flex-grow flex flex-col relative w-full overflow-hidden">
                          <Suspense fallback={<LoadingFallback />}>
                            <AnimatePresence mode="wait">
                              <Routes location={location} key={location.pathname}>
                                <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                                <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
                                <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
                                <Route path="/policies" element={<PageTransition><PoliciesPage /></PageTransition>} />
                                <Route path="/faq" element={<PageTransition><FAQPage /></PageTransition>} />
                                <Route path="/faqs" element={<PageTransition><FAQPage /></PageTransition>} />
                                <Route path="/sitemap" element={<PageTransition><SitemapPage /></PageTransition>} />
                                <Route path="/own-a-titan" element={<PageTransition><ClickAdPage /></PageTransition>} />
                                
                                <Route path="/horses" element={<PageTransition><HorsesPage /></PageTransition>} />
                                <Route path="/horses/available" element={<PageTransition><HorsesPage defaultFilter="available" /></PageTransition>} />
                                <Route path="/horses/sold" element={<PageTransition><HorsesPage defaultFilter="sold" /></PageTransition>} />
                                <Route path="/horses/breeding" element={<PageTransition><HorsesPage defaultFilter="breeding" /></PageTransition>} />
                                <Route path="/horses/:id" element={<PageTransition><HorseDetailPage /></PageTransition>} />
                                <Route path="/reserve" element={<PageTransition><ReservePage /></PageTransition>} />
                                <Route path="/reservation" element={<PageTransition><ReservationPage /></PageTransition>} />
                                
                                <Route path="/services" element={<PageTransition><ServicesPage /></PageTransition>} />
                                <Route path="/services/training" element={<PageTransition><ServicesPage tab="training" /></PageTransition>} />
                                <Route path="/services/boarding" element={<PageTransition><ServicesPage tab="boarding" /></PageTransition>} />
                                <Route path="/services/breeding" element={<PageTransition><ServicesPage tab="breeding" /></PageTransition>} />
                                
                                <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
                                <Route path="/blog/care" element={<PageTransition><BlogPage category="care" /></PageTransition>} />
                                <Route path="/blog/training" element={<PageTransition><BlogPage category="training" /></PageTransition>} />
                                <Route path="/blog/breeding" element={<PageTransition><BlogPage category="breeding" /></PageTransition>} />
                                <Route path="/blog/:slug" element={<PageTransition><BlogArticlePage /></PageTransition>} />
                                
                                <Route path="/locations" element={<PageTransition><LocationsPage /></PageTransition>} />
                                <Route path="/locations/:region" element={<PageTransition><RegionalHubPage /></PageTransition>} />

                                <Route path="/gallery" element={<PageTransition><FacilityPage /></PageTransition>} />
                                <Route path="/facility" element={<PageTransition><FacilityPage /></PageTransition>} />
                                <Route path="/testimonials" element={<PageTransition><ReviewsPage /></PageTransition>} />
                                <Route path="/reviews" element={<PageTransition><ReviewsPage /></PageTransition>} />
                                
                                <Route path="/store" element={<PageTransition><StorePage /></PageTransition>} />
                                <Route path="/product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
                                <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
                                <Route path="/success" element={<PageTransition><SuccessPage /></PageTransition>} />
                                <Route path="/request" element={<PageTransition><RequestPage /></PageTransition>} />

                                <Route path="/admin-login" element={<PageTransition><AdminLoginPage /></PageTransition>} />
                                <Route path="/login" element={<Navigate to="/admin-login" replace />} />
                                
                                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                                <Route path="/admin/global-standard" element={<ProtectedRoute><GlobalStandardEditor /></ProtectedRoute>} />
                                <Route path="/admin/meet-experts" element={<ProtectedRoute><MeetTheExpertsEditor /></ProtectedRoute>} />
                                <Route path="/admin/global-delivery" element={<ProtectedRoute><GlobalDeliveryEditor /></ProtectedRoute>} />
                                <Route path="/admin/delivery-reach" element={<ProtectedRoute><DeliveryReachVideoEditor /></ProtectedRoute>} />
                                <Route path="/admin/recent-matches" element={<ProtectedRoute><AdminRecentMatchesPage /></ProtectedRoute>} />
                                
                                <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
                                <Route path="/admin/blog" element={<ProtectedRoute><AdminBlogPage /></ProtectedRoute>} />
                                <Route path="/admin/blog/editor" element={<ProtectedRoute><AdminBlogEditorPage /></ProtectedRoute>} />
                                <Route path="/admin/blog/editor/:id" element={<ProtectedRoute><AdminBlogEditorPage /></ProtectedRoute>} />
                                <Route path="/admin/horses" element={<ProtectedRoute><AdminHorseManagementPage /></ProtectedRoute>} />
                                <Route path="/admin/horse-facts" element={<ProtectedRoute><AdminHorseFactsPage /></ProtectedRoute>} />
                                <Route path="/admin/faq-editor" element={<Navigate to="/admin/faqs" replace />} />
                                <Route path="/admin/faqs" element={<ProtectedRoute><AdminFAQDashboard /></ProtectedRoute>} />
                                <Route path="/admin/settings" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
                                
                                <Route path="*" element={<Navigate to="/" replace />} />
                              </Routes>
                            </AnimatePresence>
                          </Suspense>
                        </main>
                        
                        {!isAdminRoute && !isAuthRoute && <LuxuryFooter />}
                        {!isAdminRoute && !isAuthRoute && <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />}
                        <Toaster />
                      </div>
                    </GeoBlocker>
                  </UrlNormalization>
                </CartProvider>
              </ContentProvider>
            </GlobalSettingsProvider>
          </AdminProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
