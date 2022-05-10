import { useNavigate } from 'react-router-dom';
import Button from '../../../core/components/Button/Button';
import Card from '../../../core/components/Card/Card';
import SuccessIcon from '../../../core/components/icons/SuccessIcon/SuccessIcon';
import getDayDelay from '../../../core/helpers/get-day-delay';
import useTask from '../../context/TaskProvider';
import { Task } from '../../models/task';
import TaskMoreMenu from '../TaskMoreMenu/TaskMoreMenu';
import './NextTaskCard.scss';

interface Props {
  task: Task;
}

function NextTaskCard({ task }: Props): JSX.Element {
  const dayDelay: number = getDayDelay(task.dueDate!);
  const navigate = useNavigate();
  const { deleteTask, doneTask, getTasks } = useTask();

  const onDeleteTask = () => {
    deleteTask(task.id!).then(() => {
      getTasks();
      navigate('/');
    });
  };

  const onDoneTask = () => {
    doneTask(task.id!).then(() => {
      getTasks();
      navigate('/');
    });
  };

  return (
    <Card className="NextTaskCard" color="secondary">
      <div className="head">
        <p className="title">{task.title}</p>
        <TaskMoreMenu task={task} onTaskDeleted={onDeleteTask} />
      </div>
      <p className="delayed">
        {dayDelay < 1 ? (
          'A faire aujourdhui!'
        ) : (
          <>
            Dépassée depuis {dayDelay} jour{dayDelay > 1 ? 's' : ''}
          </>
        )}
      </p>
      <div className="footer">
        <p className="due-date">{task.dueDate!.toLocaleDateString()}</p>
        <Button
          color="on-light"
          variant="outlined"
          icon={<SuccessIcon />}
          onClick={onDoneTask}
        >
          Fait
        </Button>
      </div>
    </Card>
  );
}

export default NextTaskCard;
