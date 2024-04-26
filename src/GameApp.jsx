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
                // 直接 motion を参照して shakePower を計算
                const shakePower = 50 * Math.sqrt(motion.x ** 2 + motion.y ** 2 + motion.z ** 2);
                console.log(`Shake Power: ${shakePower} at x: ${motion.x}, y: ${motion.y}, z: ${motion.z}`);
                setEnergy(prevEnergy => prevEnergy + shakePower);
            }, 100);

            const timeout = setTimeout(() => {
                console.log("Shaking auto-stopped after 10 seconds.");
                setIsShaking(false);
                clearInterval(interval);
            }, 10000);
        }

        return () => {
            clearInterval(interval);
            console.log("Cleanup done.");
        };
    }, [isShaking]); // ここに motion を含めない

    const startShaking = async () => {
        try {
            await requestPermission();
            console.log("Permission granted and shaking is set to true.");
            setIsShaking(true);
        } catch (error) {
            console.error("Permission request failed", error);
        }
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









