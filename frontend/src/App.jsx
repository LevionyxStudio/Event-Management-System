import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventList from './pages/EventList';
import EventCreate from './pages/EventCreate';
import EventDetail from './pages/EventDetail';
import EventManage from './pages/EventManage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import BookingStep from './pages/BookingFlow/BookingStep';
import PaymentStep from './pages/BookingFlow/PaymentStep';
import TicketView from './pages/BookingFlow/TicketView';
import Dashboard from './pages/Dashboard';
import MyTickets from './pages/MyTickets';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<EventList />} />
                <Route path="/events" element={<EventList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/events/:id" element={<EventDetail />} />
                
                {/* Booking Flow (Public for attendees) */}
                <Route path="/events/:id/book" element={<BookingStep />} />
                <Route path="/checkout" element={<PaymentStep />} />
                <Route path="/bookings/:id" element={<TicketView />} />
                
                {/* Protected Routes (For Organizers) */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/events/create" element={
                  <ProtectedRoute>
                    <EventCreate />
                  </ProtectedRoute>
                } />
                <Route path="/events/manage" element={
                  <ProtectedRoute>
                    <EventManage />
                  </ProtectedRoute>
                } />
                <Route path="/events/edit/:id" element={
                  <ProtectedRoute>
                    <EventCreate />
                  </ProtectedRoute>
                } />
                <Route path="/my-tickets" element={
                  <ProtectedRoute>
                    <MyTickets />
                  </ProtectedRoute>
                } />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
