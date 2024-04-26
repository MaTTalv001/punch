import React, { useState, useEffect } from 'react';
import useDeviceMotion from './useDeviceMotion';

function GameApp() {
    const { motion, requestPermission } = useDeviceMotion();
    const [energy, setEnergy] = useState(0);
    const [monsterHealth, setMonsterHealth] = useState(100);
    const [isShaking, setIsShaking] = useState(false);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        if (isShaking) {
            const interval = setInterval(() => {
                const shakePower = Math.sqrt(motion.x ** 2 + motion.y ** 2 + motion.z ** 2);
                if (shakePower > 10) {
                    setEnergy(prevEnergy => prevEnergy + shakePower);
                }
            }, 100);

            // 10秒後に自動的に振動計測を停止
            const timeout = setTimeout(() => {
                clearInterval(interval);
                setIsShaking(false);
            }, 10000);

            // タイマーをstateに保存して後でクリアできるようにする
            setTimer({ interval, timeout });

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [isShaking, motion]);

    const startShaking = () => {
        requestPermission().then(() => {
            setIsShaking(true);
        });
    };

    const stopShaking = () => {
        // 計測を手動で停止
        if (timer) {
            clearInterval(timer.interval);
            clearTimeout(timer.timeout);
        }
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
            <button onClick={startShaking}>スマホを振る！</button>
            <button onClick={stopShaking}>停止</button>
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
