import { useEffect, useState } from 'react';

interface ElapsedTimeProps {
  clockInTime: string;
  clockOutTime?: string; // optional, stop counting if provided
}

const ElapsedTime = ({ clockInTime, clockOutTime }: ElapsedTimeProps) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    if (!clockInTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const end = clockOutTime ? new Date(clockOutTime).getTime() : now;

      // If clockOutTime has passed, freeze at that time and stop ticking
      if (clockOutTime && now >= end) {
        clearInterval(interval);
        setTime(getElapsedTime(clockInTime, end));
        return;
      }

      setTime(getElapsedTime(clockInTime, end));
    }, 1000);

    return () => clearInterval(interval);
  }, [clockInTime, clockOutTime]);

  return (
    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-center shadow-sm">
      <p className="text-xs font-medium uppercase">Hours</p>
      <p className="text-lg font-semibold">{time}</p>
    </div>
  );
};

const getElapsedTime = (clockInTime: string, endTime?: number): string => {
  const start = new Date(clockInTime).getTime();
  const end = endTime ?? Date.now();
  const diff = end - start;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export default ElapsedTime;
