import React, { useState } from 'react'
import {signupService} from '../Services/userService'
import { Link, useNavigate } from 'react-router-dom'
import '../style/SignUp.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    mail: '',
    phone_number: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState('');

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.username?.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.mail?.trim()) {
      errors.mail = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.mail)) {
      errors.mail = 'Invalid email address';
    }

    if (!formData.phone_number?.trim()) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      errors.phone_number = 'Invalid phone number (must be 10 digits)';
    }

    if (!formData.city?.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.password?.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const { username, mail, phone_number, city, password } = formData;
        const payload = {
          username,
          mail: mail,
          phone_number,
          city,
          password
        };
        console.log("payload: ",payload);
        await signupService(payload);
        triggerNotification("Signup Successful", "success");
        // setApiResponse('Signup successful!');
        setTimeout(() => {
          navigate('/login');
        }, 3000); 
      } catch (error) {
        setApiResponse('Sign up failed.');
        if (error.response?.data.message) {
          const errorMessage =
            error.response?.data?.message || 'Something went wrong. Please try again.';
            triggerNotification(errorMessage, "error");
        }
        console.error('Error:', error.response.data.message);
      }
    }
  };

  return (
    <>
      <div className="row m-0" id='signupPage'>
          <div className="col-xl-6 col-lg-6  col-12 p-0" id='img'></div>
          <div className="col-xl-6 col-lg-6  col-12 p-0" id='form'>
            <h1>Signup here</h1>
            <form onSubmit={handleSubmit} className=''>
              <div className="form-group">
                <input className="form-control" type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                <p>{errors.username}</p>
              </div>
              <div className="form-group">
                <input className="form-control" type="email" name="mail" placeholder="Example@gmail.com" value={formData.mail} onChange={handleChange} />
                <p>{errors.mail}</p>
              </div>
              <div className="form-group">
                <input className="form-control" type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
                <p>{errors.phone_number}</p>
              </div>
              <div className="form-group">
                <input className="form-control" type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                <p>{errors.city}</p>
              </div>
              <div className="form-group">
                <input className="form-control" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                <p>{errors.password}</p>
              </div>
              <div className="form-group">
                <input className="form-control" type="password" name="confirmPassword" placeholder="Re-Enter Password" value={formData.confirmPassword} onChange={handleChange} />
                <p>{errors.confirmPassword}</p>
              </div>
              <div className="form-group mt-1 pb-4" id="btnTag">
                <button className="mt-3" type="submit">SignUp</button>
              </div>
              <Link to='/login' className='link' >Already have an account?</Link>
            </form>
          </div>
      </div>
    </>
  )
}

export default SignUp