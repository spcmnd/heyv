import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { TaskCreationDto, TaskDto } from './task.dto';
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
  public async postDoneTaek(@Param('id') id: number): Promise<void> {
    await this.taskService.doneTask(id);

    return;
  }
}
