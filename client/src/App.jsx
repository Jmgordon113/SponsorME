import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// import ToastContainer from './components/ToastContainer'; // disable this temporarily
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import SponsorDashboard from './pages/SponsorDashboard';
import SponseeDashboard from './pages/SponseeDashboard';
import OpportunityFeed from './pages/OpportunityFeed';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Account from './pages/Account';
// import 'react-toastify/dist/ReactToastify.css'; // disable this temporarily
import CreateOpportunity from './pages/CreateOpportunity';
import EditOpportunity from './pages/EditOpportunity';
import OpportunityDetail from './pages/OpportunityDetail';
import AddOpportunity from './pages/AddOpportunity';
import PostOpportunity from './pages/PostOpportunity';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard-sponsor" element={<SponsorDashboard />} />
        <Route path="/dashboard-sponsee" element={<SponseeDashboard />} />
        <Route path="/feed" element={<OpportunityFeed />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/account" element={<Account />} />
        <Route path="/create" element={<CreateOpportunity />} />
        <Route path="/opportunity/edit/:id" element={<EditOpportunity />} />
        <Route path="/opportunity/:id" element={<OpportunityDetail />} />
        <Route path="/add-opportunity" element={<AddOpportunity />} />
        <Route path="/post-opportunity" element={<PostOpportunity />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
      {/* <ToastContainer /> */}
    </Router>
  );
}

export default App;
