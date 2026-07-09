import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { RoleRoute } from '@/components/layout/role-route';
import { LoginPage } from '@/pages/login-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { VerifierDashboardPage } from '@/pages/verifier-dashboard-page';
import { VerifierRequestersPage } from '@/pages/verifier-requesters-page';
import { ProductsPage } from '@/pages/products-page';
import { ProductDetailPage } from '@/pages/product-detail-page';
import { UsersPage } from '@/pages/users-page';
import { CreateUserPage } from '@/pages/create-user-page';
import { AssignRequestersPage } from '@/pages/assign-requesters-page';
import { useAuthStore } from '@/stores/auth-store';
import { isVerifier } from '@/lib/auth';

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  if (token) return <Navigate to="/" replace />;
  return children;
}

function DashboardRouter() {
  const user = useAuthStore((state) => state.user);
  return isVerifier(user) ? <VerifierDashboardPage /> : <DashboardPage />;
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
          <Route index element={<DashboardRouter />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />

          <Route element={<RoleRoute allowedRoles={['VERIFIER']} />}>
            <Route path="requesters" element={<VerifierRequestersPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="users/create" element={<CreateUserPage />} />
            <Route path="users/assign" element={<AssignRequestersPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
