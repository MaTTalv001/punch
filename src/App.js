import React from 'react';
import useDeviceMotion from './useDeviceMotion';

function App() {
    const motion = useDeviceMotion();

    return (
        <div>
            <h1>パンチ力測定</h1>
            <p>X軸の加速度: {motion.x}</p>
            <p>Y軸の加速度: {motion.y}</p>
            <p>Z軸の加速度: {motion.z}</p>
        </div>
    );
}

export default App;

