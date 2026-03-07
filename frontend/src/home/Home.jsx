import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../authentication/Login';
import Register from '../authentication/Register';
import Layout from '../components/layout/Layout';
import Dashboard from '../components/Dashboard';
import TabPanel from '../userDetails/TabPanel';
import Contribution from '../addContribution/Contribution';
import Investment from '../addInvestment/Investment';
import { useEffect } from 'react';
import ProtectedRoute from '../protectedRoute/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { fetchContributedUsers, fetchMandalMembers, fetchUserContribution, fetchUserInvestmentRequests, setRole, setLoggedInUserId} from '../redux/slice/slice';
import ComingSoonCard from '../comingSoonCard/ComingSoonCard';
import Members from '../memberDetails/Members';
import { apiEndPointConstants } from '../axios/endpoint';
import RequestDashboard from '../recentUpdates/RequestDashboard';
import EventCalendar from '../events-calendar/EventCalendar';
import { getCall } from '../axios/apis';
import Chatbot from '../chatDialog/Chatbot';
import Profile from '../Profile';
import ResetPassword from '../authentication/ResetPassword';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const Home = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch()
  const [loggedInUserFullName, setLoggedInUserFullName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  async function authCheck() {
    try {
      const response = await getCall(apiEndPointConstants.AUTH_CHECK_ENDPOINT);
      setLoggedInUserFullName(response?.data?.fullName)
      setProfileImage(response?.data?.profile ? `${VITE_BACKEND_URL}/${response.data.profile}` : "")
      setIsAuthenticated(response?.data?.isAuthenticated)
      dispatch(setRole(response?.data?.role))
      dispatch(setLoggedInUserId(response?.data?.userId))
    } catch (error) {
      setIsAuthenticated(false)
      console.log("Error : ", error?.message)
      
    }
  }
  useEffect(() => {
    authCheck();
  }, [])
  useEffect(() => {
    if(isAuthenticated) {
      setLoader(true)
      dispatch(fetchUserContribution(apiEndPointConstants.FETCH_CONTRIBUTION_REQUESTS))
      dispatch(fetchUserInvestmentRequests(apiEndPointConstants.FETCH_INVESTMENT_REQUESTS))
      dispatch(fetchMandalMembers(apiEndPointConstants.GET_MEMBERS_ENDPOINT))
      dispatch(fetchContributedUsers(apiEndPointConstants.FETCH_CONTRIBUTED_USERS))
      authCheck();
      setLoader(false)
    }
  }, [isAuthenticated])

  console.log("profileImage : ", profileImage)
  const AppRoutes = ({fullName}) => (
    <Layout name={fullName} profileImage={profileImage}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard loader={loader}/>} />
        <Route path="/user-details" element={<Members />} />
        <Route path="/analytics" element={<ComingSoonCard year="2025" name="Analytics"/>} /> 
        <Route path="/events" element={<EventCalendar/>} />
        <Route path="/contributions" element={<TabPanel />} />
        <Route element={<ProtectedRoute allowedRoles={["Admin", "Treasurer"]} />}>
          <Route path="/add-contribution" element={<Suspense fallback={<div>Loading...</div>}>
            <Contribution />
          </Suspense>} />
          <Route path="/add-investment" element={<Investment />} />
        </Route>
        <Route path="/recent-requests" element={<RequestDashboard/>} />
        <Route path="/add-member" element={<Register onRegister={setIsAuthenticated}/>} />
        <Route path="/myprofile" element={<Profile/>} />
        <Route path="/settings" element={<ComingSoonCard year="Current" name=" Settings"/>} />
        <Route path="*" element={<Navigate to="/dashboard" replace={isAuthenticated ? "/dashboard" : "/login"} />} />
        
      </Routes>
      <Chatbot/>
    </Layout>
  );

  const AuthRoutes = (  ) => (
    <Routes>
      <Route 
        path="/login" 
        element={
          <Login onLogin={setIsAuthenticated}/>
        } 
      />
      <Route 
        path="/reset-password" 
        element={
          <ResetPassword/>
        } 
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
  
  return (
    <Router>
      {isAuthenticated ? <AppRoutes fullName={loggedInUserFullName}/> : <AuthRoutes />}
    </Router>
  );
};

export default Home;