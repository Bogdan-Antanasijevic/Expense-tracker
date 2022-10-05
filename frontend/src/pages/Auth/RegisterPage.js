import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../services/authService';
import { showLoader } from '../../redux/loaderSlice'
import Loader from '../../components/loader/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './registerPage.scss'



function RegisterPage() {

  const [userData, setUserData] = useState({
    username: '',
    password: '',
    email: '',
  })
  const { username, password, email } = userData
  const [isFormValid, setIsFormValid] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const inputEl = useRef();




  const navigate = useNavigate();
  const dispatch = useDispatch();

  function backToLogin(e) {
    e.preventDefault()
    navigate('/')
  }

  const saveUserData = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  const showHidePass = (e) => {
    if (!isPasswordVisible) {
      setIsPasswordVisible(true)
      inputEl.current.type = 'password';
    }
    else {
      setIsPasswordVisible(false);
      inputEl.current.type = 'text';
    }
  }

  function saveNewUser(e) {
    e.preventDefault()

    if (!userData.username || !userData.password || !userData.email) {
      setIsFormValid(false)
      return
    }
    setIsFormValid(true)
    dispatch(showLoader(true))

    AuthService.register(userData)
      .then(res => {
        dispatch(showLoader(false))
        console.log('Succesfull register'); // new component
        toast.success('You successfully registered');
        e.target[0].value = '';
        e.target[1].value = '';
        e.target[2].value = '';
        setTimeout(() => {
          navigate('/')
        }, 5000);
        // console.log(res);
      })
      .catch(err => {
        console.log(err);
        toast.error(err.response.data)
        dispatch(showLoader(false))

      })

  }


  return (
    <div className='auth-wrapper'>
      <Loader />
      <h1>Register</h1>
      <form className='form-group' onSubmit={saveNewUser} >
        <label className='username-label' htmlFor='username'>Username</label>
        <input
          type='text'
          className='form-control'
          id='username'
          placeholder='Enter your username'
          value={username}
          onChange={saveUserData}
          name='username'
        />


        <label className='password-label' htmlFor='password'>Password</label>
        <div className='form-control password-input'>
          <input
            type='password'
            id='password'
            placeholder='Enter your password'
            value={password}
            onChange={saveUserData}
            name='password'
            ref={inputEl}
          />

          <label htmlFor='checkbox' className='checkbox-label' > {!isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            <input type='checkbox' id='checkbox' className='checkbox' onClick={showHidePass} />
          </label>
        </div>

        <label className='email-label' htmlFor='email'>Email</label>
        <input
          type='email'
          className='form-control'
          id='email'
          placeholder='Enter your email'
          value={email}
          onChange={saveUserData}
          name='email'
        />
        <input type='submit' className='form-control btn btn-dark' value='Register' />
        <input type='button' className='form-control btn btn-dark' onClick={backToLogin} value='Back to login' />
        {!isFormValid && <p style={{ color: 'red' }}>* All fields are required !!!</p>}
      </form>
      <ToastContainer />
    </div>

  )
}

export default RegisterPage