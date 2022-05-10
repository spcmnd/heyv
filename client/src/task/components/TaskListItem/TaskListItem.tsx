import { useNavigate } from 'react-router-dom';
import SuccessIcon from '../../../core/components/icons/SuccessIcon/SuccessIcon';
import getDayDelay from '../../../core/helpers/get-day-delay';
import useTask from '../../context/TaskProvider';
import { Task } from '../../models/task';
import TaskMoreMenu from '../TaskMoreMenu/TaskMoreMenu';
import './TaskListItem.scss';

interface Props {
  task: Task;
}

function TaskListItem({ task }: Props): JSX.Element {
  const navigate = useNavigate();
  const dayDelay = getDayDelay(task.dueDate!);
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
    <li className="TaskListItem">
      <p className="title">{task.title}</p>
      <p className="delay-time">{dayDelay > 1 ? `+${dayDelay}j` : ''}</p>
      <div className="actions">
        <SuccessIcon onClick={onDoneTask} />
        <TaskMoreMenu task={task} onTaskDeleted={onDeleteTask} />
      </div>
    </li>
  );
}

export default TaskListItem;
