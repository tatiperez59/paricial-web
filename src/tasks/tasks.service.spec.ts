import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { Task } from './schemas/task.schema';
import { UsersService } from '../users/users.service';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksService', () => {
  let service: TasksService;

  const taskModelMock = {
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  const usersServiceMock = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken(Task.name), useValue: taskModelMock },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateTaskDto = {
      title: 'Revisión de infraestructura',
      userId: '6af691f7ad6c0c0e2753eaf2',
    };

    it('valida el usuario con UsersService y guarda la tarea', async () => {
      
      usersServiceMock.findById.mockResolvedValue({
        _id: dto.userId,
        name: 'Maria Garcia',
      });
      const createdTask = {
        _id: '6af73d3a22a971c2257d32ab',
        ...dto,
        completed: false,
      };
      taskModelMock.create.mockResolvedValue(createdTask);

      const result = await service.create(dto);

      expect(usersServiceMock.findById).toHaveBeenCalledWith(dto.userId);
      expect(taskModelMock.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdTask);
    });

    it('lanza NotFoundException y no guarda si el usuario no existe', async () => {
   
      usersServiceMock.findById.mockRejectedValue(
        new NotFoundException(`Usuario con ID ${dto.userId} no encontrado`),
      );

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(taskModelMock.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('devuelve todas las tareas', async () => {
      const tasks = [{ title: 'A' }];
      taskModelMock.exec.mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(taskModelMock.find).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });
  });

  describe('findById', () => {
    it('devuelve la tarea si existe', async () => {
      const task = { _id: 'abc', title: 'A' };
      taskModelMock.exec.mockResolvedValue(task);

      const result = await service.findById('abc');

      expect(taskModelMock.findById).toHaveBeenCalledWith('abc');
      expect(result).toEqual(task);
    });

    it('lanza NotFoundException si la tarea no existe', async () => {
      taskModelMock.exec.mockResolvedValue(null);

      await expect(service.findById('abc')).rejects.toThrow(NotFoundException);
    });
  });
});
