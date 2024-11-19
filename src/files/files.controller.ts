import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { IFile } from './interfaces/file.interface';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('scan')
  async scanFiles(): Promise<IFile[]> {
    try {
      await this.filesService.scanDirectory();
      return this.filesService.getState();
    } catch (error) {
      throw new Error(`Failed to scan files: ${error.message}`);
    }
  }

  @Get('download-state')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename=state.json')
  async downloadState(@Res() res: Response): Promise<void> {
    try {
      const state = this.filesService.getState();
      const stateJson = JSON.stringify(state, null, 2);
      res.send(stateJson);
    } catch (error) {
      throw new Error(`Failed to download state: ${error.message}`);
    }
  }

  @Get('list')
  getFiles(): IFile[] {
    return this.filesService.getState();
  }
}
