import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { TaskCreationDto } from './task.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  public async getLatest(): Promise<Task[]> {
    return this.taskRepository.find({
      take: 10,
      where: { dueDate: LessThan(new Date()) },
    });
  }

  public create(taskCreationDto: TaskCreationDto): Promise<Task> {
    const task = new Task();
    task.title = taskCreationDto.title;
    task.occurrence = taskCreationDto.occurrence;
    task.periodicity = taskCreationDto.periodicity;
    task.dueDate = this.getDueDateByPeriodicity(taskCreationDto.periodicity);

    return this.taskRepository.save(task);
  }

  private getDueDateByPeriodicity(periodicity: string): Date {
    const date = new Date();
    date.setDate(date.getDate() + this.getDaysToAdd(periodicity));

    return date;
  }

  private getDaysToAdd(periodicity: string): number {
    switch (periodicity) {
      case 'DAILY':
        return 1;
      case 'WEEKLY':
        return 7;
      case 'MONTHLY':
        return 30;
      case 'ANNUALLY':
        return 365;
      default:
        throw new Error('This periodicity has not been implemented');
    }
  }
}
