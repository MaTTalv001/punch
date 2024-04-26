import React, { useState, useEffect, useRef } from 'react';
import useDeviceMotion from './useDeviceMotion';

function ShakeCounterApp() {
  const { motion, permissionGranted } = useDeviceMotion();
  const [shakeCount, setShakeCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isCountingShakes, setIsCountingShakes] = useState(false);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [countdownTime, setCountdownTime] = useState(5);
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

      if (acceleration > 30 && currentTime - lastShakeTime > 200) {
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
  };

  if (!permissionGranted) {
    return <div>加速度センサーの使用許可が必要です。</div>;
  }

  return (
    <div>
      <h1>シェイクカウンター</h1>
      {isCountingShakes ? (
        <>
          <p>残り時間: {timeLeft}秒</p>
          <p>シェイク回数: {shakeCount}</p>
        </>
      ) : (
        <>
          {finalScore !== null ? (
            <>
              <p>あなたのスコア: {finalScore}</p>
              <button onClick={startCounting}>もう一度プレイ</button>
            </>
          ) : (
            <>
              {countdownStarted ? (
                <p>準備してください: {countdownTime}秒</p>
              ) : (
                <>
                  <p>できるだけ長くシェイクし続けてください！</p>
                  <button onClick={startCounting}>スタート</button>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ShakeCounterApp;