import React, { useState, useEffect } from 'react';
import useDeviceMotion from './useDeviceMotion';

function App() {
    const { motion, requestPermission } = useDeviceMotion();
    const [maxPunchPower, setMaxPunchPower] = useState(0);
    const [measurements, setMeasurements] = useState([]);
    const [isMeasuring, setIsMeasuring] = useState(false);

    useEffect(() => {
        let interval;
        if (isMeasuring) {
            interval = setInterval(() => {
                const currentPower = Math.sqrt(motion.x ** 2 + motion.y ** 2 + motion.z ** 2);
                if (currentPower > maxPunchPower) {
                    setMaxPunchPower(currentPower);
                }
            }, 100); // 0.1秒ごとにパンチ力を更新
        }

        return () => {
            clearInterval(interval);
            if (isMeasuring) {
                setMeasurements(measurements => [...measurements, maxPunchPower]); // 測定が終了したら測定値を保存
                setIsMeasuring(false);
            }
        };
    }, [isMeasuring, motion.x, motion.y, motion.z, maxPunchPower]);

    const startMeasurement = () => {
        if (measurements.length >= 3) {
            alert("3回の測定が完了しました。");
            return;
        }
        setMaxPunchPower(0); // 最大パンチ力をリセット
        setIsMeasuring(true); // 測定開始
        setTimeout(() => {
            setIsMeasuring(false); // 10秒後に測定終了
        }, 10000);
    };

    const totalPower = measurements.reduce((acc, val) => acc + val, 0); // 合計パンチ力を計算

    return (
        <div>
            <h1>パンチ力測定</h1>
            <button onClick={requestPermission}>Enable Device Motion</button>
            <button onClick={startMeasurement} disabled={isMeasuring}>計測開始</button>
            <p>X軸の加速度: {motion.x?.toFixed(2) || 'Not available'}</p>
            <p>Y軸の加速度: {motion.y?.toFixed(2) || 'Not available'}</p>
            <p>Z軸の加速度: {motion.z?.toFixed(2) || 'Not available'}</p>
            <p>最大パンチ力: {maxPunchPower.toFixed(2)}</p>
            <p>合計パンチ力: {totalPower.toFixed(2)}</p>
            {measurements.map((measure, index) => (
                <p key={index}>セット {index + 1}: {measure.toFixed(2)}</p>
            ))}
        </div>
    );
}

export default App;
