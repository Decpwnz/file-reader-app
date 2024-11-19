import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { FilesService } from './files.service';
import { Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import { store } from '../store/store';

jest.mock('fs/promises');
jest.mock('../store/store', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
}));

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('./watched-files'),
          },
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scanDirectory', () => {
    it('should scan directory and update state', async () => {
      const mockFiles = ['file1.jpg', 'file2.jpg'];
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (store.getState as jest.Mock).mockReturnValue({ files: { files: [] } });

      await service.scanDirectory();

      expect(store.dispatch).toHaveBeenCalled();
      expect(fs.readdir).toHaveBeenCalled();
    });

    it('should handle errors when scanning directory', async () => {
      (fs.readdir as jest.Mock).mockRejectedValue(new Error('Test error'));

      await expect(service.scanDirectory()).rejects.toThrow(
        'Failed to scan directory',
      );
    });
  });
});
