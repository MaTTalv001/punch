import React, { useState, useEffect, useRef } from 'react';
import useDeviceMotion from './useDeviceMotion';

function ShakeCounterApp() {
  const { motion, permissionGranted } = useDeviceMotion();
  const [shakeCount, setShakeCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isCountingShakes, setIsCountingShakes] = useState(false);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const timerRef = useRef(null);

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
      }, 500);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isCountingShakes, shakeCount]);

  useEffect(() => {
    if (isCountingShakes) {
      const { x, y, z } = motion;
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      const currentTime = new Date().getTime();

      if (acceleration > 20 && currentTime - lastShakeTime > 100) {
        setShakeCount((prevCount) => prevCount + 1);
        setLastShakeTime(currentTime);
      }
    }
  }, [motion, isCountingShakes, lastShakeTime]);

  const startCounting = () => {
    setFinalScore(null);
    setShakeCount(0);
    setTimeLeft(10);
    setIsCountingShakes(true);
    setLastShakeTime(0);
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
              <p>10秒間でできるだけ多くシェイクしてください！</p>
              <button onClick={startCounting}>スタート</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ShakeCounterApp;