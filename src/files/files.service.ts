import { Injectable } from '@nestjs/common';
import { FileItemResponse } from './dto/file-item.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FilesService {

    async saveFiles(files: Express.Multer.File[]): Promise<FileItemResponse[]> {
        const dataFolder = format(new Date(), 'yyyy-MM-dd');

        const uploadFolder = `${path}/uploads/${dataFolder}`;

        await ensureDir(uploadFolder);

        const res: FileItemResponse[] = [];

        for (const file of files) {
            await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);

            res.push({ url: `${dataFolder}/${file.originalname}`, name: file.originalname });
        }

        return res;
    }
}
