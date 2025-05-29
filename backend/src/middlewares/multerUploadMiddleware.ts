import multer from "multer";
import { LIMIT_COMMON_FILE_SIZE, ALLOW_COMMON_FILE_TYPES } from "~/utils/validators";

// Function Kiểm tra loại file nào được chấp nhận
const customFileFilter = (req: any, file: any, callback: any) => {
  console.log("multer file", file);

  //Đối với multer, kiểm tra kiểu file thì sử dụng mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = "File type is invalid. Only accept jpg, jpeg and png";
    return callback(errMessage, null);
  }

  //Nếu như kiểu file hợp lệ
  return callback(null, true);
};

//Khởi tạo function upload được bọc bởi multer
const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter,
});

export const multerUploadMiddleware = { upload };
