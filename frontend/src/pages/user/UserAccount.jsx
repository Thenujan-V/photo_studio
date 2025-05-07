import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppNavbar from '../../components/Navbar'
import '../../style/UserAccount.scss';
import { retrieveId } from '../../Services/getToken ';
import {userDetails , updateUserProfile} from '../../Services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppFooter from '../../components/footer';

const UserAccount = () => {
  const [user, setUser] = useState({});
  const [editData, setEditData] = useState({});
  const [newEmail, setNewEmail] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const triggerNotification = (message, type = "info") => {
      if (type === "success") {
        toast.success(message,{
          autoClose: 3000,
        });
      } else if (type === "error") {
        toast.error(message);
      } else {
        toast(message);
      }
    };

  useEffect(() => {
    const decoded = retrieveId();
    const fetchUser = async () => {
        const decoded = retrieveId(); 
        try {
          const res = await userDetails(decoded.userId); 
          console.log('User data:', res.existingClient[0].username);
          const userData = res.existingClient[0];  

        setUser(userData);
        setEditData({
            username: userData.username,
            mail: userData.mail,
            city: userData.city,
            phone_number: userData.phone_number,
        });
          setOldEmail(userData.mail);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      fetchUser();
  }, []);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async() => {
    const updatedFields = {};

    if (editData.username !== user.username && editData.username !== '') updatedFields.username = editData.username;
    if (editData.city !== user.city && editData.city !== '') updatedFields.city = editData.city;
    if (editData.phone_number !== user.phone_number && editData.phone_number !== '') updatedFields.phone_number = editData.phone_number;

    if (Object.keys(updatedFields).length > 0) {
        try{
            const response = await updateUserProfile(updatedFields, retrieveId().userId);
            triggerNotification("Update Profile Success.", "success");
        }
        catch(err){
            const errorMsg = err.response?.data?.message || "Something went wrong while updating the profile.";
            triggerNotification(errorMsg, "error");
        }

    } else {
      triggerNotification("No changes made.", "error");
    }
  };

  const handleEmailChange = () => {
    axios.put('/api/user/1/change-email', { email: newEmail })
      .then(res => alert('Email changed successfully'));
  };

  const handlePasswordChange = () => {
    axios.put('/api/user/1/change-password', {
      oldPassword,
      newPassword
    }).then(res => alert('Password updated successfully'));
  };

  return (
    <>
        <AppNavbar />
        <h2 className="profile-heading">Profile</h2>
        <div className="user-profile">
        <div className="left">
            <FontAwesomeIcon icon={faUser} size="5x" color="#f90348" title="User Profile"/>
            <p>{editData.username}</p>
            <div className="user-fields">
            <label>Username:</label>
            <input name="username" value={editData.username || ''} onChange={handleChange} />
            <label>Email:</label>
            <input name="mail" value={editData.mail || ''} disabled />
            <label>City:</label>
            <input name="city" value={editData.city || ''} onChange={handleChange} />
            <label>Phone Number:</label>
            <input name="phone_number" value={editData.phone_number || ''} onChange={handleChange} />
            <button onClick={handleSave} style={{marginTop:'15px'}}>Save Changes</button>
            </div>
        </div>

        <div className="right">
            <div className="edit-section">
            <h3>Change Email</h3>
            <p>Old Email: {oldEmail}</p>
            <input type="email" placeholder="New Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <button onClick={handleEmailChange}>Change Email</button>
            </div>

            <div className="edit-section">
            <h3>Change Password</h3>
            <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <button onClick={handlePasswordChange}>Change Password</button>
            </div>
        </div>
        </div>
        <AppFooter />
        </>
  );
};

export default UserAccount;
