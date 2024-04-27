import { useState, useEffect } from 'react';

function useDeviceMotion() {
  const [motion, setMotion] = useState({ x: 0, y: 0, z: 0 });
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const requestPermission = async () => {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
          const permissionState = await DeviceMotionEvent.requestPermission();
          setPermissionGranted(permissionState === 'granted');
        } catch (error) {
          console.error('デバイスの許可を得られませんでした', error);
        }
      } else {
        setPermissionGranted(true);
      }
    };

    const handleMotionEvent = (event) => {
      setMotion({
        x: event.accelerationIncludingGravity.x,
        y: event.accelerationIncludingGravity.y,
        z: event.accelerationIncludingGravity.z,
      });
    };

    if (permissionGranted) {
      window.addEventListener('devicemotion', handleMotionEvent);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotionEvent);
    };
  }, [permissionGranted]);

  const requestPermission = async () => {
  if (typeof DeviceMotionEvent !== 'undefined') {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission();
        setPermissionGranted(permissionState === 'granted');
      } catch (error) {
        console.error('デバイスの許可を得られませんでした', error);
        alert('デバイスの許可を得られませんでした。');
      }
    } else {
      // iOS以外の場合は、許可を求めずに直接permissionGrantedをtrueに設定
      setPermissionGranted(true);
    }
  } else {
    console.warn('加速度センサーに対応していないデバイスです');
    alert('このデバイスは加速度センサーに対応していません。スマートフォンでアクセスしてください。');
  }
};

return { motion, permissionGranted, requestPermission };
}

export default useDeviceMotion;

