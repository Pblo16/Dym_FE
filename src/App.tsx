import './App.css'
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter, Routes, Route } from "react-router";
import Products from '@/pages/products/Products.tsx'
import Navigation from './components/Navigation';
import Home from './pages/Home';
import { NotFound } from './components/NotFound';
import Detail from './pages/products/Detail';
import { AuthProvider } from '@/contexts/AuthContext';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import Profile from './pages/profile/Profile';
import About from './pages/About/About';
import Footer from './components/Footer';
/**
 * Componente principal de la aplicación
 * Configura el routing, theme provider y authentication provider
 */
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Navigation />
          <main className='mx-4 md:mx-auto mt-4 md:px-8 max-w-7xl'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<Detail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
