import React, { useState, useEffect } from 'react';
import useDeviceMotion from './useDeviceMotion';

function GameApp() {
    const { motion, requestPermission } = useDeviceMotion();
    const [energy, setEnergy] = useState(0);
    const [monsterHealth, setMonsterHealth] = useState(100);
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        const updateEnergy = () => {
            const shakePower = Math.sqrt(motion.x ** 2 + motion.y ** 2 + motion.z ** 2);
            if (shakePower > 10) { // シェイクのしきい値を設定
                setEnergy(prevEnergy => prevEnergy + shakePower);
            }
        };

        if (isShaking) {
            const interval = setInterval(updateEnergy, 100);
            return () => clearInterval(interval);
        }
    }, [isShaking, motion]);

    const startShaking = () => {
        requestPermission().then(() => {
            setIsShaking(true);
        });
    };

    const stopShaking = () => {
        setIsShaking(false);
    };

    const useEnergy = () => {
        if (energy > 0) {
            const damage = energy / 10; // エネルギーをダメージに変換
            setMonsterHealth(prevHealth => Math.max(prevHealth - damage, 0));
            setEnergy(0); // エネルギーをリセット
        }
    };

    return (
        <div>
            <h1>モンスターバトル</h1>
            <div>モンスターの体力: {monsterHealth}</div>
            <div>蓄積エネルギー: {energy.toFixed(2)}</div>
            <button onMouseDown={startShaking} onMouseUp={stopShaking}>
                スマホを振る！
            </button>
            <button onClick={useEnergy} disabled={energy <= 0}>
                必殺技発動！
            </button>
        </div>
    );
}

export default GameApp;
