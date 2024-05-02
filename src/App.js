import React, { useState, useEffect, useRef } from 'react';
import ShakeCounterApp from "./ShakeCounterApp";
import RankingsComponent from "./RankingsComponent";
import './App.css';
import Modal from './Modal';

function App() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  return (
      <div className={`App ${isOpen ? 'modal-open' : ''}`}>
          <header className="App-header">
        <p className="campaign-announcement">御坂美琴生誕記念Ver.（非公式）</p>
        <p className="smartphone-content">スマートフォン用コンテンツ</p>
        <h1>
          <span>無限宇宙</span>
          
          <span>超電磁砲(レールガン)</span>
        </h1>
        <img src="/QR_CODE.png" alt="QR Code" className="qr-code" />
        <div className="button-group">
            <button onClick={toggleModal} className="view-ranking-button">ランキングを見る</button>
        </div>
    </header>
    <section className="instructions-section">
        <h2>ルール</h2>
        <ul>
            <li>
                <span className="strikethrough">あなたは地球のヒーロー、無限宇宙メテオマンです。</span>
                <span>あなたはレベル5の中学生です。</span>
            </li>
            <li>スマホを振ってエネルギーをチャージし、エネミーに大きなダメージを与えましょう</li>
            <li>チャージ時間は3秒ですが、振っている間は時間が減らず延々とチャージできます</li>
        </ul>
    </section>
      <section className="caution-section">
        <h2>注意</h2>
        <ul>
          <li>このアプリはスマートフォン専用です</li>
          <li>スマートフォンによっては正常に動作しない場合があります</li>
          <li>体調に無理のない範囲でプレイしてください</li>
          <li>必ず周囲の安全を確かめてプレイしてください</li>
        </ul>
      </section>
          <ShakeCounterApp />

        <Modal isOpen={isOpen} onClose={toggleModal}>
        <RankingsComponent />
        </Modal>
    </div>
      
  );
}

export default App;




