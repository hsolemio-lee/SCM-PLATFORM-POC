import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SCMProvider } from './context/SCMContext';
import Header from './components/layout/Header';
import FloatingRunButton from './components/layout/FloatingRunButton';
import Dashboard from './pages/Dashboard';
import DemandPlanning from './pages/DemandPlanning';
import MasterPlanning from './pages/MasterPlanning';
import FactoryPlanning from './pages/FactoryPlanning';
import TransportPlanning from './pages/TransportPlanning';

function App() {
  return (
    <SCMProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-nexprime-darker">
          <Header />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dp" element={<DemandPlanning />} />
              <Route path="/mp" element={<MasterPlanning />} />
              <Route path="/fp" element={<FactoryPlanning />} />
              <Route path="/tp" element={<TransportPlanning />} />
            </Routes>
          </main>
          <FloatingRunButton />
        </div>
      </BrowserRouter>
    </SCMProvider>
  );
}

export default App;
