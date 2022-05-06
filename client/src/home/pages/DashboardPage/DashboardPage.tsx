import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../core/components/Button/Button';
import AddIcon from '../../../core/components/icons/AddIcon/AddIcon';
import heyvHttp from '../../../core/http/heyv-http';
import NextTaskCard from '../../../task/components/NextTaskCard/NextTaskCard';
import { TaskDto } from '../../../task/models/task.dto';
import './DashboardPage.scss';

function DashboardPage(): JSX.Element {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskDto[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () =>
    heyvHttp
      .get('/task')
      .then((response: AxiosResponse<TaskDto[]>): TaskDto[] => response.data)
      .then((tasks: TaskDto[]): void => setTasks(tasks));

  const nextTask = (): JSX.Element => {
    let task: TaskDto | undefined = undefined;

    for (const t of tasks) {
      if (!task) {
        task = t;
      }

      if (new Date(task.dueDate) > new Date(t.dueDate)) {
        task = t;
      }
    }

    if (!task) {
      return <p>Il n'y a pas de tâches à faire.</p>;
    }

    return <NextTaskCard task={task} onDoneTask={loadTasks} />;
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
      {!!tasks.length && (
        <>
          <h3>Prochaine tâche</h3>
          {nextTask()}
        </>
      )}
    </div>
  );
}

export default DashboardPage;
