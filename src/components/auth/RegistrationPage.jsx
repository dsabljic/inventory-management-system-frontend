import React, { useState } from 'react';
import UserService from '../../service/UserService';
import { useNavigate, Link } from 'react-router-dom';

function RegistrationPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
        // role: 'USER',
        // verified: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await UserService.register(formData);
            setFormData({
                name: '',
                email: '',
                password: ''
                // role: 'USER',
                // verified: false
            });

            console.log(res);

            if (res.statusCode === 500) {
                alert('Unable to create an account');
            } else {                
                alert('Account created successfully');
                navigate('/login');
            }

        } catch (error) {
            console.error('Error registering user:', error);
            alert('An error occurred while creating an account');
        }
    };

    return (
        <div className="auth-container">
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <button type="submit">Sign up</button>
                <br />
                <div className="already-have-account">
                    Already have an account? <Link to="/login">Log in</Link>
                </div>
            </form>
        </div>
    );
}

export default RegistrationPage;