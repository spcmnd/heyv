import MoreIcon from '../../../core/components/icons/MoreIcon/MoreIcon';
import SuccessIcon from '../../../core/components/icons/SuccessIcon/SuccessIcon';
import getDayDelay from '../../../core/helpers/get-day-delay';
import { Task } from '../../models/task';
import './TaskListItem.scss';

interface Props {
  task: Task;
  onDoneTaskClick: (task: Task) => void;
}

function TaskListItem({ task, onDoneTaskClick }: Props): JSX.Element {
  const dayDelay = getDayDelay(task.dueDate!);

  return (
    <li className="TaskListItem">
      <p className="title">{task.title}</p>
      <p className="delay-time">{dayDelay > 1 ? `+${dayDelay}j` : ''}</p>
      <div className="actions">
        <SuccessIcon onClick={() => onDoneTaskClick(task)} />
        <MoreIcon />
      </div>
    </li>
  );
}

export default TaskListItem;
