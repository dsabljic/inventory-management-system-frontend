import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import UserService from "../../service/UserService";

function LoginPage(){
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const userData = await UserService.login(email, password)
        console.log(userData)
        if (userData.token) {
            localStorage.setItem('token', userData.token)
            localStorage.setItem('role', userData.role)
            localStorage.setItem('pendingUser', userData.pendingUser)
            localStorage.setItem('verified', userData.verified)
            // localStorage.setItem('refreshToken', userData.refreshToken)
            console.log(localStorage.getItem('verified'))
            if (userData.role === 'ADMIN')
                navigate('/items')
            else if (userData.role === 'USER')
                navigate('/all-items')
            else if (userData.role === 'PENDING_USER')
                navigate('/verification-page')
        } else {
            setError(userData.message)
        }
        
    } catch (error) {
        console.log(error)
        setError(error.message)
        setTimeout(() => {
            setError('');
        }, 5000);
    }
}

    return(
        <div className="auth-container">
            <h2>Log in</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email: </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Log in</button>
                <br />
                <div className="already-have-account">
                    <Link to="/forgot-password">Forgot your password?</Link>
                </div>
                <div className="already-have-account">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </div>
            </form>
        </div>
    )

}

export default LoginPage;