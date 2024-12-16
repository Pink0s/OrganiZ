import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/home'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Login } from './pages/authentication/Login.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from './contexts/authContext.tsx'
import ProtectedRoute from './utils/ProtectedRoute.tsx'
import { Register } from './pages/authentication/Register.tsx'
import CategoriesPage from './pages/categories/index.tsx'
import { CreateCategoryPage } from './pages/categories/CreateCategoryPage.tsx'
import { UpdateCategoryPage } from './pages/categories/UpdateCategoryPage.tsx'
import ProjectsPage from './pages/projects/index.tsx'
import { CreateProjectPage } from './pages/projects/CreateProjectPage.tsx'
import { ProjectDetailsPage } from './pages/projects/ProjectDetailsPage.tsx'
import { UpdateProjectPage } from './pages/projects/UpdateProjectPage.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute children={<Home />} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/categories"
              element={<ProtectedRoute children={<CategoriesPage />} />}
            />
            <Route
              path="/categories/create"
              element={<ProtectedRoute children={<CreateCategoryPage />} />}
            />
            <Route
              path="/categories/:categoryId"
              element={<ProtectedRoute children={<UpdateCategoryPage />} />}
            />
            <Route
              path="/projects"
              element={<ProtectedRoute children={<ProjectsPage />} />}
            />
            <Route
              path="/projects/create"
              element={<ProtectedRoute children={<CreateProjectPage />} />}
            />
            <Route
              path="/projects/update/:projectId"
              element={<ProtectedRoute children={<UpdateProjectPage />} />}
            />
            <Route
              path="/projects/:projectId"
              element={<ProtectedRoute children={<ProjectDetailsPage />} />}
            />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
)
