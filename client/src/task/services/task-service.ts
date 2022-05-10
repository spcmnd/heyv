import { AxiosResponse } from 'axios';
import heyvHttp from '../../core/http/heyv-http';
import { Task } from '../models/task';
import { TaskCreationDto, TaskDto, TaskUpdateDto } from '../models/task.dto';

const taskApiUrl = '/task';

function getTasks(): Promise<Task[]> {
  return heyvHttp
    .get<TaskDto[]>(taskApiUrl)
    .then((response) => response.data)
    .then((taskDtos: TaskDto[]) =>
      taskDtos.map((t) => {
        const task = new Task();
        task.fromDto(t);

        return task;
      })
    );
}

function createTask(task: TaskCreationDto): Promise<Task> {
  return heyvHttp
    .post<TaskCreationDto, AxiosResponse<TaskDto, any>>(taskApiUrl, task)
    .then((response) => response.data)
    .then((taskDto: TaskDto) => {
      const task = new Task();
      task.fromDto(taskDto);

      return task;
    });
}

function doneTask(id: number): Promise<void> {
  return heyvHttp.post(`${taskApiUrl}/${id}/done`);
}

function updateTask(id: number, task: TaskUpdateDto): Promise<Task> {
  return heyvHttp
    .put(`${taskApiUrl}/${id}`, task)
    .then((response) => response.data)
    .then((taskDto: TaskDto) => {
      const task = new Task();
      task.fromDto(taskDto);

      return task;
    });
}

function deleteTask(id: number): Promise<void> {
  return heyvHttp.delete(`${taskApiUrl}/${id}`);
}

function getOneTask(id: number): Promise<Task> {
  return heyvHttp
    .get(`${taskApiUrl}/${id}`)
    .then((response) => response.data)
    .then((taskDto: TaskDto) => {
      const task = new Task();
      task.fromDto(taskDto);

      return task;
    });
}

const taskService = Object.freeze({
  getTasks,
  createTask,
  doneTask,
  updateTask,
  deleteTask,
  getOneTask,
});

export default taskService;
