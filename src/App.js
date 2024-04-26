import React, { useState, useEffect } from 'react';
import useDeviceMotion from './useDeviceMotion';

function App() {
    const { motion, requestPermission } = useDeviceMotion();
    const [maxPowers, setMaxPowers] = useState([0, 0, 0]);
    const [isMeasuring, setIsMeasuring] = useState([false, false, false]);
    const [gravity, setGravity] = useState({ x: 0, y: 0, z: 0 }); // 重力データを格納する状態
    const [filteredAcceleration, setFilteredAcceleration] = useState({ x: 0, y: 0, z: 0 }); // フィルタされた加速度データ
    const alpha = 0.1; // ローパスフィルタの平滑化係数

    // 加速度データ更新時にフィルタリングを実行
    useEffect(() => {
        // ローパスフィルタで重力を抽出
        const newGravity = {
            x: alpha * motion.x + (1 - alpha) * gravity.x,
            y: alpha * motion.y + (1 - alpha) * gravity.y,
            z: alpha * motion.z + (1 - alpha) * gravity.z
        };
        setGravity(newGravity);

        // ハイパスフィルタで重力成分を除去
        const newFilteredAcceleration = {
            x: motion.x - newGravity.x,
            y: motion.y - newGravity.y,
            z: motion.z - newGravity.z
        };
        setFilteredAcceleration(newFilteredAcceleration);

    }, [motion]);

    // 測定開始
    const startMeasurement = (index) => {
        if (isMeasuring[index]) return;
        setIsMeasuring(prev => prev.map((item, idx) => idx === index ? true : item));

        let maxPunchPower = 0;
        const interval = setInterval(() => {
            const currentPower = Math.sqrt(filteredAcceleration.x ** 2 + filteredAcceleration.y ** 2 + filteredAcceleration.z ** 2);
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
            <p>X軸の加速度: {motion.x.toFixed(2) || 'Not available'}</p>
            <p>Y軸の加速度: {motion.y.toFixed(2) || 'Not available'}</p>
            <p>Z軸の加速度: {motion.z.toFixed(2) || 'Not available'}</p>
            <p>合計パンチ力: {totalPower.toFixed(2)}</p>
        </div>
    );
}

export default App;








