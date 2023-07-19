import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import {RiLogoutBoxRLine} from 'react-icons/ri';

export const Topbar = () => {
  const professionalName = window.localStorage.getItem('professionalName');
  const [, , removeCookie] = useCookies(['access_token']);
  const navigate = useNavigate();

  const logout = () => {
    removeCookie('access_token');
    window.localStorage.removeItem('professionalID');
    window.localStorage.removeItem('professionalName');
    navigate('/');
  };

  return (
    <div className="w-full h-16 shadow-md flex justify-end items-center px-8">
      <p className="font-PTSans font-bold text-primary mr-5">
        <span className="underline mr-1">Professional:</span> {professionalName}
      </p>
      <small title="Logout" onClick={() => logout()}>
        <RiLogoutBoxRLine className="w-7 h-7 text-primary hover:text-tertiary hover:cursor-pointer" />
      </small>
    </div>
  );
};
