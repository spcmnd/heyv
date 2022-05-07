import { PeriodicityEnum } from './periodicity.enum';
import { TaskDto } from './task.dto';

export class Task {
  public id?: number;
  public title?: string;
  public occurence?: number;
  public periodicity?: PeriodicityEnum;
  public dueDate?: Date;

  public fromDto(dto: TaskDto): void {
    this.id = dto.id;
    this.title = dto.title;
    this.occurence = dto.occurrence;
    this.periodicity = dto.periodicity;
    this.dueDate = new Date(dto.dueDate);
  }
}
