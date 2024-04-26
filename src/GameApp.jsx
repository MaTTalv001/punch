import React, { useState, useEffect } from 'react';
import useDeviceMotion from './useDeviceMotion';

function GameApp() {
    const { motion, requestPermission } = useDeviceMotion();
    const [energy, setEnergy] = useState(0);
    const [monsterHealth, setMonsterHealth] = useState(100);
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        let interval;
        if (isShaking) {
            interval = setInterval(() => {
                const shakePower = Math.sqrt(motion.x ** 2 + motion.y ** 2 + motion.z ** 2);
                console.log(`Shake Power: ${shakePower}`); // 加速度データを確認
                if (shakePower > 1) { // スレッショルドを非常に低く設定
                    setEnergy(prevEnergy => prevEnergy + shakePower);
                }
            }, 100);

            const timeout = setTimeout(() => {
                console.log("Stopping shake detection due to timeout.");
                clearInterval(interval);
                setIsShaking(false);
            }, 10000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [isShaking, motion]);

    const startShaking = () => {
        requestPermission().then(() => {
            console.log("Permission granted, starting shake detection.");
            setIsShaking(true);
        }).catch(err => {
            console.error("Permission request failed", err);
        });
    };

    const stopShaking = () => {
        setIsShaking(false);
    };

    const useEnergy = () => {
        if (energy > 0) {
            const damage = energy / 10;
            setMonsterHealth(prevHealth => Math.max(prevHealth - damage, 0));
            setEnergy(0);
        }
    };

    return (
        <div>
            <h1>モンスターバトル</h1>
            <button onClick={startShaking} disabled={isShaking}>スマホを振る！</button>
            <button onClick={stopShaking} disabled={!isShaking}>停止</button>
            <button onClick={useEnergy} disabled={energy <= 0}>必殺技発動！</button>
            <div>モンスターの体力: {monsterHealth}</div>
            <div>蓄積エネルギー: {energy.toFixed(2)}</div>
            <p>X軸の加速度: {motion.x?.toFixed(2) || 'Not available'}</p>
            <p>Y軸の加速度: {motion.y?.toFixed(2) || 'Not available'}</p>
            <p>Z軸の加速度: {motion.z?.toFixed(2) || 'Not available'}</p>
        </div>
    );
}

export default GameApp;



