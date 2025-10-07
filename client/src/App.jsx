import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import RecipeDetailPage from "./pages/RecipeDetail.jsx";
import RecipeFormPage from "./pages/RecipeForm.jsx";
import ProfilePage from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AboutPage from "./pages/About.jsx";
import ContactPage from "./pages/Contact.jsx";
import NotFoundPage from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/add" element={<RecipeFormPage mode="create" />} />
            <Route path="/edit/:id" element={<RecipeFormPage mode="edit" />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin />}>
            <Route index element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;
