import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home } from './Screens/Home';
import { LineDetails } from './Screens/LineDetails';
import './App.css';

// Redireciona para a Home ('/') EXATAMENTE UMA VEZ ao carregar/recarregar a aplicação no navegador
const ResetOnRefresh: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== '/') {
            navigate('/', { replace: true });
        }
    }, []); // [] garante execução somente no carregamento inicial da página (F5)

    return null;
};

function App() {
  return (
    <BrowserRouter>
      <ResetOnRefresh />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/linha/:cdLinha" element={<LineDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
