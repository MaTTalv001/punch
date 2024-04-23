import React, { useState } from 'react';
import useDeviceMotion from './useDeviceMotion';

function App() {
    const { motion, requestPermission } = useDeviceMotion();
    const [maxPunchPower, setMaxPunchPower] = useState(0);

    const calculatePunchPower = () => {
        const currentPower = Math.sqrt(motion.x ** 2 + motion.y ** 2 + motion.z ** 2);
        if (currentPower > maxPunchPower) {
            setMaxPunchPower(currentPower);
        }
    };

    return (
        <div>
            <h1>パンチ力測定</h1>
            <button onClick={() => { requestPermission(); calculatePunchPower(); }}>Enable Device Motion</button>
            <p>X軸の加速度: {motion.x || 'Not available'}</p>
            <p>Y軸の加速度: {motion.y || 'Not available'}</p>
            <p>Z軸の加速度: {motion.z || 'Not available'}</p>
            <p>最大パンチ力: {maxPunchPower.toFixed(2) || 'Not available'}</p>
        </div>
    );
}

export default App;

