import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { LoginPage } from '@/pages/login-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { ProductsPage } from '@/pages/products-page';
import { ProductDetailPage } from '@/pages/product-detail-page';
import { UsersPage } from '@/pages/users-page';
import { CreateUserPage } from '@/pages/create-user-page';
import { AssignRequestersPage } from '@/pages/assign-requesters-page';
import { useAuthStore } from '@/stores/auth-store';

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  if (token) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/create" element={<CreateUserPage />} />
          <Route path="users/assign" element={<AssignRequestersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
