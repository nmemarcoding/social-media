import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuthToken } from './hooks/requestMethods';
import Login from './pages/login/login';
import SignUp from './pages/signUp/signUp';
import Profile from './pages/profile/profile'; 
import FindFriends from './pages/findFriend/findFriends';
import HomePage from './pages/homePage/homePage';
import MessageListPage from './pages/messageListPage/messageListPage';
import Navbar from './pages/compomemts/Navbar';
import ConversationDetail from './pages/conversation/ConversationDetail';
import './App.css';

// Loading component
const LoadingScreen = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);;

// Protected Route component with Navbar integration
const ProtectedRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const token = getAuthToken();
        setIsAuth(!!token);
        setIsChecking(false);
    }, []);

    if (isChecking) {
        return <LoadingScreen />;
    }

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    // Return the children wrapped with Navbar for authenticated routes
    return ( (
        <>
            <Navbar />
            {/* Add top padding to account for fixed navbar height */}
            <div className="pt-14 md:pt-16">
                {children}
            </div>
        </> 
    ));
};

// Auth Route component (for login/register)
const AuthRoute = ({ children }) => {
    const isAuthenticated = !!getAuthToken();
    
    if (isAuthenticated) {
        return <Navigate to="/" />;
    }
    
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute> 
                    } 
                />
                
                {/* Profile routes */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }  
                />
                <Route
                    path="/profile/:username"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }  
                />/>
                
                {/* Find Friends route */}
                <Route
                    path="/find-friends"
                    element={
                        <ProtectedRoute>
                            <FindFriends />
                        </ProtectedRoute>
                    } 
                />/>
                
                <Route
                    path="/login" 
                    element={
                        <AuthRoute>
                            <Login />
                        </AuthRoute>
                    } 
                />
                <Route 
                    path="/register" 
                    element={
                        <AuthRoute>
                            <SignUp />
                        </AuthRoute>
                    } 
                />

                <Route
                    path="/messages"
                    element={
                        <ProtectedRoute>
                            <MessageListPage />
                        </ProtectedRoute>
                    }
                />
                {/* Individual conversation route */}
                <Route
                    path="/messages/:conversationId"
                    element={
                        <ProtectedRoute>
                            <ConversationDetail />
                        </ProtectedRoute>
                    }
                />
                
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;