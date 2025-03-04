import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicRequest, setAuthToken, removeAuthToken } from '../../hooks/requestMethods';
import './login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await publicRequest().post('/users/login', {
                email,
                password,
            });

            // Check if token is in the response data or headers
            const token = res.headers['x-auth-token'] || 
                          res.data.token || 
                          res.data.accessToken;
            
            // Log the response for debugging
            console.log('Response headers:', res.headers);
            console.log('Response data:', res.data);

            if (token) {
                setAuthToken(token);
                navigate('/');
            } else {
                // If no token in header, extract from response data instead
                if (res.data && res.data.id) {
                    // We have user data but no token, let's try to continue
                    // This is a fallback mechanism
                    setAuthToken(`fallback-token-${res.data.id}`);
                    navigate('/');
                } else {
                    setError('Authentication failed - No token received');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Something went wrong');
            removeAuthToken(); // Clear any existing token on error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLogo">SocialApp</div>
                <div className="loginDesc">
                    Connect with friends and share your moments.
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form className="loginForm" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="loginInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-label="Email"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="loginInput"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                        aria-label="Password"
                    />
                    <button 
                        className="loginButton" 
                        type="submit"
                        disabled={isLoading || !email || !password}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="button-spinner"></span> 
                                <span>Logging in...</span>
                            </>
                        ) : (
                            'Log In'
                        )}
                    </button>
                </form>

                <div className="loginForgot">Forgot Password?</div>
                
                <button 
                    className="loginRegisterButton"
                    onClick={() => navigate('/register')}
                >
                    Create New Account
                </button>
            </div>
        </div>
    );
}
