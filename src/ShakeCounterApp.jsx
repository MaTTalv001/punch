import React, { useState, useEffect, useRef } from 'react';
import useDeviceMotion from './useDeviceMotion';
import './App.css';

function ShakeCounterApp() {
  const { motion, permissionGranted } = useDeviceMotion();
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
      }, 1000);
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

      if (acceleration > 20 && currentTime - lastShakeTime > 200) {
        setShakeCount((prevCount) => prevCount + 1);
        setLastShakeTime(currentTime);
      }
    }
  }, [motion, isCountingShakes, lastShakeTime]);

  const startCounting = () => {
    setFinalScore(null);
    setShakeCount(0);
    setTimeLeft(5);
    setCountdownTime(5);
    setCountdownStarted(true);
    setGameState('countdown');
  };

  const punchMonster = () => {
    setGameState('punched');
  };

  if (!permissionGranted) {
    return <div>加速度センサーの使用許可が必要です。</div>;
  }

  return (
    <div className="game-container">
      <img src="/bg.jpeg" alt="Monster" className="monster-image" />
      {gameState === 'start' && (
        <div className="message-box">
          <p>モンスターが現れた！</p>
          <button onClick={startCounting}>力をためる</button>
        </div>
      )}
      {gameState === 'countdown' && (
        <div className="message-box">
          <p>力をためています: {countdownTime}秒</p>
        </div>
      )}
      {gameState === 'shake' && (
        <div className="message-box">
          <p>残り時間: {timeLeft}秒</p>
          <p>シェイク回数: {shakeCount}</p>
        </div>
      )}
      {gameState === 'result' && (
        <div className="message-box">
          <p>{finalScore}のダメージを与えた！！</p>
          <button onClick={punchMonster}>パンチ</button>
        </div>
      )}
      {gameState === 'punched' && (
        <div className="message-box">
          <p>{finalScore}のダメージを与えた！！</p>
          <button onClick={startCounting}>もう一度</button>
        </div>
      )}
    </div>
  );
}

export default ShakeCounterApp;