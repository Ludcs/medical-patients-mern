import {Link, NavLink} from 'react-router-dom';
import {
  BsFillPersonLinesFill,
  BsFillPersonBadgeFill,
  BsFillPersonPlusFill,
} from 'react-icons/bs';

export const Sidebar = () => {
  return (
    <div className="bg-primary min-w-max min-h-screen h-auto text-secondary font-PTSans">
      <div className="mt-11 w-full px-8 font-PTSans text-center">
        <h1 className="tracking-wide text-2xl my-9 font-bold">Actions</h1>
        <hr />
        <ul className="text-start text-xl">
          <NavLink
            to="/home"
            className={({isActive}) =>
              isActive ? 'text-tertiary' : 'text-secondary'
            }
          >
            <li className="my-5 flex justify-start items-center w-full hover:text-tertiary hover: transition-colors">
              {' '}
              <span className="flex items-center">
                <BsFillPersonLinesFill className="w-8 h-w-8" />
              </span>
              <p className="pl-2">All patients</p>
            </li>
          </NavLink>
          <hr />
          <NavLink
            to="/urgentPatients"
            className={({isActive}) =>
              isActive ? 'text-tertiary' : 'text-secondary'
            }
          >
            <li className="my-5 flex justify-start items-center hover:text-tertiary hover: transition-colors">
              {' '}
              <span className="flex items-center">
                <BsFillPersonBadgeFill className="w-8 h-w-8" />
              </span>
              <p className="pl-2">Urgent patients</p>
            </li>
          </NavLink>
          <hr />
          <NavLink
            to="/registerNewPatient"
            className={({isActive}) =>
              isActive ? 'text-tertiary' : 'text-secondary'
            }
          >
            <li className="my-5 flex justify-start items-center hover:text-tertiary hover: transition-colors">
              {' '}
              <span className="flex items-center">
                <BsFillPersonPlusFill className="w-8 h-w-8" />
              </span>
              <p className="pl-2">Register new patient</p>
            </li>
          </NavLink>
        </ul>
      </div>
    </div>
  );
};
