import React from 'react';
import { IoClose } from "react-icons/io5"; // X icon

const SupportOfficerModel = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-teal-100 px-4 py-3 rounded-t-lg">
          <h2 className="text-lg font-semibold text-[#082f6b] text-semibold">{title}</h2>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={onClose}
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="mb-4 text-[#082f6b] text-semibold whitespace-pre-line">{description}</p>
          {/* <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button> */}
          <div className='mt-16'>

          </div>
          {/* <p className="mt-4 text-sm text-gray-500">Click outside the modal to close it.</p>  */}
        </div>
      </div>
    </div>
  );
};

export default SupportOfficerModel;
