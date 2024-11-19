import { Controller, Get } from '@nestjs/common';
import { FilesService } from './files.service';
import { IFile } from './interfaces/file.interface';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('list')
  getFiles(): IFile[] {
    return this.filesService.getState();
  }

  @Get('scan')
  async scanFiles(): Promise<IFile[]> {
    await this.filesService.scanDirectory();
    return this.filesService.getState();
  }

  @Get('download-state')
  getState(): IFile[] {
    return this.filesService.getState();
  }
}
