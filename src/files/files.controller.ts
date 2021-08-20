import { Controller, Get, HttpCode, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileItemResponse } from './dto/file-item.response';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) { }

	@Post('upload')
	@HttpCode(200)
	//@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	async uploadFiles(@UploadedFile() file: Express.Multer.File): Promise<FileItemResponse[]> {
		return this.filesService.saveFiles([file]);
	}
}
