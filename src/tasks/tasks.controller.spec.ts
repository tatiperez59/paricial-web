import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksController', () => {
  let controller: TasksController;

  const tasksServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
      const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: tasksServiceMock }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('delega la creación a TasksService.create con el DTO', async () => {
      const dto: CreateTaskDto = {
        title: 'Revisión de infraestructura',
        userId: '6af691f7ad6c0c0e2753eaf2',
      };
      const createdTask = {
        _id: '6af73d3a22a971c2257d32ab',
        ...dto,
        completed: false,
      };
      tasksServiceMock.create.mockResolvedValue(createdTask);

      const result = await controller.create(dto);

      expect(tasksServiceMock.create).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdTask);
    });

    it('propaga el NotFoundException del servicio', async () => {
      tasksServiceMock.create.mockRejectedValue(
        new NotFoundException('Usuario no encontrado'),
      );

      await expect(
        controller.create({ title: 'X', userId: '600000000000000000000000' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('devuelve las tareas del servicio', async () => {
      const tasks = [{ title: 'A' }, { title: 'B' }];
      tasksServiceMock.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll();

      expect(tasksServiceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });
  });

  describe('findById', () => {
    it('devuelve la tarea solicitada', async () => {
      const task = { _id: 'abc', title: 'A' };
      tasksServiceMock.findById.mockResolvedValue(task);

      const result = await controller.findById('abc');

      expect(tasksServiceMock.findById).toHaveBeenCalledWith('abc');
      expect(result).toEqual(task);
    });
  });
});
