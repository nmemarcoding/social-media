import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicRequest, setAuthToken, removeAuthToken, setUserInfo, removeUserInfo } from '../../hooks/requestMethods';
import './signUp.css';

export default function SignUp() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const res = await publicRequest().post('/users/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            // Log the response for debugging
            console.log('Response headers:', res.headers);
            console.log('Response data:', res.data);

            // Check if token is in the response data or headers
            const token = res.headers['x-auth-token'] || 
                          res.data.token || 
                          res.data.accessToken;

            if (token) {
                // Store the token and user data but still navigate to login page
                // as this is registration flow
                setAuthToken(token);
                if (res.data && res.data.id) {
                    setUserInfo(res.data);
                }
                navigate('/login');
            } else if (res.data && res.data.id) {
                // If we have user data but no token, still proceed
                setUserInfo(res.data);
                navigate('/login');
            } else {
                setError('Registration successful but no token received');
                // Still navigate to login as the registration was successful
                setTimeout(() => navigate('/login'), 1500);
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Something went wrong');
            removeAuthToken(); // Clear any existing token on error
            removeUserInfo(); // Clear any existing user info on error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup">
            <div className="signupWrapper">
                <div className="signupLogo">SocialApp</div>
                <div className="signupDesc">
                    Create an account to connect with friends.
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="signupForm" onSubmit={handleSubmit}>
                    <div className="nameInputs">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="signupInput"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            aria-label="First Name"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="signupInput"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            aria-label="Last Name"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        className="signupInput"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        aria-label="Username"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="signupInput"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        aria-label="Email"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="signupInput"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                        aria-label="Password"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="signupInput"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                        aria-label="Confirm Password"
                    />
                    <button
                        className="signupButton"
                        type="submit"
                        disabled={isLoading || Object.values(formData).some(value => !value)}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="button-spinner"></span>
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <div className="loginLink" onClick={() => navigate('/login')}>
                    Already have an account? Log In
                </div>
            </div>
        </div>
    );
}
