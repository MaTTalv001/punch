import React, { useState, useEffect } from 'react';
import useDeviceMotion from './useDeviceMotion';

function App() {
    const { motion, requestPermission } = useDeviceMotion();
    const [velocity, setVelocity] = useState({ x: 0, y: 0, z: 0 });
    const [isMeasuring, setIsMeasuring] = useState(false);

    useEffect(() => {
        let lastTime = Date.now();

        if (isMeasuring) {
            const interval = setInterval(() => {
                const currentTime = Date.now();
                const dt = (currentTime - lastTime) / 1000.0; // 秒単位で時間間隔を計算
                lastTime = currentTime;

                setVelocity(vel => ({
                    x: vel.x + motion.x * dt,
                    y: vel.y + motion.y * dt,
                    z: vel.z + motion.z * dt
                }));
            }, 100);

            return () => clearInterval(interval);
        }
    }, [isMeasuring, motion]);

    const startMeasurement = () => {
        setIsMeasuring(true);
        setTimeout(() => setIsMeasuring(false), 10000); // 10秒後に計測を停止
    };

    return (
        <div>
            <h1>パンチ速度測定</h1>
            <button onClick={requestPermission}>Enable Device Motion</button>
            <button onClick={startMeasurement} disabled={isMeasuring}>計測開始</button>
            <p>X軸の速度: {velocity.x.toFixed(2)} m/s</p>
            <p>Y軸の速度: {velocity.y.toFixed(2)} m/s</p>
            <p>Z軸の速度: {velocity.z.toFixed(2)} m/s</p>
        </div>
    );
}

export default App;


