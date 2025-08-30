import { Camera } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../../../../shared/components/Button';
import dataURLtoFile from '../utils/dataUrlToFile';

type Props = {
  photo: File | null;
  setPhoto: (file: File | null) => void;
};

const CameraCapture = ({ photo, setPhoto }: Props) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsCapturing(false);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    const file = dataURLtoFile(dataUrl, 'selfie.jpg');
    setPhoto(file);
    stopCamera();
  };

  const stopCamera = () => {
    setIsCapturing(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  if (!photo && !isCapturing) {
    return (
      <div
        onClick={startCamera}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-gray-400 transition mb-5"
      >
        <Camera className="text-gray-500 w-10 h-10 mb-2" />
        <p className="text-gray-500 text-sm">Take a selfie</p>
      </div>
    );
  }

  if (isCapturing) {
    return (
      <div className="flex flex-col items-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-xl border mb-2 w-80 h-60 object-cover"
        />
        <Button variant="secondary" onClick={takePhoto} className="mt-2">
          Capture
        </Button>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  if (photo) {
    return (
      <div className="flex flex-col items-center">
        <img
          src={URL.createObjectURL(photo)}
          alt="Selfie"
          className="rounded-xl border mb-2 w-80 h-60 object-cover"
        />
        <Button variant="secondary" onClick={() => setPhoto(null)}>
          Retake
        </Button>
      </div>
    );
  }

  return null;
};

export default CameraCapture;
