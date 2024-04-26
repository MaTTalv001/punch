import React, { useState, useEffect } from 'react';

function useDeviceMotion() {
    const [motion, setMotion] = useState({ x: 0, y: 0, z: 0 });
    const [permissionGranted, setPermissionGranted] = useState(false);

    useEffect(() => {
        const handleMotionEvent = event => {
            setMotion({
                x: event.acceleration.x,
                y: event.acceleration.y,
                z: event.acceleration.z
            });
        };

        if (permissionGranted) {
            setTimeout(() => { // 少し遅延を入れてからイベントリスナーを設定
                window.addEventListener('devicemotion', handleMotionEvent);
            }, 500);

            return () => {
                window.removeEventListener('devicemotion', handleMotionEvent);
            };
        }
    }, [permissionGranted]);

    const requestPermission = async () => {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permissionState = await DeviceMotionEvent.requestPermission();
                if (permissionState === 'granted') {
                    setPermissionGranted(true);
                } else {
                    alert('Permission not granted');
                }
            } catch (error) {
                console.error('Permission request failed', error);
                alert('Error requesting permission.');
            }
        } else {
            alert('DeviceMotionEvent.requestPermission is not supported on this device.');
        }
    };

    return { motion, requestPermission };
}

export default useDeviceMotion;
