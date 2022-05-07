import { TaskDto } from '../../models/task.dto';
import TaskListItem from '../TaskListItem/TaskListItem';
import './TaskList.scss';

interface Props {
  tasks: TaskDto[];
  onDoneTask: (task: TaskDto) => void;
}

function TaskList({ tasks, onDoneTask }: Props): JSX.Element {
  return (
    <ul className="TaskList">
      {!!tasks.length &&
        tasks.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            onDoneTaskClick={() => onDoneTask && onDoneTask(task)}
          />
        ))}
    </ul>
  );
}

export default TaskList;
