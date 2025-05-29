import cloudinary from "cloudinary";
import streamifier from "streamifier";
import { ENV } from "~/config/environments";

// Cấu hình cloudinary
const cloudinaryV2 = cloudinary.v2;
cloudinaryV2.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

//Khởi tạo 1 cái func để thực hiện upload file lên cloudinary
const streamUpload = (fileBuffer: any, folderName: any) => {
  return new Promise((resolve, reject) => {
    // Tạo một cái luồng stream upload lên cloudinary
    const stream = cloudinaryV2.uploader.upload_stream({ folder: folderName }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });

    // Thực hiện upload cái luồng trên bằng lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const CloudinaryProvider = { streamUpload };
