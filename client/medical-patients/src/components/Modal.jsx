/* eslint-disable react/prop-types */

export const Modal = ({indicatorsPatient, setViewModal}) => {
  const {name, lastName, age, height, weight, diagnostic, symptoms} =
    indicatorsPatient;
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-secondary outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-center p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-2xl font-semibold capitalize font-PTSans">
                {name} {lastName}
              </h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto text-lg">
              <ul>
                <li className="text-slate-500 font-PTSans my-1 text-center">
                  <b>Age:</b> {age} years.
                </li>
                <li className="text-slate-500 font-PTSans my-1 text-center">
                  <b>Weight:</b> {weight} kg.
                </li>
                <li className="text-slate-500 font-PTSans my-1 text-center">
                  <b>Height:</b> {height} mts.
                </li>
                <li className="text-slate-500 font-PTSans my-1 text-center">
                  <b>IMC:</b> {(weight / (height * height)).toFixed(2)} kg/m²
                </li>
                <li className="text-slate-500 font-PTSans my-1 text-center">
                  <b>Symptoms:</b>
                </li>
                {symptoms
                  .join(', ')
                  .split(',')
                  .map((symp, idx) => (
                    <li
                      className="text-slate-500 font-PTSans text-center"
                      key={idx}
                    >
                      {symp.trim()}.
                    </li>
                  ))}
                <li className="text-slate-500 font-PTSans my-1 text-center">
                  <b>Diagnostic:</b> {diagnostic}.
                </li>
              </ul>
              {/* <p className="my-4 text-slate-500 text-lg leading-relaxed font-PTSans">
                <b>Age:</b> {age} years
              </p>
              <p className="my-4 text-slate-500 text-lg leading-relaxed font-PTSans">
                <b>Weight:</b> {weight} kg
              </p>
              <p className="my-4 text-slate-500 text-lg leading-relaxed font-PTSans">
                <b>Height:</b> {height} mts
              </p> */}
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="bg-secondary text-red-500 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
