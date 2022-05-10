import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../core/components/Button/Button';
import AddIcon from '../../../core/components/icons/AddIcon/AddIcon';
import NextTaskCard from '../../../task/components/NextTaskCard/NextTaskCard';
import TaskList from '../../../task/components/TaskList/TaskList';
import useTask from '../../../task/context/TaskProvider';
import './DashboardPage.scss';

function DashboardPage(): JSX.Element {
  const navigate = useNavigate();
  const { nextTask, tasks, getTasks } = useTask();

  useEffect(() => {
    getTasks();
  }, [getTasks]);

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
      {!!tasks.length || nextTask ? (
        <>
          <div className="next-task">
            <h3>Prochaine tâche</h3>
            {nextTask && <NextTaskCard task={nextTask} />}
          </div>
          <div className="other-tasks">
            <h3>Tâches en attente</h3>
            <TaskList tasks={tasks} />
          </div>
        </>
      ) : (
        <p className="no-tasks">Bien joué, il n'y a aucune tâche à faire!</p>
      )}
    </div>
  );
}

export default DashboardPage;
