import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import BrowseDogs from './pages/BrowseDogs';
import { ShowMatch } from './pages/ShowMatch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dogs" element={<BrowseDogs />} />
        <Route path="/match" element={<ShowMatch />} />

      </Routes>
    </Router>
  );
}

export default App;