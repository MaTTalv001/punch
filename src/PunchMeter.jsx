import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

setUpdateIntervalForType(SensorTypes.accelerometer, 100);  // 100msごとに更新

const PunchMeter = () => {
  const [data, setData] = useState([]);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    let subscription;
    if (isMeasuring) {
      subscription = accelerometer.subscribe(({ x, y, z }) => {
        const force = Math.sqrt(x * x + y * y + z * z);
        setData(prevData => [...prevData, force]);
      });
    }

    return () => subscription && subscription.unsubscribe();
  }, [isMeasuring]);

  const calculateForce = (data) => {
    const maxForce = Math.max(...data);
    const avgForce = data.reduce((acc, val) => acc + val, 0) / data.length;
    const variance = data.reduce((acc, val) => acc + (val - avgForce) ** 2, 0) / data.length;
    const stdDeviation = Math.sqrt(variance);

    return 10 * maxForce + 5 * avgForce - 3 * stdDeviation;  // 係数は例示です
  };

  const startMeasurement = () => {
    setIsMeasuring(true);
    setData([]);
    setTimeout(() => {
      setIsMeasuring(false);
      const totalForce = calculateForce(data);
      setMeasurements(prev => [...prev, totalForce]);
    }, 10000);  // 10秒間測定
  };

  return (
    <View>
      <Button title="計測開始" onPress={startMeasurement} disabled={isMeasuring} />
      {measurements.map((force, index) => (
        <Text key={index}>セット {index + 1}: {force.toFixed(2)}</Text>
      ))}
    </View>
  );
};

export default PunchMeter;
