import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicRequest, setAuthToken, removeAuthToken, setUserInfo, removeUserInfo } from '../../hooks/requestMethods';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] p-4">
            <div className="w-full max-w-[450px] p-8 rounded-2xl bg-white shadow-xl animate-fadeIn">
                <div className="text-[2rem] font-extrabold text-primary-color mb-4 text-center">SocialApp</div>
                <div className="text-base text-center mb-8 text-text-secondary">
                    Create an account to connect with friends.
                </div>

                {error && <div className="text-danger-color text-center mb-4 text-sm bg-[rgba(255,51,51,0.1)] py-2 px-4 rounded-lg animate-shake">{error}</div>}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex gap-4 md:flex-row flex-col">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="py-3.5 px-4 rounded-lg border border-divider-color text-base outline-none transition-all focus:border-primary-color focus:shadow-[0_0_0_2px_rgba(24,119,242,0.2)]"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            aria-label="First Name"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="py-3.5 px-4 rounded-lg border border-divider-color text-base outline-none transition-all focus:border-primary-color focus:shadow-[0_0_0_2px_rgba(24,119,242,0.2)]"
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
                        className="py-3.5 px-4 rounded-lg border border-divider-color text-base outline-none transition-all focus:border-primary-color focus:shadow-[0_0_0_2px_rgba(24,119,242,0.2)]"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        aria-label="Username"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="py-3.5 px-4 rounded-lg border border-divider-color text-base outline-none transition-all focus:border-primary-color focus:shadow-[0_0_0_2px_rgba(24,119,242,0.2)]"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        aria-label="Email"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="py-3.5 px-4 rounded-lg border border-divider-color text-base outline-none transition-all focus:border-primary-color focus:shadow-[0_0_0_2px_rgba(24,119,242,0.2)]"
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
                        className="py-3.5 px-4 rounded-lg border border-divider-color text-base outline-none transition-all focus:border-primary-color focus:shadow-[0_0_0_2px_rgba(24,119,242,0.2)]"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                        aria-label="Confirm Password"
                    />
                    <button
                        className="py-3 px-4 border-none rounded-lg bg-secondary-color text-white text-lg font-semibold cursor-pointer transition-colors mt-4 hover:bg-secondary-hover disabled:bg-opacity-40 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isLoading || Object.values(formData).some(value => !value)}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block w-[18px] h-[18px] border-3 border-[rgba(255,255,255,0.3)] rounded-full border-t-white animate-spin mr-2 align-middle"></span>
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <div className="text-center text-primary-color cursor-pointer mt-6 mb-0 text-base hover:underline" 
                     onClick={() => navigate('/login')}>
                    Already have an account? Log In
                </div>
            </div>
        </div>
    );
}
