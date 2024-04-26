import React, { useState } from 'react';

function GameApp() {
    const [isShaking, setIsShaking] = useState(false);

    const startShaking = () => {
        console.log("Shaking started");
        setIsShaking(true);
        setTimeout(() => {
            console.log("Shaking stopped after 10 seconds.");
            setIsShaking(false);
        }, 10000);
    };

    return (
        <div>
            <h1>モンスターバトル</h1>
            <button onClick={startShaking} disabled={isShaking}>スマホを振る！</button>
            <p>現在の状態: {isShaking ? "振っています" : "停止中"}</p>
        </div>
    );
}

export default GameApp;




