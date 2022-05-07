import { AxiosResponse } from 'axios';
import heyvHttp from '../../core/http/heyv-http';
import { TaskCreationDto, TaskDto } from '../models/task.dto';

const taskApiUrl = '/task';

function getTasks(): Promise<TaskDto[]> {
  return heyvHttp.get<TaskDto[]>(taskApiUrl).then((response) => response.data);
}

function createTask(task: TaskCreationDto): Promise<TaskDto> {
  return heyvHttp
    .post<TaskCreationDto, AxiosResponse<TaskDto, any>>(taskApiUrl, task)
    .then((response) => response.data);
}

function doneTask(id: number): Promise<unknown> {
  return heyvHttp.post(`${taskApiUrl}/${id}/done`);
}

const taskService = Object.freeze({
  getTasks,
  createTask,
  doneTask,
});

export default taskService;
