import './App.css'
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter, Routes, Route } from "react-router";
import Products from '@/pages/products/Products.tsx'
import Navigation from './components/Navigation';
import Home from './pages/Home';
import { NotFound } from './components/NotFound';
import Detail from './pages/products/Detail';
import About from './pages/About/About';
import Footer from './components/Footer';
import QuotationPage from './pages/QuotationPage';
/**
 * Componente principal de la aplicación
 * Configura el routing y theme provider
 */
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Navigation />
        <main className='mx-4 md:mx-auto mt-4 md:px-8 max-w-7xl'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<Detail />} />
            <Route path="/about" element={<About />} />
            <Route path="/quotation/:id" element={<QuotationPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
