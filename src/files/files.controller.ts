import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
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
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename=state.json')
  async downloadState(@Res() res: Response): Promise<void> {
    const state = this.filesService.getState();
    const stateJson = JSON.stringify(state, null, 2);
    res.send(stateJson);
  }
}
