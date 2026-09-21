import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ShippingPage from "./pages/ShippingPage";
import StorePage from "./pages/StorePage";
import ShippingRequestPage from "./pages/ShippingRequestPage";
import ShippingTrackPage from "./pages/ShippingTrackPage";
import ShippingCallPage from "./pages/ShippingCallPage";
import MonCashReturnPage from "./pages/MonCashReturnPage";
import ProductsPage from "./pages/ProductsPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import ApplyPage from "./pages/ApplyPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/shipping/request" element={<ShippingRequestPage />} />
              <Route path="/shipping/track" element={<ShippingTrackPage />} />
              <Route path="/shipping/track/:number" element={<ShippingTrackPage />} />
              <Route path="/shipping/call" element={<ShippingCallPage />} />
              <Route path="/shipping/moncash/return" element={<MonCashReturnPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/apply" element={<ApplyPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;