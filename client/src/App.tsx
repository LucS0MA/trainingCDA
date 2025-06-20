
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth"
import Layout from "./components/layout"
import HomePage from "./pages/home"
import ArticlePage from "./pages/article"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}
