import {Controller,Get,Post,Body,Param,UseGuards} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { TasksService } from './tasks.service';
import { UsersService } from '../users/users.service';
import { CreateTaskDto } from'./dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() payload: CreateTaskDto) {
    await this.usersService.findById(payload.userId);
    return this.taskModel.create(payload);
  }

  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }
}
