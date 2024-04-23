import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [maxAcceleration, setMaxAcceleration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [count, setCount] = useState(0);
  const canCount = useRef(true); // canCount を useRef で管理
  const [timer, setTimer] = useState(null);

  // デバイスモーションのイベントハンドラ
  const handleMotionEvent = (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const totalAcceleration = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2);

    // 最大加速度を更新
    if (totalAcceleration > maxAcceleration) {
      setMaxAcceleration(totalAcceleration);
    }

    // 加速度が40を超えた時の処理
    if (totalAcceleration > 40 && canCount.current) {
      setCount(count => count + 1);
      canCount.current = false; // useRefを使って値を更新
    }

    // 加速度が20以下になった時に再びカウント可能に
    if (totalAcceleration <= 20 && !canCount.current) {
      canCount.current = true;
    }
  };

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

  const startRecording = () => {
    setIsRecording(true);
    setMaxAcceleration(0);
    setCount(0); // カウントリセット
    canCount.current = true; // useRefを使ってフラグをリセット
    window.addEventListener('devicemotion', handleMotionEvent);
    const newTimer = setTimeout(() => {
      window.removeEventListener('devicemotion', handleMotionEvent);
      setIsRecording(false);
      alert(`Recording stopped. Max acceleration: ${maxAcceleration.toFixed(2)} m/s². Count: ${count}`);
      setTimer(null);
    }, 5000);
    setTimer(newTimer);
  };

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
      {isRecording && <p>Recording...</p>}
      <p>Max acceleration recorded: {maxAcceleration.toFixed(2)} m/s²</p>
      <p>Count over 40: {count}</p>
    </div>
  );
}

export default App;
