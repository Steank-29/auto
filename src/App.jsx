// src/App.js
import Layout from "./components/Layout";
import Home from "./components/Home";
import Contact from "./components/Contact";
import Signin from "./components/Signin";
import Details from './components/Details';
import Checkout from './components/Checkout';
import Products from './components/Products';
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";
import AdminProducts from "./components/AdminProducts";
import AdminStock from "./components/AdminStock";
import AdminContact from "./components/AdminContact";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminSettings from "./components/AdminSettings";
import NotFound from "./components/NotFound";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <Layout>
              <Home />
            </Layout>
          } 
        />

         <Route 
          path="/contact" 
          element={
            <Layout>
              <Contact />
            </Layout>
          } 
        />

        <Route 
          path="/checkout" 
          element={
            <Layout>
              <Checkout />
            </Layout>
          } 
        />

         <Route 
          path="/products" 
          element={
            <Layout>
              <Products />
            </Layout>
          } 
        />

        <Route 
          path="/product/:id" 
          element={
            <Layout>
              <Details />
            </Layout>
          } 
        />
        
        <Route path="/signin" element={<Signin />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/products" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/products/add" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/products/stock" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminStock />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/contact" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminContact />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/settings" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />



        {/* Catch all - redirect to home */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;