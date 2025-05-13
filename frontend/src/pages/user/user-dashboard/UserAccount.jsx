import React, { useEffect, useState } from 'react';
import AppNavbar from '../../../components/Navbar'
import '../../../style/UserAccount.scss';
import {userDetails , updateUserProfile} from '../../../Services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import { decodedToken } from '../../../Services/getToken ';
import { triggerNotification } from '../../../Services/notificationService';

const UserAccount = () => {
  const [user, setUser] = useState({});
  const [editData, setEditData] = useState({});
  
  const decoded = decodedToken();
  const userId = decoded.userId 


  useEffect(() => {
    const fetchUser = async () => {
        try { 
          const res = await userDetails(userId); 
          console.log('User data:', res.existingClient[0].username);
          const userData = res.existingClient[0];  

        setUser(userData);
        setEditData({
            username: userData.username,
            mail: userData.mail,
            city: userData.city,
            phone_number: userData.phone_number,
        });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      fetchUser();
  }, [userId]);

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
            const response = await updateUserProfile(updatedFields, userId);
            console.log("update profile: ", response)
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


  return (
    <>
        <AppNavbar />
          <div className='profile-section'>
            <div className="user-profile">
                  <h2 className="profile-heading">Profile</h2>
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
                    <button onClick={handleSave} style={{marginTop:'35px'}}>Save Changes</button>
                  </div>
            </div>
          </div>
        </>
  );
};

export default UserAccount;
