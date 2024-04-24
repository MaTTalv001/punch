import { useState, useEffect } from 'react';

function useDeviceMotion() {
    const [motion, setMotion] = useState({ x: 0, y: 0, z: 0 });
    const [permissionGranted, setPermissionGranted] = useState(false);

    useEffect(() => {
        function handleMotionEvent(event) {
            setMotion({
                x: event.accelerationIncludingGravity.x*10,
                y: event.accelerationIncludingGravity.y*10,
                z: event.accelerationIncludingGravity.z*10
            });
        }

        if (permissionGranted) {
            window.addEventListener('devicemotion', handleMotionEvent);
            return () => {
                window.removeEventListener('devicemotion', handleMotionEvent);
            };
        }
    }, [permissionGranted]);

    const requestPermission = () => {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        setPermissionGranted(true);
                    } else {
                        alert('Permission not granted');
                    }
                })
                .catch(console.error);
        } else {
            alert('DeviceMotionEvent.requestPermission is not supported on this device.');
        }
    };

    return { motion, requestPermission };
}

export default useDeviceMotion;
