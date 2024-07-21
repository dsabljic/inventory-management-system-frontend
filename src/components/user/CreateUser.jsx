import React, { useState } from 'react';
import UserService from '../../service/UserService';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await UserService.createUser(formData, token);

            setFormData({
                name: '',
                email: '',
                password: '',
                role: ''
            });

            console.log(res);
            if (res.statusCode === 200) {
                alert('Account created successfully');
                navigate('/users');
            }
            else if (res.statusCode === 500) {
                alert('Unable to create an account');
            }

        } catch (error) {
            console.error('Error creating user profile:', error);
            alert('An error occurred while creating an account');
        }
    };

    return (
        <div className="auth-container">
            <h2>Add a new user</h2>
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
                <div className="form-group">
                    <label>Role:</label>
                    <select name="role" value={formData.role} onChange={handleInputChange} required>
                        <option value="">Select role</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                    </select>
                </div>
                <button type="submit">Add user</button>
            </form>
        </div>
    );
}

export default CreateUser;