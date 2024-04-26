import React, { useState, useEffect } from 'react';

function useDeviceMotion() {
    const [motion, setMotion] = useState({ x: 0, y: 0, z: 0 });
    const [permissionGranted, setPermissionGranted] = useState(false);

    useEffect(() => {
        function handleMotionEvent(event) {
            setMotion({
                x: event.accelerationIncludingGravity.x,
                y: event.accelerationIncludingGravity.y,
                z: event.accelerationIncludingGravity.z
            });
        }

        if (permissionGranted) {
            window.addEventListener('devicemotion', handleMotionEvent);
            return () => window.removeEventListener('devicemotion', handleMotionEvent);
        }
    }, [permissionGranted]);

    const requestPermission = async () => {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permissionState = await DeviceMotionEvent.requestPermission();
                setPermissionGranted(permissionState === 'granted');
            } catch (error) {
                console.error('Permission request failed', error);
            }
        } else {
            alert('DeviceMotionEvent.requestPermission is not supported on this device.');
        }
    };

    return { motion, requestPermission };
}

function GameApp() {
    const { motion, requestPermission } = useDeviceMotion();
    const [energy, setEnergy] = useState(0);
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        let interval;
        if (isShaking) {
            interval = setInterval(() => {
                const shakePower = 50 * Math.sqrt(motion.x ** 2 + motion.y ** 2 + motion.z ** 2);
                console.log(`Shake Power: ${shakePower} at x: ${motion.x}, y: ${motion.y}, z: ${motion.z}`);
                setEnergy(prevEnergy => prevEnergy + shakePower);
            }, 100);
            setTimeout(() => {
                console.log("Shaking auto-stopped after 10 seconds.");
                setIsShaking(false);
                clearInterval(interval);
            }, 10000);
        }
        return () => clearInterval(interval);
    }, [isShaking, motion]);

    const startShaking = async () => {
        await requestPermission();
        setIsShaking(true);
    };

    const stopShaking = () => setIsShaking(false);

    return (
        <div>
            <h1>モンスターバトル</h1>
            <button onClick={startShaking} disabled={isShaking}>Start Shaking</button>
            <button onClick={stopShaking} disabled={!isShaking}>Stop</button>
            <div>Energy: {energy.toFixed(2)}</div>
        </div>
    );
}

export default GameApp;









