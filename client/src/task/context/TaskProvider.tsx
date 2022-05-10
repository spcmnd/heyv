import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Task } from '../models/task';
import { TaskCreationDto, TaskUpdateDto } from '../models/task.dto';
import taskService from '../services/task-service';

interface ITaskContext {
  currentTask?: Task;
  nextTask?: Task;
  tasks: Task[];
  getTasks: () => Promise<Task[]>;
  getTask: (id: number) => Promise<Task>;
  createTask: (taskCreation: TaskCreationDto) => Promise<Task | undefined>;
  updateTask: (
    id: number,
    taskUpdate: TaskUpdateDto
  ) => Promise<Task | undefined>;
  deleteTask: (id: number) => Promise<void>;
  doneTask: (id: number) => Promise<void>;
}

export const TaskContext = createContext<ITaskContext>({} as ITaskContext);

interface Props {
  children: JSX.Element;
}

export function TaskProvider({ children }: Props): JSX.Element {
  const [currentTask, setCurrentTask] = useState<Task>();
  const [nextTask, setNextTask] = useState<Task>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  const getTasks = useCallback(async (): Promise<Task[]> => {
    const tasks = await taskService.getTasks();

    const nextTask = tasks.length
      ? tasks.reduce((a, b) =>
          a.dueDate!.getTime() - new Date().getTime() <
          b.dueDate!.getTime() - new Date().getTime()
            ? a
            : b
        )
      : undefined;
    setNextTask(nextTask);

    setTasks(
      tasks
        .filter((task) => task.id !== nextTask?.id)
        .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
    );

    return tasks;
  }, []);

  const getTask = useCallback(async (id: number): Promise<Task> => {
    const task = await taskService.getOneTask(id);
    setCurrentTask(task);

    return task;
  }, []);

  const createTask = useCallback(
    async (taskCreation: TaskCreationDto): Promise<Task | undefined> => {
      try {
        const task = await taskService.createTask(taskCreation);
        toast('La tâche a été créée avec succès!', {
          type: 'success',
        });
        navigate('/');

        return task;
      } catch (error: any) {
        for (const err of error.response.data.message) {
          toast('Error: ' + err, {
            type: 'error',
          });
        }
      }
    },
    [navigate]
  );

  const updateTask = useCallback(
    async (
      id: number,
      taskUpdate: TaskUpdateDto
    ): Promise<Task | undefined> => {
      try {
        const task = await taskService.updateTask(id, taskUpdate);
        await getTask(task.id!);
        toast('La tâche a été modifiée avec succès!', {
          type: 'success',
        });
        navigate('/');

        return task;
      } catch (error: any) {
        for (const err of error.response.data.message) {
          toast('Error: ' + err, {
            type: 'error',
          });
        }
      }
    },
    [navigate, getTask]
  );

  async function deleteTask(id: number): Promise<void> {
    try {
      await taskService.deleteTask(id);
      toast('Tâche supprimée avec succès!', { type: 'success' });

      return;
    } catch (error: any) {
      toast("La tâche n'a pas pu être supprimée", { type: 'error' });
    }
  }

  async function doneTask(id: number): Promise<void> {
    try {
      await taskService.doneTask(id);
      toast('Tâche faite avec succès!', { type: 'success' });

      return;
    } catch (error: any) {
      toast(`Error: ${error.data.message[0]}`, { type: 'error' });
    }
  }

  const taskContextValue: ITaskContext = useMemo(
    () => ({
      currentTask,
      nextTask,
      tasks,
      getTasks,
      getTask,
      createTask,
      updateTask,
      deleteTask,
      doneTask,
    }),
    [currentTask, nextTask, createTask, updateTask, tasks, getTasks, getTask]
  );

  return (
    <TaskContext.Provider value={taskContextValue}>
      {children}
    </TaskContext.Provider>
  );
}

export default function useTask(): ITaskContext {
  return useContext(TaskContext);
}
