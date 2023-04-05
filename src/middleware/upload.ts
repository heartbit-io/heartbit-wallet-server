import multer from 'multer';
import * as path from 'path';
import { Request } from 'express';

const uploadPath = path.resolve(__dirname, '../..', 'files');

const storagePath: multer.StorageEngine = multer.diskStorage({
  destination: uploadPath,
  filename(
    _req: Request,
    file: Express.Multer.File,
    fn: (error: Error | null, filename: string) => void
  ): void {
    fn(
      null,
      `${new Date().getTime().toString()}-${file.fieldname}${path.extname(
        file.originalname
      )}`
    );
  }
});

const uploadFile = multer({
  storage: storagePath,
});

export { uploadFile };
