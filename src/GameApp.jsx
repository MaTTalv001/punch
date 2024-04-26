// GameApp.js
import React, { useState, useEffect } from 'react';
import useDeviceMotion from './useDeviceMotion';

function GameApp() {
  const { motion, permissionGranted } = useDeviceMotion();
  const [energy, setEnergy] = useState(0);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [showPunchButton, setShowPunchButton] = useState(false);

  useEffect(() => {
    let interval;
    if (isMeasuring && permissionGranted) {
      interval = setInterval(() => {
        const shakePower = 50 * Math.sqrt(motion.x ** 2 + motion.y ** 2 + motion.z ** 2);
        console.log(`Shake Power: ${shakePower} at x: ${motion.x}, y: ${motion.y}, z: ${motion.z}`);
        setEnergy(prevEnergy => prevEnergy + shakePower);
      }, 100);

      setTimeout(() => {
        console.log("Measuring stopped after 10 seconds.");
        setIsMeasuring(false);
        setShowPunchButton(true);
        clearInterval(interval);
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isMeasuring, motion, permissionGranted]);

  const startMeasuring = () => {
    setIsMeasuring(true);
  };

  const punchMonster = () => {
    console.log(`Punched with energy: ${energy.toFixed(2)}`);
    setEnergy(0);
    setShowPunchButton(false);
  };

  return (
    <div>
      <h1>モンスターバトル</h1>
      <button onClick={startMeasuring} disabled={isMeasuring || !permissionGranted}>
        計測開始
      </button>
      <div>Energy: {energy.toFixed(2)}</div>
      {showPunchButton && (
        <button onClick={punchMonster}>パンチ</button>
      )}
    </div>
  );
}

export default GameApp;







