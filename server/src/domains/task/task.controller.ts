import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  TaskCreationDto,
  TaskDto,
  TaskIdParams,
  TaskUpdateDto,
} from './task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  public async getLastestTasks(): Promise<TaskDto[]> {
    const tasks = await this.taskService.getLatest();

    return tasks.map((t) => t.toDto());
  }

  @Post()
  public async postTask(
    @Body() taskCreationDto: TaskCreationDto,
  ): Promise<TaskDto> {
    const task = await this.taskService.create(taskCreationDto);

    return task.toDto();
  }

  @Post('/:id/done')
  @HttpCode(204)
  public async postDoneTask(@Param() params: TaskIdParams): Promise<void> {
    await this.taskService.doneTask(params.id);

    return;
  }

  @Put('/:id')
  public async updateTask(
    @Param() params: TaskIdParams,
    @Body() taskUpdateDto: TaskUpdateDto,
  ): Promise<TaskDto> {
    const updatedTask = await this.taskService.modifyTask(
      params.id,
      taskUpdateDto,
    );

    return updatedTask.toDto();
  }

  @Get('/:id')
  public async getOneTask(@Param() params: TaskIdParams): Promise<TaskDto> {
    const task = await this.taskService.getOne(params.id);

    return task.toDto();
  }

  @Delete('/:id')
  @HttpCode(204)
  public async deleteTask(@Param() params: TaskIdParams): Promise<void> {
    await this.taskService.deleteTask(params.id);

    return;
  }
}
