import { useState, useEffect } from 'react';

function useDeviceMotion() {
    const [motion, setMotion] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        function handleMotionEvent(event) {
            setMotion({
                x: event.accelerationIncludingGravity.x,
                y: event.accelerationIncludingGravity.y,
                z: event.accelerationIncludingGravity.z
            });
        }

        window.addEventListener('devicemotion', handleMotionEvent);

        return () => {
            window.removeEventListener('devicemotion', handleMotionEvent);
        };
    }, []);

    return motion;
}

export default useDeviceMotion;
