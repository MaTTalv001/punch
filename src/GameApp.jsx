import React, { useState, useEffect } from 'react';
import useDeviceMotion from './useDeviceMotion';

function GameApp() {
    const { motion, requestPermission } = useDeviceMotion();
    const [energy, setEnergy] = useState(0);
    const [monsterHealth, setMonsterHealth] = useState(100);
    const [isShaking, setIsShaking] = useState(false);
    const [timerButtonDisabled, setTimerButtonDisabled] = useState(false);

    useEffect(() => {
        let animationFrameId;
        const startTime = Date.now();

        const updateEnergy = () => {
            if (Date.now() - startTime >= 10000) {  // 10秒経過チェック
                console.log("Shaking auto-stopped after 10 seconds.");
                setIsShaking(false);
                cancelAnimationFrame(animationFrameId);
                return;
            }

            const shakePower = 50 * Math.sqrt(motion.x ** 2 + motion.y ** 2 + motion.z ** 2);
            if (shakePower > 0.1) {
                setEnergy(prevEnergy => prevEnergy + shakePower);
            }
            animationFrameId = requestAnimationFrame(updateEnergy);
        };

        if (isShaking) {
            animationFrameId = requestAnimationFrame(updateEnergy);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            console.log("Cleanup done.");
        };
    }, [isShaking, motion]);

    const startShaking = () => {
        requestPermission().then(() => {
            console.log("Permission granted and shaking is set to true.");
            setIsShaking(true);
        }).catch(err => {
            console.error("Permission request failed", err);
        });
    };

    const stopShaking = () => {
        setIsShaking(false);
        console.log("Shaking manually stopped.");
    };

    const useEnergy = () => {
        if (energy > 0) {
            const damage = energy / 10;
            setMonsterHealth(prevHealth => Math.max(prevHealth - damage, 0));
            setEnergy(0);
        }
    };

    const handleTimerButtonClick = () => {
        setTimerButtonDisabled(true);
        setTimeout(() => {
            alert('10 seconds passed!');
            setTimerButtonDisabled(false);
        }, 10000);
    };

    return (
        <div>
            <h1>モンスターバトル</h1>
            <button onClick={startShaking} disabled={isShaking}>スマホを振る！</button>
            <button onClick={stopShaking} disabled={!isShaking}>停止</button>
            <button onClick={useEnergy} disabled={energy <= 0}>必殺技発動！</button>
            <button onClick={handleTimerButtonClick} disabled={timerButtonDisabled}>Timer Test Button</button>
            <div>モンスターの体力: {monsterHealth}</div>
            <div>蓄積エネルギー: {energy.toFixed(2)}</div>
            <p>X軸の加速度: {motion.x?.toFixed(2) || 'Not available'}</p>
            <p>Y軸の加速度: {motion.y?.toFixed(2) || 'Not available'}</p>
            <p>Z軸の加速度: {motion.z?.toFixed(2) || 'Not available'}</p>
        </div>
    );
}

export default GameApp;



