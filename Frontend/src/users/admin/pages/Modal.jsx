import React from "react";

const Modal = ({ isOpen, type, message, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <p className="text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          {type === "confirmation" ? (
            <>
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
