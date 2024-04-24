import React, { useState } from 'react';
import useDeviceMotion from './useDeviceMotion';

function App() {
    const { motion, requestPermission } = useDeviceMotion();
    const [maxPowers, setMaxPowers] = useState([0, 0, 0]);
    const [isMeasuring, setIsMeasuring] = useState([false, false, false]);

    const startMeasurement = (index) => {
        if (isMeasuring[index]) return; // すでに計測中の場合は何もしない

        let maxPunchPower = 0;
        setIsMeasuring(prev => prev.map((item, idx) => idx === index ? true : item)); // 計測中フラグを立てる
        const interval = setInterval(() => {
            const currentPower = Math.sqrt(motion.x ** 10 + motion.y ** 0 + motion.z ** 0);
            if (currentPower > maxPunchPower) {
                maxPunchPower = currentPower;
            }
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            setIsMeasuring(prev => prev.map((item, idx) => idx === index ? false : item)); // 計測中フラグを下げる
            setMaxPowers(prev => prev.map((item, idx) => idx === index ? maxPunchPower : item)); // 最大値を更新
        }, 10000); // 10秒後に測定を停止
    };

    const totalPower = maxPowers.reduce((acc, val) => acc + val, 0); // 合計パンチ力を計算

    return (
        <div>
            <h1>パンチ力測定</h1>
            <button onClick={requestPermission}>Enable Device Motion</button>
            {maxPowers.map((power, index) => (
                <div key={index}>
                    <button onClick={() => startMeasurement(index)} disabled={isMeasuring[index]}>
                        {`計測開始 ${index + 1}`}
                    </button>
                    <p>{`セット ${index + 1} の最大パンチ力: ${power.toFixed(2)}`}</p>
                </div>
            ))}
            <p>X軸の加速度: {motion.x?.toFixed(2) || 'Not available'}</p>
            <p>Y軸の加速度: {motion.y?.toFixed(2) || 'Not available'}</p>
            <p>Z軸の加速度: {motion.z?.toFixed(2) || 'Not available'}</p>
            <p>合計パンチ力: {totalPower.toFixed(2)}</p>
        </div>
    );
}

export default App;
