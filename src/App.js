import React, { useState, useEffect } from 'react';

function App() {
  const [maxAcceleration, setMaxAcceleration] = useState(0);
  const [currentAcceleration, setCurrentAcceleration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(null);

  // デバイスモーションのイベントハンドラ
  const handleMotionEvent = (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const totalAcceleration = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2);
    setCurrentAcceleration(totalAcceleration);
    if (totalAcceleration > maxAcceleration) {
      setMaxAcceleration(totalAcceleration);
    }
  };

  // 許可を求める関数
  const requestPermission = () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            startRecording();
          } else {
            alert('Permission not granted');
          }
        })
        .catch(console.error);
    } else {
      alert('DeviceMotionEvent.requestPermission is not supported on your device.');
    }
  };

  // 録音を開始する関数
  const startRecording = () => {
    setIsRecording(true);
    setMaxAcceleration(0);
    window.addEventListener('devicemotion', handleMotionEvent);
    const newTimer = setTimeout(() => {
      window.removeEventListener('devicemotion', handleMotionEvent);
      setIsRecording(false);
      alert(`Recording stopped. Max acceleration: ${maxAcceleration.toFixed(2)} m/s²`);
    }, 5000); // 5秒後に記録を停止
    setTimer(newTimer);
  };

  // コンポーネントのアンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('devicemotion', handleMotionEvent);
    };
  }, [timer]);

  return (
    <div>
      <h1>パンチ力測定</h1>
      {!isRecording && <button onClick={requestPermission}>Start</button>}
      {isRecording && <p>Recording... Current acceleration: {currentAcceleration.toFixed(2)} m/s²</p>}
      <p>Max acceleration recorded: {maxAcceleration.toFixed(2)} m/s²</p>
    </div>
  );
}

export default App;
