import { Task } from '../../models/task';
import TaskListItem from '../TaskListItem/TaskListItem';
import './TaskList.scss';

interface Props {
  tasks: Task[];
  onDoneTask: (task: Task) => void;
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
