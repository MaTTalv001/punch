import React, { useState, useEffect } from 'react';
import useDeviceMotion from './useDeviceMotion';

function GameApp() {
    const { motion, requestPermission } = useDeviceMotion();
    const [energy, setEnergy] = useState(0);
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        let interval;

        if (isShaking) {
            interval = setInterval(() => {
                const shakePower = 50 * Math.sqrt(motion.x ** 2 + motion.y ** 2 + motion.z ** 2);
                console.log(`Shake Power: ${shakePower}`);
                setEnergy(prevEnergy => prevEnergy + shakePower);
            }, 100);

            setTimeout(() => {
                console.log("Shaking auto-stopped after 10 seconds.");
                setIsShaking(false);
                clearInterval(interval);
            }, 10000);
        }

        return () => {
            clearInterval(interval);
            console.log("Cleanup done.");
        };
    }, [isShaking]);  // Remove 'motion' from dependency array to prevent frequent re-execution

    const startShaking = () => {
        requestPermission()
            .then(() => {
                console.log("Permission granted and shaking is set to true.");
                setIsShaking(true);
            })
            .catch(err => {
                console.error("Permission request failed", err);
            });
    };

    const stopShaking = () => {
        setIsShaking(false);
        console.log("Shaking manually stopped.");
    };

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







