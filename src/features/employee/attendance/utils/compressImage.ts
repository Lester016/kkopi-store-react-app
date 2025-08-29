import imageCompression from 'browser-image-compression';

const compressImage = async (file: File) => {
  if (file) {
    console.log('Photo size (bytes):', file.size);
    console.log('Photo size (KB):', (file.size / 1024).toFixed(2));
    console.log('Photo size (MB):', (file.size / (1024 * 1024)).toFixed(2));
  }
  const options = {
    maxSizeMB: 1, // force under 1 MB
    maxWidthOrHeight: 1024, // resize
    useWebWorker: true,
  };
  return await imageCompression(file, options);
};

export default compressImage;
