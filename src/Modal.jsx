const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const stopPropagation = (e) => {
    e.stopPropagation(); // イベントの伝播を停止
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={stopPropagation}>
        {children}
        <button className="close-button" onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};


export default Modal;
