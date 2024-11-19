import { Injectable, Logger } from '@nestjs/common';
import { IFile } from './interfaces/file.interface';
import * as fs from 'fs/promises';
import { store } from '../store/store';
import { setFiles, updateFileStatus } from '../store/filesSlice';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly watchDirectory: string;

  constructor() {
    this.watchDirectory = './watched-files';
  }

  async onApplicationBootstrap() {
    try {
      await fs.access(this.watchDirectory);
    } catch {
      await fs.mkdir(this.watchDirectory, { recursive: true });
    }

    await this.scanDirectory();
  }

  async scanDirectory(): Promise<void> {
    try {
      const files = await fs.readdir(this.watchDirectory);
      const newState = files.map((file) => ({
        name: file,
        active: true,
      }));

      this.updateState(newState);
    } catch (error) {
      this.logger.error(`Error scanning directory: ${error.message}`);
      throw error;
    }
  }

  private updateState(newFiles: IFile[]): void {
    const currentState = store.getState().files.files;

    const updatedState = currentState.map((existingFile) => ({
      ...existingFile,
      active: newFiles.some((newFile) => newFile.name === existingFile.name),
    }));
    store.dispatch(updateFileStatus(updatedState));

    const existingFileNames = updatedState.map((file) => file.name);
    const newFileEntries = newFiles.filter(
      (newFile) => !existingFileNames.includes(newFile.name),
    );

    if (newFileEntries.length > 0) {
      const finalState = [...updatedState, ...newFileEntries];
      store.dispatch(setFiles(finalState));
    }
  }

  getState(): IFile[] {
    return store.getState().files.files;
  }
}
