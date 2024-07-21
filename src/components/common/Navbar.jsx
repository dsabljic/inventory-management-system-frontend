import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../service/UserService';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmDelete = window.confirm('Are you sure you want to logout?');
    if (confirmDelete) {
      UserService.logout();
      navigate('/login');
    }
  };

  return (
    <nav>
      <ul>
        {UserService.isAuthenticated() && !UserService.isPendingUser() ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            {UserService.isAdmin() && <li><Link to="/users">Users</Link></li>}
            {UserService.isAdmin() && <li><Link to="/item-types">Item types</Link></li>}
            {UserService.isAdmin() ? <li><Link to="/items">Items</Link></li> : <li><Link to="/all-items">All items</Link></li>}
            {UserService.isAdmin() ? <li><Link to="/admin/requests">Requests</Link></li> : <li><Link to="/user/requests">My requests</Link></li>}
            {<li><Link to="/rooms">Rooms</Link></li>}
            {UserService.isAdmin() ? <li><Link to="/admin/reservations">Reservations</Link></li> : <li><Link to="/user/reservations">My reservations</Link></li>}
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;