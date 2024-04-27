import React, { useState, useEffect, useRef } from 'react';
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // モーダルのバックドロップのクリックを捕捉し、イベントの伝播を止める
  const handleBackdropClick = (e) => {
    e.stopPropagation(); // モーダルの外のクリックを無視
  };

  // モーダルコンテンツのクリックイベントを防止して伝播させない
  const handleModalContentClick = (e) => {
    e.stopPropagation(); // モーダル内のイベントは通常通り動作
  };

  // モーダルが開いているときに背景のスライド操作を無効にする
  const handleTouchMove = (e) => {
    if (e.target.closest(".modal-content")) {
      // モーダルコンテンツ内のスライドは許可
      return;
    }
    e.preventDefault(); // 背景のスライドを無効化
  };

  

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      onTouchMove={handleTouchMove}
    >
      <div className="modal-content" onClick={handleModalContentClick}>
        {children}
        <button className="close-button" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
};

export default Modal;
