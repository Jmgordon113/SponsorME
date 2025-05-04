import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import DashboardSponsor from './pages/DashboardSponsor';
import DashboardSponsee from './pages/DashboardSponsee';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Account from './pages/Account';
import OpportunityDetails from './pages/OpportunityDetails';
import CreateOpportunity from './pages/CreateOpportunity';
import EditOpportunity from './pages/EditOpportunity';

const App: React.FC = () => {
  const getDashboardRoute = () => {
    const token = localStorage.getItem('token');
    if (!token) return '/login';

    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.role === 'sponsee' ? '/dashboard-sponsee' : '/dashboard-sponsor';
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard-sponsor" element={<DashboardSponsor />} />
        <Route path="/dashboard-sponsee" element={<DashboardSponsee />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/account" element={<Account />} />
        <Route path="/opportunity/:id" element={<OpportunityDetails />} />
        <Route path="/create" element={<CreateOpportunity />} />
        <Route path="/opportunity/edit/:id" element={<EditOpportunity />} />
        <Route path="/dashboard" element={<Navigate to={getDashboardRoute()} />} />
      </Routes>
    </Router>
  );
};

export default App;