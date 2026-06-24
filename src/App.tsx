import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";
import AppRouter from "./routes/AppRouter";
import  useAuth  from "./hooks/useAuth";

function Layout() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <AppRouter />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;