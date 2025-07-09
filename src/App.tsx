import './App.css'
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter, Routes, Route } from "react-router";
import type { ReactNode } from 'react';
import Products from '@/pages/products/Products.tsx'
import Navigation from './components/Navigation';

interface AppProps {
  children?: ReactNode;
}

function App({ children }: AppProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Navigation />
        <main className='mx-4 md:mx-12 mt-4'>
          <Routes>
            <Route path="/products" element={<Products />} />
          </Routes>
          {children}
        </main>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
