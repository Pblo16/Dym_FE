import './App.css'
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter, Routes, Route } from "react-router";
import Products from '@/pages/products/Products.tsx'
import Navigation from './components/Navigation';
import Home from './pages/Home';
import { NotFound } from './components/NotFound';


function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Navigation />
        <main className='mx-4 md:mx-12 mt-4'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
