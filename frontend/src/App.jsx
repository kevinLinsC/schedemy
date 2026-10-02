import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import RotaProtegida from "./components/layout/RotaProtegida";
import AppLayout from "./components/layout/AppLayout";

import LoginPage from "./pages/LoginPage";
import CadastroPage from "./pages/CadastroPage";
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
            <Route path="/cadastro" element={<CadastroPage />} />

            <Route
              path="/"
              element={
                <RotaProtegida>
                  <AppLayout />
                </RotaProtegida>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route
                path="usuarios"
                element={
                  <RotaProtegida permissao="usuarios.gerenciar">
                    <UsuariosPage />
                  </RotaProtegida>
                }
              />
              <Route
                path="duracoes"
                element={
                  <RotaProtegida permissao="duracoes.gerenciar">
                    <DuracoesPage />
                  </RotaProtegida>
                }
              />
              <Route
                path="disponibilidades"
                element={
                  <RotaProtegida permissao="disponibilidades.gerenciar">
                    <DisponibilidadesPage />
                  </RotaProtegida>
                }
              />
              <Route
                path="bloqueios"
                element={
                  <RotaProtegida permissao="bloqueios.gerenciar">
                    <BloqueiosPage />
                  </RotaProtegida>
                }
              />
              <Route
                path="agendamentos"
                element={
                  <RotaProtegida permissao="agendamentos.ver">
                    <AgendamentosPage />
                  </RotaProtegida>
                }
              />
              <Route
                path="avaliacoes"
                element={
                  <RotaProtegida permissao="avaliacoes.ver">
                    <AvaliacoesPage />
                  </RotaProtegida>
                }
              />
              <Route
                path="notificacoes"
                element={
                  <RotaProtegida permissao="notificacoes.ver">
                    <NotificacoesPage />
                  </RotaProtegida>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
