import React, { useState } from 'react';
import useDeviceMotion from './useDeviceMotion';

function App() {
    const { motion, requestPermission } = useDeviceMotion();
    const [maxPowers, setMaxPowers] = useState([0, 0, 0]);
    const [isMeasuring, setIsMeasuring] = useState([false, false, false]);
    const [velocities, setVelocities] = useState([0, 0, 0]); // 各セットの速度を保持するステート

    const startMeasurement = (index) => {
        if (isMeasuring[index]) return;

        let maxPunchPower = 0;
        let velocity = 0; // 速度の初期値
        setIsMeasuring(prev => prev.map((item, idx) => idx === index ? true : item));

        const interval = setInterval(() => {
            const currentPower = Math.sqrt(motion.x ** 2 + motion.y ** 2 + motion.y ** 2);
            const currentTime = Date.now();
            const dt = (currentTime - velocities[index]) / 1000.0; // 前回からの時間差分
            velocity += currentPower * dt; // 速度は加速度に時間を掛けたものを積算
            setVelocities(prev => prev.map((item, idx) => idx === index ? currentTime : item));

            if (velocity > maxPunchPower) {
                maxPunchPower = velocity;
            }
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            setIsMeasuring(prev => prev.map((item, idx) => idx === index ? false : item));
            setMaxPowers(prev => prev.map((item, idx) => idx === index ? maxPunchPower : item));
        }, 10000);
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





