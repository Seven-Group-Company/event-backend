import * as QRCode from 'qrcode';
import uploadFile from './upload';

export const generateQR = async (text: any): Promise<string> => {
  try {
    const data = await QRCode.toDataURL(text);
    return await uploadFile(data, 'mfa/qrcodes');
  } catch (err) {
    return err;
  }
};
