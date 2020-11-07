import { Crud } from './crud.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CrudService } from './crud.service';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CrudService', () => {
  let service: CrudService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrudService,
        { provide: Connection, useValue: createMockRepository() },
        {
          provide: getRepositoryToken(Crud),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CrudService>(CrudService);
    repository = module.get<MockRepository>(getRepositoryToken(Crud));
  });

  describe('general', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('findOne', () => {
    describe('when exists', () => {
      it('should return object', async () => {
        const id = 1;
        const expectedRes = {};
        repository.findOne.mockReturnValue(expectedRes);

        const res = await service.findOne(id);
        expect(res).toEqual(expectedRes);
      });
    });
    describe('when not exists', () => {
      it('should return NotFoundException', async () => {
        const id = 1;
        repository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(id);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
