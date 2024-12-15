import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/home'
import {BrowserRouter, Route, Routes} from "react-router";
import {Login} from "./pages/authentication/Login.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './contexts/authContext.tsx';
import ProtectedRoute from './utils/ProtectedRoute.tsx';
import { Register } from './pages/authentication/Register.tsx';
import CategoriesPage from './pages/categories/index.tsx';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<ProtectedRoute children={<Home />}/>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/categories" element={<ProtectedRoute children={<CategoriesPage />}/>}/>
              </Routes>
          </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
)
