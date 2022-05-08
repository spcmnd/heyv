import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SuccessIcon from '../../../core/components/icons/SuccessIcon/SuccessIcon';
import getDayDelay from '../../../core/helpers/get-day-delay';
import { Task } from '../../models/task';
import taskService from '../../services/task-service';
import TaskMoreMenu from '../TaskMoreMenu/TaskMoreMenu';
import './TaskListItem.scss';

interface Props {
  task: Task;
  onDoneTaskClick: (task: Task) => void;
  onDeleteTaskClick: () => void;
}

function TaskListItem({
  task,
  onDoneTaskClick,
  onDeleteTaskClick,
}: Props): JSX.Element {
  const navigate = useNavigate();
  const dayDelay = getDayDelay(task.dueDate!);

  const onDeleteTask = () => {
    taskService
      .deleteTask(task.id!)
      .then(() => {
        onDeleteTaskClick && onDeleteTaskClick();
        navigate('/');
      })
      .catch(() => {
        toast("La tâche n'a pas pu être supprimée", { type: 'error' });
        navigate('/');
      });
  };

  return (
    <li className="TaskListItem">
      <p className="title">{task.title}</p>
      <p className="delay-time">{dayDelay > 1 ? `+${dayDelay}j` : ''}</p>
      <div className="actions">
        <SuccessIcon onClick={() => onDoneTaskClick(task)} />
        <TaskMoreMenu task={task} onTaskDeleted={onDeleteTask} />
      </div>
    </li>
  );
}

export default TaskListItem;
