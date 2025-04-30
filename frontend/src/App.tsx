import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import OpportunityDetails from './pages/OpportunityDetails'; // Import OpportunityDetails

function App() {
  return (
    <>
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
          <Route path="/opportunities/:id" element={<OpportunityDetails />} /> {/* Add this route */}
        </Routes>
      </Router>
    </>
  );
}

export default App;