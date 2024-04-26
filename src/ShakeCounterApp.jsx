import React, { useState, useEffect } from 'react';
import useDeviceMotion from './useDeviceMotion';

function ShakeCounterApp() {
  const { motion, permissionGranted } = useDeviceMotion();
  const [shakeCount, setShakeCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isCountingShakes, setIsCountingShakes] = useState(false);

  useEffect(() => {
    if (isCountingShakes && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsCountingShakes(false);
    }
  }, [isCountingShakes, timeLeft]);

  useEffect(() => {
    if (isCountingShakes) {
      const { x, y, z } = motion;
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      if (acceleration > 15) {
        setShakeCount(shakeCount + 1);
      }
    }
  }, [motion, isCountingShakes, shakeCount]);

  const startCounting = () => {
    setShakeCount(0);
    setTimeLeft(10);
    setIsCountingShakes(true);
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
          <p>10秒間でできるだけ多くシェイクしてください！</p>
          <button onClick={startCounting}>スタート</button>
        </>
      )}
    </div>
  );
}

export default ShakeCounterApp;