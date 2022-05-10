import { Task } from '../../models/task';
import TaskListItem from '../TaskListItem/TaskListItem';
import './TaskList.scss';

interface Props {
  tasks: Task[];
}

function TaskList({ tasks }: Props): JSX.Element {
  return (
    <ul className="TaskList">
      {!!tasks.length &&
        tasks.map((task) => <TaskListItem key={task.id} task={task} />)}
    </ul>
  );
}

export default TaskList;
