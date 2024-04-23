import React from 'react';
import useDeviceMotion from './useDeviceMotion';

function App() {
    const { motion, requestPermission } = useDeviceMotion();

    return (
        <div>
            <h1>パンチ力測定</h1>
            <button onClick={requestPermission}>Enable Device Motion</button>
            <p>X軸の加速度: {motion.x || 'Not available'}</p>
            <p>Y軸の加速度: {motion.y || 'Not available'}</p>
            <p>Z軸の加速度: {motion.z || 'Not available'}</p>
        </div>
    );
}

export default App;


