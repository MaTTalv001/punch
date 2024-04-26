import React, { useState, useEffect } from 'react';
import useDeviceMotion from './useDeviceMotion';

function GameApp() {
    const { motion, requestPermission } = useDeviceMotion();
    const [energy, setEnergy] = useState(0);
    const [isShaking, setIsShaking] = useState(false);
    const [latestMotion, setLatestMotion] = useState({ x: 0, y: 0, z: 0 });

    // 加速度データが更新されるたびに最新のmotionを状態に保存
    useEffect(() => {
        setLatestMotion(motion);
    }, [motion]);

    useEffect(() => {
        let interval;
        
        if (isShaking) {
            interval = setInterval(() => {
                const { x, y, z } = latestMotion;
                const shakePower = 50 * Math.sqrt(x ** 2 + y ** 2 + z ** 2);
                console.log(`Shake Power: ${shakePower} at x: ${x}, y: ${y}, z: ${z}`);
                setEnergy(prevEnergy => prevEnergy + shakePower);
            }, 100);
        }

        const timeout = setTimeout(() => {
            if (isShaking) {
                console.log("Shaking auto-stopped after 10 seconds.");
                setIsShaking(false);
                clearInterval(interval);
            }
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
            console.log("Cleanup done.");
        };
    }, [isShaking, latestMotion]); // 依存配列にlatestMotionを使用

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









