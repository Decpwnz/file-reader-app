import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { Response } from 'express';

describe('FilesController', () => {
  let controller: FilesController;
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: {
            scanDirectory: jest.fn(),
            getState: jest
              .fn()
              .mockReturnValue([{ name: 'test.jpg', active: true }]),
          },
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFiles', () => {
    it('should return array of files', () => {
      const result = controller.getFiles();
      expect(result).toEqual([{ name: 'test.jpg', active: true }]);
    });
  });

  describe('scanFiles', () => {
    it('should scan directory and return updated state', async () => {
      const result = await controller.scanFiles();
      expect(service.scanDirectory).toHaveBeenCalled();
      expect(result).toEqual([{ name: 'test.jpg', active: true }]);
    });
  });

  describe('downloadState', () => {
    it('should send state as JSON file', async () => {
      const mockResponse = {
        send: jest.fn(),
      } as unknown as Response;

      await controller.downloadState(mockResponse);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});
