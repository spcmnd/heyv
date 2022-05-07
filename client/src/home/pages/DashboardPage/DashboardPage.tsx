import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../../core/components/Button/Button';
import AddIcon from '../../../core/components/icons/AddIcon/AddIcon';
import NextTaskCard from '../../../task/components/NextTaskCard/NextTaskCard';
import TaskList from '../../../task/components/TaskList/TaskList';
import { TaskDto } from '../../../task/models/task.dto';
import taskService from '../../../task/services/task-service';
import './DashboardPage.scss';

function DashboardPage(): JSX.Element {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [nextTask, setNextTask] = useState<TaskDto>();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () =>
    taskService.getTasks().then((tasks: TaskDto[]): void => {
      setTasks(tasks);

      if (tasks.length) {
        setNextTask(
          tasks.reduce((a, b) =>
            new Date(a.dueDate).getTime() - new Date().getTime() <
            new Date(b.dueDate).getTime() - new Date().getTime()
              ? a
              : b
          )
        );
      }
    });

  const doneTask = (task: TaskDto) => {
    taskService
      .doneTask(task.id)
      .then(() => {
        toast('Tâche faite avec succès!', { type: 'success' });
        loadTasks();
      })
      .catch((err: any) =>
        toast(`Error: ${err.data.message[0]}`, { type: 'error' })
      );
  };

  const getNextTask = (): JSX.Element => {
    if (!nextTask) {
      return <p>Il n'y a pas de tâches à faire.</p>;
    }

    return <NextTaskCard task={nextTask} onDoneTask={doneTask} />;
  };

  const getOtherTasks = (): JSX.Element => {
    const otherTasks = tasks
      .filter((t) => t.id !== nextTask?.id)
      .sort((a, b) => (new Date(a.dueDate) < new Date(b.dueDate) ? -1 : 1));

    return <TaskList tasks={otherTasks} onDoneTask={doneTask} />;
  };

  return (
    <div className="DashboardPage">
      <h2>
        Bonjour,
        <br />
        que voulez-vous faire aujourd'hui ?
      </h2>
      <Button
        variant="filled"
        color="primary"
        icon={<AddIcon />}
        onClick={() => navigate('/create')}
      >
        Ajouter nouvelle tâche
      </Button>
      {!!tasks.length ? (
        <>
          <div className="next-task">
            <h3>Prochaine tâche</h3>
            {getNextTask()}
          </div>
          <div className="other-tasks">
            <h3>Tâches en attente</h3>
            {getOtherTasks()}
          </div>
        </>
      ) : (
        <p className="no-tasks">Bien joué, il n'y a aucune tâche à faire!</p>
      )}
    </div>
  );
}

export default DashboardPage;
