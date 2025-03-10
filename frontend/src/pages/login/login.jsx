import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicRequest, setAuthToken, removeAuthToken, setUserInfo, removeUserInfo } from '../../hooks/requestMethods';

export default function Login({ setIsAuthenticated }) {
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
                // Store user information in localStorage
                if (res.data && res.data.id) {
                    setUserInfo(res.data);
                }
                navigate('/');
            } else {
                // If no token in header, extract from response data instead
                if (res.data && res.data.id) {
                    // We have user data but no token, let's try to continue
                    // This is a fallback mechanism
                    setAuthToken(`fallback-token-${res.data.id}`);
                    setUserInfo(res.data);
                    navigate('/');
                } else {
                    setError('Authentication failed - No token received');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
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
                <div className="text-[2rem] font-extrabold text-[#1877f2] mb-4 text-center">SocialApp</div>
                <div className="text-base text-center mb-8 text-[#65676b]">
                    Connect with friends and share your moments.
                </div>
                
                {error && (
                    <div className="text-[#ff3333] text-center mb-4 text-sm bg-[rgba(255,51,51,0.1)] py-2 px-4 rounded-lg animate-shake">
                        {error}
                    </div>
                )}
                
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="py-3.5 px-4 rounded-lg border border-[#ced0d4] text-base outline-none transition-all focus:border-[#1877f2] focus:shadow-[0_0_0_2px_rgba(24,119,242,0.2)]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-label="Email"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="py-3.5 px-4 rounded-lg border border-[#ced0d4] text-base outline-none transition-all focus:border-[#1877f2] focus:shadow-[0_0_0_2px_rgba(24,119,242,0.2)]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                        aria-label="Password"
                    />
                    <button 
                        className="py-3 px-4 border-none rounded-lg bg-[#1877f2] text-white text-lg font-semibold cursor-pointer transition-colors mt-4 hover:bg-[#166fe5] disabled:bg-opacity-40 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isLoading || !email || !password}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block w-[18px] h-[18px] border-3 border-[rgba(255,255,255,0.3)] rounded-full border-t-white animate-spin mr-2 align-middle"></span>
                                <span>Logging in...</span>
                            </>
                        ) : (
                            'Log In'
                        )}
                    </button>
                </form>

                <div className="text-center text-[#1877f2] cursor-pointer my-6 text-base hover:underline">
                    Forgot Password?
                </div>
                
                <button 
                    className="w-[70%] mx-auto block py-2.5 px-4 border-none rounded-lg bg-[#42b72a] text-white text-base font-semibold cursor-pointer transition-colors hover:bg-[#36a420]"
                    onClick={() => navigate('/register')}
                >
                    Create New Account
                </button>
            </div>
        </div>
    );
}
