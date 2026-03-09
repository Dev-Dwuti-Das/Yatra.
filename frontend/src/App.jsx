import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ListingsPage from './pages/ListingsPage';
import CreateListingPage from './pages/CreateListingPage';
import ListingDetailsPage from './pages/ListingDetailsPage';

function App() {
  return (
    <div className="lux-root min-h-screen">
      <div className="lux-shell mx-auto max-w-[1240px] px-4 pb-12 pt-6 md:px-6">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/listings" replace />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetailsPage />} />
            <Route
              path="/create-listing"
              element={
                <ProtectedRoute>
                  <CreateListingPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/listings" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
