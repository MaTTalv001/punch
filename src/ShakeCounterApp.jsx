import React, { useState, useEffect, useRef } from 'react';
import useDeviceMotion from './useDeviceMotion';
import './App.css';
import supabase from './services/supabaseClient';
import useFetchRankings from './useFetchRankings';
import RankingsComponent from './RankingsComponent';
import Modal from './Modal';

function ShakeCounterApp() {
  const { motion, permissionGranted, requestPermission } = useDeviceMotion();
  const [shakeCount, setShakeCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isCountingShakes, setIsCountingShakes] = useState(false);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [countdownTime, setCountdownTime] = useState(5);
  const [gameState, setGameState] = useState('start');
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [nicknameRegistered, setNicknameRegistered] = useState(false);
  const imageNumbers = ['04', '05'];
  const [currentImage, setCurrentImage] = useState('');
  // コンポーネントがマウントされた後にランダムな画像を選ぶ
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * imageNumbers.length);
        const selectedImage = `/enemy${imageNumbers[randomIndex]}.PNG`;
        setCurrentImage(selectedImage);
    }, []);  // 依存配列が空なので、コンポーネントのマウント時にのみ実行されます。

  useEffect(() => {
    if (isCountingShakes) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(timerRef.current);
            setIsCountingShakes(false);
            setFinalScore(shakeCount);
            setGameState('result');
            return 0;
          }
        });
      }, 500);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isCountingShakes, shakeCount]);

  useEffect(() => {
    if (countdownStarted) {
      countdownRef.current = setInterval(() => {
        setCountdownTime((prevTime) => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            clearInterval(countdownRef.current);
            setCountdownStarted(false);
            setIsCountingShakes(true);
            setGameState('shake');
            setLastShakeTime(0);
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdownRef.current);
    };
  }, [countdownStarted]);

  useEffect(() => {
    if (isCountingShakes) {
      const { x, y, z } = motion;
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      const currentTime = new Date().getTime();

      if (acceleration > 35 && currentTime - lastShakeTime > 200) {
        setShakeCount((prevCount) => prevCount + 1);
        setLastShakeTime(currentTime);
      }
    }
  }, [motion, isCountingShakes, lastShakeTime]);

  if (!permissionGranted) {
    return (
  <div>
    <p>加速度センサーへのアクセスを許可してください。</p>
    <button style={{ marginBottom: '20px' }} onClick={requestPermission}>許可する</button>
  </div>
);
  }

  const startCounting = () => {
    setFinalScore(null);
    setShakeCount(0);
    setTimeLeft(3);
    setCountdownTime(10);
    setCountdownStarted(true);
    setGameState('countdown');
  };

  const punchMonster = () => {
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      setGameState('punched');
    }, 2000);
  };

  if (!permissionGranted) {
    return <div>加速度センサーの使用許可が必要です。</div>;
  }

  const registerScore = async () => {
    if (nickname.trim() === '') {
      alert('ニックネームを入力してください');
      
      return;
    }

    setIsRegistering(true);

    try {
      const { data, error } = await supabase
        .from('Ranking')
        .insert({ nickname: nickname, score: finalScore });

      if (error) {
        console.error('スコア登録エラー:', error);
        alert('スコアの登録に失敗しました');
      } else {
        console.log('スコア登録成功:', data);
        alert('スコアが登録されました');
        setIsRegistering(false);
        setNicknameRegistered(true); // ニックネーム登録完了を設定
      }
    } catch (error) {
      console.error('スコア登録エラー:', error);
      alert('スコアの登録に失敗しました');
    }

    setIsRegistering(false);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const post = {
    title: "無限宇宙メテオストライクパンチ",
    url: "https://punch-theta.vercel.app/",
  };

  const handleTweet = () => {
    const tweetText = `【無限宇宙メテオストライクパンチ】${finalScore}のダメージを与えた！！ #無限宇宙メテオストライクパンチ #RUNTEQ `;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      post.url
    )}&text=${encodeURIComponent(tweetText)}`;

    // 新しいタブでTwitter共有ページを開く
    window.open(twitterUrl, "_blank");
  };

  

const restartGame = () => {
  startCounting(); // ゲーム再開の関数
  setNicknameRegistered(false); // ニックネーム登録可能にリセット
};
  
    return (
      <>
        <div className={`game-container ${isOpen ? 'modal-open' : ''}`}>
          <div className="game-screen">
            <div className="background-container">
              <img src="/bg.jpeg" alt="Background" className="background-image" />
              <img
            src={currentImage}
            alt="Enemy"
            className={`enemy-image ${gameState === 'punched' ? 'hidden' : ''}`}
        />
            </div>
          </div>
          <div className="message-container">
            {gameState === 'start' && (
              <div className="message-box">
                <h2>やべえやつが現れた！</h2>
                <p>どうする！？レベル5！！</p>
                <button onClick={startCounting}>力をためる</button>
              </div>
            )}
            {gameState === 'countdown' && (
              <div className="message-box">
                <h2>{countdownTime}秒後にチャージ開始します</h2>
                <p>How to Play</p>
                <p>スマートフォンを激しくシェイクして力をためます</p>
                <p>制限時間は3秒ですが、シェイクしている間は減りません。</p>
            
                <h3>注意：周囲の安全を確かめてください </h3>
              </div>
            )}
            {gameState === 'shake' && (
              <div className="message-box">
                <h2>チャージ残り時間: {timeLeft}秒</h2>
                <p>残り時間はシェイクしている限り減らない！！</p>
                <p>限界を超えろっっっ！！！</p>
              </div>
            )}
            {gameState === 'result' && (
              <div className="message-box">
                <h2>力がみなぎった！！</h2>
                <button onClick={punchMonster}>超電磁砲（レールガン）！！</button>
              </div>
            )}
            {showModal && (
              <div className="modal">
                <img src="/railgun.jpeg" alt="Punch" />
              </div>
            )}
            {gameState === 'punched' && (
          <div className="message-box">
            <h2>{finalScore}ギガコスモのダメージを与えた！！</h2>
            <p>やべえやつはいなくなった</p>
            <div className="input-group">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="ニックネームを入力"
                className="nickname-input"
              />
              <button onClick={registerScore} disabled={isRegistering || nicknameRegistered}>
                {isRegistering ? '登録中...' : 'ランク登録'}
              </button>
            </div>
            <div className="button-group">
              <button onClick={toggleModal} className="view-ranking-button">ランキングを見る</button>
              
              <button
                onClick={handleTweet}
                className="mx-2 bg-black hover:bg-black text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
              >
                <i className="fab fa-twitter"></i> Xにポスト
                  </button>
                  <button onClick={restartGame} className="restart-button">もう一度</button>
            </div>
            <Modal isOpen={isOpen} onClose={toggleModal}>
              <RankingsComponent />
            </Modal>
          </div>
            )}
          </div>
        </div>
    
      </>
    );
  }

export default ShakeCounterApp;