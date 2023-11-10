import {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import {Loader} from '../components/Loader';
import {MyContext} from '../context/PatientContext';
import LoginImage from '../assets/login-image.svg';

export const Login = () => {
  const [loginValues, setLoginValues] = useState({
    email: '',
    password: '',
  });
  const {
    errorMsgBack,
    setErrorMsgBack,
    errorMsgValidator,
    setErrorMsgValidator,
    loadingAuth,
    setLoadingAuth,
  } = useContext(MyContext);

  useEffect(() => {
    setErrorMsgBack('');
    setErrorMsgValidator('');
  }, []);

  //NAVIGATE & COOKIES
  const navigate = useNavigate();
  const [, setCookies] = useCookies(['access_token']);
  //HANDLERS
  const handleChange = (e) => {
    const {name, value} = e.target;
    setLoginValues({...loginValues, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingAuth(true);
    setErrorMsgBack('');
    setErrorMsgValidator('');
    try {
      const res = await axios.post(
        'http://localhost:4000/auth/login',
        loginValues
      );
      setCookies('access_token', res.data.token);
      window.localStorage.setItem('professionalID', res.data.professionalID);
      window.localStorage.setItem(
        'professionalName',
        res.data.professionalName
      );
      setLoadingAuth(false);
      navigate('/home');
    } catch (error) {
      setLoadingAuth(false);
      if (error.response.data.msg) {
        console.log(error.response.data.msg);
        setErrorMsgBack(error.response.data.msg);
      }
      if (error.response.data.errors[0].msg) {
        console.log(error.response.data.errors[0].msg);
        setErrorMsgValidator(error.response.data.errors[0].msg);
      }
    }
  };

  return (
    <div className="w-full h-screen m-auto bg-primary">
      <div className="flex justify-center items-center h-screen">
        <div className=" w-2/3 gap-10  flex justify-start items-center">
          <div className="w-1/2 flex justify-center items-center">
            <img src={LoginImage} alt="Login Image" className="w-full" />
          </div>
          <div className="w-1/2 h-full  font-PTSans">
            <h2 className="text-4xl text-center font-bold text-secondary">
              Login
            </h2>
            <p className="text-lg text-center font-bold text-secondary mt-2">
              Please enter your Email and your Password
            </p>

            <form
              className="w-2/3 m-auto flex flex-col justify-center items-center gap-5 mt-8"
              onSubmit={handleSubmit}
            >
              <input
                className="w-full rounded-lg h-11 bg-transparent border border-solid-white outline-none pl-3 font-PTSans text-secondary"
                type="email"
                name="email"
                value={loginValues.email}
                placeholder="Email"
                onChange={handleChange}
                autoComplete="off"
                autoFocus={true}
              />
              <input
                className="w-full rounded-lg h-11 bg-transparent border border-solid-white outline-none pl-3 font-PTSans text-secondary"
                type="password"
                name="password"
                value={loginValues.password}
                placeholder="Password"
                onChange={handleChange}
              />
              {loadingAuth ? (
                <Loader />
              ) : (
                <>
                  {errorMsgValidator && (
                    <p
                      className={`${
                        errorMsgValidator === '' ? 'hidden' : 'block'
                      } font-PTSans font-bold w-full bg-red-300 text-red-600 text-center`}
                    >
                      {errorMsgValidator}
                    </p>
                  )}
                  {errorMsgBack && (
                    <p className="font-PTSans font-bold w-full bg-red-300 text-red-600 text-center">
                      {errorMsgBack}
                    </p>
                  )}
                </>
              )}
              <button
                className="w-full rounded-lg h-11 bg-transparent border-2 border-secondary text-secondary shadow-lg hover:bg-secondary hover:text-primary hover:transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                type="submit"
                disabled={
                  loginValues.email === '' || loginValues.password === ''
                }
              >
                Login
              </button>
            </form>
            <p className="text-white text-center font-bold mt-2 text-sm">
              Not a member yet?{' '}
              <small className="font-PTSans italic text-tertiary text-sm hover:underline">
                <Link to={'/register'}>Register!</Link>
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
