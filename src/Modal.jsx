const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // モーダルのバックドロップのクリックを捕捉し、イベントの伝播を止める
  const handleBackdropClick = (e) => {
    e.stopPropagation(); // モーダルの外のクリックを無視
  };

  // モーダルコンテンツのクリックイベントを防止して伝播させない
  const handleModalContentClick = (e) => {
    e.stopPropagation(); // モーダル内のイベントは通常通り動作
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content" onClick={handleModalContentClick}>
        {children}
        <button className="close-button" onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};


export default Modal;
