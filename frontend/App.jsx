import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Designs from './pages/Designs';
import DesignDetails from './pages/DesignDetails';
import About from './pages/About';
import CustomRequest from './pages/CustomRequest';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
// Workshop Dashboard Imports
import WorkshopLayout from './layouts/WorkshopLayout';
import WorkshopHome from './pages/workshop/WorkshopHome';
import MyDesigns from './pages/workshop/MyDesigns';
import Requests from './pages/workshop/Requests';
import CustomRequests from './pages/workshop/CustomRequests';
import ProfileSettings from './pages/workshop/ProfileSettings';
import Subscription from './pages/workshop/Subscription';

// Admin Dashboard Imports
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/Overview';
import AdminWorkshops from './pages/admin/Workshops';
import AdminUsers from './pages/admin/Users';
import AdminProducts from './pages/admin/Products';
import AdminSubscriptions from './pages/admin/Subscriptions';
import AdminRequests from './pages/admin/Requests';
import AdminPromotions from './pages/admin/Promotions';

import WorkshopsList from './pages/WorkshopsList';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Wrapper to conditionally render Layout
const AppContent = () => {
  const location = useLocation();
  const hideLayout = ['/login', '/register'].includes(location.pathname);

  // Workshop Layout handles its own structure, so we might want to hide the Main Layout when in /dashboard/workshop
  // BUT: The new WorkshopLayout *is* the layout.
  // The current <Layout> wraps EVERYTHING. If I nest WorkshopLayout inside Layout, I get double navbars.
  // WorkshopLayout has its own Sidebar and assumes full screen likely.
  // So I should also hide the main Layout if path starts with /dashboard/workshop.

  const isWorkshopDashboard = location.pathname.startsWith('/dashboard/workshop');
  const isAdminDashboard = location.pathname.startsWith('/dashboard/admin');
  const shouldHideMainLayout = hideLayout || isWorkshopDashboard || isAdminDashboard;

  return (
    <>
      {!shouldHideMainLayout ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/designs/:id" element={<DesignDetails />} />
            <Route path="/workshops" element={<WorkshopsList />} />
            <Route path="/about" element={<About />} />
            <Route path="/custom-request" element={<CustomRequest />} />
            {/* Client Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['CLIENT']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Workshop Dashboard Routes (Standalone Layout) */}
          <Route
            path="/dashboard/workshop"
            element={
              <ProtectedRoute allowedRoles={['WORKSHOP']}>
                <WorkshopLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<WorkshopHome />} />
            <Route path="products" element={<MyDesigns />} />
            <Route path="requests" element={<Requests />} />
            <Route path="custom-requests" element={<CustomRequests />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="subscribe" element={<Subscription />} />
          </Route>

          {/* Admin Dashboard Routes (Standalone Layout) */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="workshops" element={<AdminWorkshops />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="payments" element={<AdminSubscriptions />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="requests" element={<AdminRequests />} />
          </Route>
        </Routes>
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
