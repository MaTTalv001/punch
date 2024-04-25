import React, { useState, useEffect } from 'react';
import useDeviceMotion from './useDeviceMotion';

function App() {
    const { motion, requestPermission } = useDeviceMotion();
    const [maxPowers, setMaxPowers] = useState([0, 0, 0]);
    const [isMeasuring, setIsMeasuring] = useState([false, false, false]);
    const [gravity, setGravity] = useState({ x: 0, y: 0, z: 0 });
    const alpha = 0.8; // 重力データの平滑化に使用する係数

    useEffect(() => {
        // 重力データの平滑化を行う
        setGravity(g => ({
            x: alpha * g.x + (1 - alpha) * motion.x,
            y: alpha * g.y + (1 - alpha) * motion.y,
            z: alpha * g.z + (1 - alpha) * motion.z
        }));
    }, [motion]);

    const startMeasurement = (index) => {
        if (isMeasuring[index]) return;

        let maxPunchPower = 0;
        setIsMeasuring(prev => prev.map((item, idx) => idx === index ? true : item));

        const interval = setInterval(() => {
            // 重力成分を除去した加速度を計算
            const correctedAcceleration = {
                x: motion.x - gravity.x,
                y: motion.y - gravity.y,
                z: motion.z - gravity.z
            };
            const currentPower = 80 * Math.sqrt(correctedAcceleration.x ** 2 + correctedAcceleration.y ** 2 + correctedAcceleration.z ** 2);
            
            if (currentPower > maxPunchPower) {
                maxPunchPower = currentPower;
            }
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            setIsMeasuring(prev => prev.map((item, idx) => idx === index ? false : item));
            setMaxPowers(prev => prev.map((item, idx) => idx === index ? maxPunchPower : item));
        }, 10000); // 10秒後に測定を停止
    };

    const totalPower = maxPowers.reduce((acc, val) => acc + val, 0);

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








