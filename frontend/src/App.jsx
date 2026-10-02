import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import RotaProtegida from "./components/layout/RotaProtegida";
import AppLayout from "./components/layout/AppLayout";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UsuariosPage from "./pages/UsuariosPage";
import DuracoesPage from "./pages/DuracoesPage";
import DisponibilidadesPage from "./pages/DisponibilidadesPage";
import BloqueiosPage from "./pages/BloqueiosPage";
import AgendamentosPage from "./pages/agendamentos/AgendamentosPage";
import AvaliacoesPage from "./pages/AvaliacoesPage";
import NotificacoesPage from "./pages/NotificacoesPage";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <RotaProtegida>
                  <AppLayout />
                </RotaProtegida>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="duracoes" element={<DuracoesPage />} />
              <Route path="disponibilidades" element={<DisponibilidadesPage />} />
              <Route path="bloqueios" element={<BloqueiosPage />} />
              <Route path="agendamentos" element={<AgendamentosPage />} />
              <Route path="avaliacoes" element={<AvaliacoesPage />} />
              <Route path="notificacoes" element={<NotificacoesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
