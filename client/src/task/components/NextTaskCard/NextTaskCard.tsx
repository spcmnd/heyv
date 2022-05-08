import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../../core/components/Button/Button';
import Card from '../../../core/components/Card/Card';
import SuccessIcon from '../../../core/components/icons/SuccessIcon/SuccessIcon';
import getDayDelay from '../../../core/helpers/get-day-delay';
import { Task } from '../../models/task';
import taskService from '../../services/task-service';
import TaskMoreMenu from '../TaskMoreMenu/TaskMoreMenu';
import './NextTaskCard.scss';

interface Props {
  task: Task;
  onDoneTask?: (task: Task) => void;
  onDeleteTask?: () => void;
}

function NextTaskCard({ task, onDoneTask }: Props): JSX.Element {
  const dueDate: Date = task.dueDate!;
  const dayDelay: number = getDayDelay(dueDate);
  const navigate = useNavigate();

  const onDeleteTask = () => {
    taskService
      .deleteTask(task.id!)
      .then(() => {
        navigate('/');
        onDeleteTask && onDeleteTask();
      })
      .catch(() => {
        toast("La tâche n'a pas pu être supprimée", { type: 'error' });
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
        <p className="due-date">{dueDate.toLocaleDateString()}</p>
        <Button
          color="on-light"
          variant="outlined"
          icon={<SuccessIcon />}
          onClick={() => onDoneTask && onDoneTask(task)}
        >
          Fait
        </Button>
      </div>
    </Card>
  );
}

export default NextTaskCard;
