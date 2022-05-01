import { Body, Controller, Post } from '@nestjs/common';
import { TaskCreationDto, TaskDto } from './task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  public async postTask(
    @Body() taskCreationDto: TaskCreationDto,
  ): Promise<TaskDto> {
    const task = await this.taskService.create(taskCreationDto);

    return task.toDto();
  }
}
