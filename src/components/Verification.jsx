/* eslint-disable react/prop-types */

import { formatDate } from "../utils/dates";

 
function Verification({ productData }) {
    console.log('productData', productData);
     
    const { 
        DescripcionItem,
        Estado,
        CFS,
        RucEmpresa,
        NombreEmpresa,
        OrigenItem,
        CodigoIce,
        FechaActivacion,
        RegistroSanitario,
      } = productData


  return (
    <div className="container">
      <h1 className="mb-4 text-xl font-bold">{DescripcionItem}</h1>


<dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-gray-600 dark:divide-gray-700">
    <div className="flex flex-col pb-3">
        <dt className="mb-1 uppercase text-gray-500 md:text-lg dark:text-gray-800">Estado</dt>
        <dd className="text-lg font-semibold">CFS <span className="capitalize" >{Estado}</span> </dd>
    </div>
    <div className="flex flex-col py-3">
        <dt className="mb-1 uppercase text-gray-500 md:text-lg dark:text-gray-800">CFS</dt>
        <dd className="text-lg font-semibold">{CFS}</dd>
    </div>
    <div className="flex flex-col pt-3">
        <dt className="mb-1 uppercase text-gray-500 md:text-lg dark:text-gray-800">Ruc</dt>
        <dd className="text-lg font-semibold">{RucEmpresa}</dd>
    </div>
    <div className="flex flex-col pt-3">
        <dt className="mb-1 uppercase text-gray-500 md:text-lg dark:text-gray-800">FABRICANTE / IMPORTADOR</dt>
        <dd className="text-lg font-semibold">{NombreEmpresa}</dd>
    </div>
    <div className="flex flex-col pt-3">
        <dt className="mb-1 uppercase text-gray-500 md:text-lg dark:text-gray-800">Origen</dt>
        <dd className="text-lg font-semibold">{OrigenItem}</dd>
    </div>
    <div className="flex flex-col pt-3">
        <dt className="mb-1 uppercase text-gray-500 md:text-lg dark:text-gray-800">SKU-ICE</dt>
        <dd className="text-lg font-semibold">{CodigoIce}</dd>
    </div>
    <div className="flex flex-col pt-3">
        <dt className="mb-1 uppercase text-gray-500 md:text-lg dark:text-gray-800">Fecha de Activación</dt>
        <dd className="text-lg font-semibold">{formatDate(FechaActivacion, true)}</dd>
    </div>
    <div className="flex flex-col pt-3">
        <dt className="mb-1 uppercase text-gray-500 md:text-lg dark:text-gray-800">Registro Sanitario</dt>
        <dd className="text-lg font-semibold">{RegistroSanitario}</dd>
    </div>

</dl>


    </div>
  )
}

export default Verification