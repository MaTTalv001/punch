import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
                {children}
        <button className="close-button" onClick={onClose}>閉じる</button>
              </div>
    </div>
  );
};

export default Modal;
