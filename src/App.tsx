import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminRoute } from './components/auth/AdminRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { FavoritesProvider } from './context/FavoritesContext'
import { Home } from './pages/Home'
import { SearchResults } from './pages/SearchResults'
import { CarDetails } from './pages/CarDetails'
import { BookingRequest } from './pages/BookingRequest'
import { BookingSuccess } from './pages/BookingSuccess'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { Profile } from './pages/Profile'
import { MyBookings } from './pages/MyBookings'
import { MyFavorites } from './pages/MyFavorites'
import { Admin } from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route path="/booking/:carId" element={<BookingRequest />} />
        <Route path="/booking/success" element={<BookingSuccess />} />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <MyFavorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  )
}

export default App
