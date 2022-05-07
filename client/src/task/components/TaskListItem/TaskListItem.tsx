import MoreIcon from '../../../core/components/icons/MoreIcon/MoreIcon';
import SuccessIcon from '../../../core/components/icons/SuccessIcon/SuccessIcon';
import getDayDelay from '../../../core/helpers/get-day-delay';
import { TaskDto } from '../../models/task.dto';
import './TaskListItem.scss';

interface Props {
  task: TaskDto;
  onDoneTaskClick: (task: TaskDto) => void;
}

function TaskListItem({ task, onDoneTaskClick }: Props): JSX.Element {
  const dayDelay = getDayDelay(new Date(task.dueDate));

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
