import {useContext, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Sidebar} from '../components/Sidebar';
import {Topbar} from '../components/Topbar';
import {MyContext} from '../context/PatientContext';
import {Loader} from '../components/Loader';
import {useCookies} from 'react-cookie';

export const RegisterNewPatients = () => {
  const professionalID = window.localStorage.getItem('professionalID');
  const [cookies] = useCookies(['access_token']);
  const {loadingRegisterPatient, setLoadingRegisterPatient} =
    useContext(MyContext);

  const params = useParams();
  const patientID = params.id;
  const getPatientById = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/patients/${professionalID}/${patientID}`
      );

      setNewPatient(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (patientID) {
      getPatientById();
    }
  }, []);

  const [newPatient, setNewPatient] = useState({
    name: '',
    lastName: '',
    age: 0,
    weight: 0,
    height: 0,
    diagnostic: '',
    symptoms: [],
    image: '',
    professionalID: professionalID,
  });

  const createNewPatient = async () => {
    setLoadingRegisterPatient(true);
    const form = new FormData();

    for (let key in newPatient) {
      form.append(key, newPatient[key]);
    }

    try {
      const res = await axios.post(
        'http://localhost:4000/patients/registerPatient',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: cookies.access_token,
          },
        }
      );
      setLoadingRegisterPatient(false);
      //console.log(res.data);
      toast.success(res.data.msg, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setNewPatient({
        name: '',
        lastName: '',
        age: 0,
        weight: 0,
        height: 0,
        diagnostic: '',
        symptoms: [],
        image: '',
        professionalID: professionalID,
      });
    } catch (error) {
      setLoadingRegisterPatient(false);
      toast.error(error);
    }
  };

  const updatePatient = async () => {
    setLoadingRegisterPatient(true);

    try {
      const res = await axios.put(
        `http://localhost:4000/patients/update/${professionalID}/${patientID}`,
        newPatient
      );
      setLoadingRegisterPatient(false);
      toast.success('The patient was successfully updated', {
        position: toast.POSITION.TOP_RIGHT,
      });

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setNewPatient({
      ...newPatient,
      [name]: value,
    });
  };

  const handleSymptomChange = (e, index) => {
    const {value} = e.target;
    // console.log({value});
    // console.log({index});
    const symptomsCopy = newPatient.symptoms;
    symptomsCopy[index] = value;
    setNewPatient({
      ...newPatient,
      symptoms: symptomsCopy,
    });
  };

  const addSymptoms = () => {
    setNewPatient({
      ...newPatient,
      symptoms: [...newPatient.symptoms, ''],
    });
  };

  const handleSubmit = async (e) => {
    //console.log(newPatient);
    e.preventDefault();
    if (patientID) {
      updatePatient();
    } else {
      createNewPatient();
    }
  };

  const isDisabled = () => {
    if (
      newPatient.name === '' ||
      newPatient.lastName === '' ||
      newPatient.age === 0 ||
      newPatient.weight === 0 ||
      newPatient.height === 0 ||
      loadingRegisterPatient === true
    )
      return true;
  };

  return (
    <div className="w-full h-screen m-auto bg-[#F1F5F9] flex">
      <Sidebar />
      {/* CONTAINER FORM REGISTER PATIENT PAGE */}
      <div className="w-full h-screen font-PTSans">
        <Topbar />
        {/* FORM SECTION */}
        <div className="p-4 h-[calc(100%-64px)] overflow-y-auto w3/4">
          <h1 className="text-center w-3/4 m-auto px-4 font-PTSans font-bold text-3xl text-primary">
            Register a new patient{' '}
          </h1>
          <div className="w-2/4  m-auto p-4 flex justify-center items-center mt-8 border-2 shadow-md">
            <form
              className=" flex flex-col w-80 max-w-xl"
              onSubmit={handleSubmit}
            >
              <label
                className="font-PTSans font-bold text-primary text-lg "
                htmlFor="name"
              >
                Name:
              </label>
              <input
                className="rounded-sm h-7 bg-transparent border border-solid border-tertiary outline-none px-3 py-1 font-PTSans text-terborder-tertiary "
                type="text"
                name="name"
                value={newPatient.name}
                id="name"
                onChange={handleChange}
                autoComplete="off"
              />
              <label
                className="font-PTSans font-bold text-primary text-lg mt-2"
                htmlFor="lastName"
              >
                Last name:
              </label>
              <input
                className="rounded-sm h-7 bg-transparent border border-solid border-tertiary outline-none px-3 py-1 font-PTSans text-terborder-tertiary "
                type="text"
                name="lastName"
                value={newPatient.lastName}
                id="lastName"
                onChange={handleChange}
                autoComplete="off"
              />
              <label
                className="font-PTSans font-bold text-primary text-lg mt-2"
                htmlFor="age"
              >
                Age:
              </label>
              <input
                className="rounded-sm h-7 bg-transparent border border-solid border-tertiary outline-none px-3 py-1 font-PTSans text-terborder-tertiary "
                type="number"
                name="age"
                value={newPatient.age || ''}
                id="age"
                onChange={handleChange}
                autoComplete="off"
              />
              <label
                className="font-PTSans font-bold text-primary text-lg mt-2"
                htmlFor="weight"
              >
                Weight <i>(kg)</i>:
              </label>
              <input
                className="rounded-sm h-7 bg-transparent border border-solid border-tertiary outline-none px-3 py-1 font-PTSans text-terborder-tertiary "
                type="number"
                name="weight"
                value={newPatient.weight || ''}
                id="weight"
                onChange={handleChange}
                autoComplete="off"
              />
              <label
                className="font-PTSans font-bold text-primary text-lg mt-2"
                htmlFor="height"
              >
                Height <i>(mts)</i>:
              </label>
              <input
                className="rounded-sm h-7 bg-transparent border border-solid border-tertiary outline-none px-3 py-1 font-PTSans text-terborder-tertiary "
                type="number"
                name="height"
                value={newPatient.height || ''}
                id="height"
                onChange={handleChange}
                autoComplete="off"
              />
              <label
                className="font-PTSans font-bold text-primary text-lg mt-2"
                htmlFor="symptoms"
              >
                Symptoms:
              </label>
              <div className="w-full grid grid-cols-2 justify-center gap-1">
                {newPatient.symptoms.map((el, index) => (
                  <input
                    className="w-full rounded-sm h-7 bg-transparent border border-solid border-tertiary outline-none px-3 py-1 font-PTSans text-terborder-tertiary  text-center"
                    key={index}
                    type="text"
                    name="symptoms"
                    value={el}
                    id="symptoms"
                    onChange={(e) => handleSymptomChange(e, index)}
                    autoComplete="off"
                    autoFocus={true}
                  />
                ))}
              </div>
              <button
                className="w-fit px-2 font-semibold rounded-sm h-7 bg-transparent border border-primary text-primary shadow-lg hover:bg-tertiary hover:text-secondary hover:transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                type="button"
                onClick={addSymptoms}
                disabled={newPatient.symptoms.includes('')}
              >
                Add symptom
              </button>
              <label
                className="font-PTSans font-bold text-primary text-lg mt-2"
                htmlFor="diagnostic"
              >
                Diagnostic:
              </label>
              <textarea
                className="resize-none rounded-sm text-sm  bg-transparent border border-solid border-tertiary outline-none px-3 py-1 font-PTSans text-terborder-tertiary"
                name="diagnostic"
                value={newPatient.diagnostic}
                id="diagnostic"
                onChange={handleChange}
                autoComplete="off"
                cols={50}
                rows={2}
              />
              <label
                className="font-PTSans font-bold text-primary text-lg mt-2"
                htmlFor="image"
              >
                Image profile:
              </label>
              <input
                className="block w-full text-sm text-primary border border-primary rounded-sm cursor-pointer bg-secondary dark:text-secondary focus:outline-none dark:bg-primary dark:border-primary dark:placeholder-secondary"
                type="file"
                name="image"
                id="image"
                onChange={(e) =>
                  setNewPatient({...newPatient, image: e.target.files[0]})
                }
              />
              {loadingRegisterPatient && (
                <div className="w-full m-auto flex justify-center items-center mt-2">
                  <Loader />
                </div>
              )}
              <div className="my-4">
                <button
                  className="w-full font-semibold rounded-sm h-7 bg-transparent border-2 border-primary text-primary  shadow-lg hover:bg-primary hover:text-secondary hover:transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isDisabled()}
                >
                  {patientID ? 'Update this patient' : 'Register new patient'}
                </button>
              </div>

              <Link
                className="w-full font-semibold rounded-sm  border border-primary text-primary bg-secondary shadow-lg hover:bg-primary hover:text-secondary hover:transition-all text-center"
                to="/home"
              >
                Go to Home page
              </Link>
            </form>
            <ToastContainer autoClose={2500} />
          </div>
        </div>
      </div>
    </div>
  );
};
