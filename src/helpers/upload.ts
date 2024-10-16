import cloudinary from './cloudinary';

const uploadFile: any = async (file: any, path) => {
  try {
    let url;
    await cloudinary.uploader.upload(
      file,
      {
        folder: path,
        quality: 'auto',
        transformation: [
          { width: 1000, crop: 'scale' },
          { quality: 'auto' },
          { fetch_format: 'webp' },
        ],
      },
      (err: any, result: any) => {
        if (err) {
          return 'Error uploading file';
        }
        url = result.secure_url;
      },
    );
    return url;
  } catch (error) {
    throw { message: 'Unable to upload file', error };
  }
};

export default uploadFile;
