import React, { useState, useEffect } from 'react';
import UserService from '../../service/UserService';
import { Link } from 'react-router-dom';

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {

            const token = localStorage.getItem('token');
            const response = await UserService.getProfile(token);
            setProfileInfo(response.user);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    return (
        <div className="profile-page-container">
            <h2>Profile Information</h2>
            <p>Name: {profileInfo.name}</p>
            <p>Email: {profileInfo.email}</p>
            <p>Role: {profileInfo.role}</p>
            {profileInfo.role === "ADMIN" && (
                <button><Link to={`/admin/profile/${profileInfo.id}`}>Update profile</Link></button>
            )}
            {profileInfo.role === "USER" && (
                <button><Link to={`/profile`}>Reset password</Link></button>
            )}
        </div>
    );
}

export default ProfilePage;