import React, { useState } from 'react'
import {signupService} from '../Services/userService'
import { Link, useNavigate } from 'react-router-dom'
import '../style/SignUp.scss';

const SignUp = () => {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    if (formData.first_name && !formData.first_name.length < 4) {
      errors.first_name = 'First name must be atleast 4 characters';
    }
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if ( /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setErrors(errors);
    // api call throw signup service function
    // try{
    //   if(Object.keys(errors).length === 0){
    //     const response = await signupService(formData)
    //   setApiResponse('signup successfully...!')
    //     navigate('/signin')
    //   }
    //   else{
    //     alert('Give correct details')
    //   }
      
    // }
    // catch(error){
    //   setApiResponse('Sign up failed.');
    //   console.log('Response : ',error.response.data)
    //   if(error.response.data == 'exsisting email'){
    //     alert('email is already used please use different email')
    //   }
    //   console.error('Error:', error);
    // }


  };
  return (
    <>
      <div className="row m-0" id='signupPage'>
          <div className="col-xl-6 col-lg-6  col-12 p-0" id='img'></div>
          <div className="col-xl-6 col-lg-6  col-12 p-0" id='form'>
            <h1>Signup here</h1>
            <form onSubmit={handleSubmit} className=''>
                <div className="form-group">
                  {/* <label htmlFor="first_name" className="form-label">First Name</label> */}
                  <input className="form-control" type="text" id='first_name' name='first_name' placeholder='First Name' value={formData.first_name} onChange={handleChange}   />
                  <p>{errors.first_name}</p>
                </div>
                <div className="form-group">
                  {/* <label htmlFor="last_name" className="form-label">Last Name</label> */}
                  <input className="form-control" type="text" id='last_name' name='last_name' placeholder='Last Name' value={formData.last_name} onChange={handleChange} />
                  <p>{errors.last_name}</p>
                </div>
              <div className="form-group">
                {/* <label htmlFor="email" className="form-label">Email</label> */}
                <input className="form-control" type="email" id='email' name='email' placeholder='Example@gmail.com' value={formData.email} onChange={handleChange}  />
                <p>{errors.email}</p>
              </div>
              <div className="form-group">
                {/* <label htmlFor="password" className="form-label">Password</label> */}
                <input className="form-control" type="password" id='password' name='password' placeholder='password' value={formData.password} onChange={handleChange} />
                <p>{errors.password}</p>
              </div>
              <div className="form-group">
                {/* <label htmlFor="confirmPassword" className="form-label">Confirm Password</label> */}
                <input className="form-control" type="password" id='confirmPassword' name='confirmPassword' placeholder='Re-Enter Paswword' value={formData.confirmPassword} onChange={handleChange}/>
                <p>{errors.confirmPassword}</p>
              </div>
              <div className="form-group mt-1 pb-4" id='btnTag'>
                <button className='mt-3' type="submit">SignUp</button>
              </div>
              <Link to='/login' className='link' >Already have an account?</Link>
            </form>
            
          </div>
        </div>
    </>
  )
}

export default SignUp