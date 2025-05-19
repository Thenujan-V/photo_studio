import React from 'react'
import { useState } from 'react'
import '../style/Login.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faL } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {signinService} from '../Services/userService'
import { useNavigate } from 'react-router-dom';
import { adminSignin } from '../Services/adminService';
import { decodedToken } from '../Services/getToken ';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [mail, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState('')

  const navigate = useNavigate();

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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const validations = () => {
    const error = {}

    if (!mail.trim()) {
      error.mail = 'Email is required';
    } else if ( !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(mail)) {
      error.mail = 'Invalid email address';
    }
    if (!password.trim()) {
      error.password = 'Password is required';
    } else if(password.length < 4){
      error.password = "minimum length 4 letters"
    }
    setErrors(error)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    validations()

    try{
      const response = await signinService(mail, password)
        if(response == false){
          alert('username or password is not valid')
          setApiResponse('signin faild...!')

        }
        else{
          localStorage.setItem('authToken', response.token);
          setApiResponse("signin success")
          triggerNotification("you are login successfully", "success");
          const decoded = decodedToken()
            if(decoded.role === 'USER'){
              setTimeout(() => {
                navigate('/');
              }, 3000);
            }
            if(decoded.role === 'ADMIN'){
              setTimeout(() => {
                navigate('/adminDashboard');
              }, 3000);
            }
            
        }

    }
    catch(error){
      setApiResponse('signin faild...!')
      triggerNotification(error.response.data.message, "error");
      console.log('Error: ', error)
    }
  };
  return (
    <>
        <div className="container-fluid row m-0" id='signinPage'>
          <div className="col-xl-6 col-lg-6 col-md-6 col-12 p-0" id='img'></div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-12 p-0" id='form'>
            <h1>Login here</h1>
            <form onSubmit={handleSubmit} className=''>
              <div className="form-group">
                <input className="form-control" type="email" id='mail' placeholder='Example@gmail.com' value={mail} onChange={handleEmailChange} required />
                <p>{errors.mail}</p>
              </div>
              <div className="form-group mt-2">
                <input className="form-control" type="password" id='password' placeholder='Password' value={password} onChange={handlePasswordChange} />
                <p>{errors.password}</p>
              </div>
              <div className="form-group mt-1 pb-4" id='btnTag'>
                <a href="#">Forgot password?</a>
                <button className='mt-4' type="submit">Login</button>
              </div>
              <div className="form-group text-center mt-3" id='signup'>
                <Link to="/signup">Create your account here <FontAwesomeIcon icon={faArrowRight} /></Link>
              </div>
            </form>
          </div>
        </div>
    </>
  )
}

export default Login