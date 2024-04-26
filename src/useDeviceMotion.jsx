// useDeviceMotion.js
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
          console.error('Permission request failed', error);
        }
      } else {
        setPermissionGranted(true);
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
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

  return { motion, permissionGranted };
}

export default useDeviceMotion;

