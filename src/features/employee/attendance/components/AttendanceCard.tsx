import { useState } from 'react';
import { Button } from '../../../../shared/components/Button';
import CameraCapture from './CameraCapture';
import ElapsedTime from './ElapsedTime';

type Props = {
  timeIn: string | null;
  timeOut: string | null;
  loading: boolean;
  errorMessage: string | null;
  onClockIn: (photo: File | null) => Promise<void>;
  onClockOut: (photo: File | null) => Promise<void>;
};

const AttendanceCard = ({
  timeIn,
  timeOut,
  loading,
  errorMessage,
  onClockIn,
  onClockOut,
}: Props) => {
  const [photo, setPhoto] = useState<File | null>(null);

  const currentDate = new Date().toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const handleClockIn = async () => {
    await onClockIn(photo);
    setPhoto(null); // ✅ reset after success
  };

  const handleClockOut = async () => {
    await onClockOut(photo);
    setPhoto(null); // ✅ reset after success
  };

  const renderButton = () => {
    if (timeIn) {
      return (
        <Button variant="danger" onClick={handleClockOut} fullWidth>
          Clock Out
        </Button>
      );
    }
    return (
      <Button variant="primary" onClick={handleClockIn} fullWidth>
        Clock In
      </Button>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Attendance</h2>
          <p className="text-gray-500 text-sm mb-4">{currentDate}</p>
        </div>
        {timeIn && <ElapsedTime clockInTime={timeIn} clockOutTime={timeOut ?? undefined} />}
      </div>

      {/* CameraCapture fully encapsulates camera */}
      <CameraCapture photo={photo} setPhoto={setPhoto} />

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
          {errorMessage}
        </div>
      )}

      {loading ? <p className="text-gray-500 text-sm">Loading...</p> : renderButton()}
    </div>
  );
};

export default AttendanceCard;
