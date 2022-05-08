import { Task } from '../../models/task';
import TaskListItem from '../TaskListItem/TaskListItem';
import './TaskList.scss';

interface Props {
  tasks: Task[];
  onDoneTask: (task: Task) => void;
  onDeleteTask: () => void;
}

function TaskList({ tasks, onDoneTask, onDeleteTask }: Props): JSX.Element {
  return (
    <ul className="TaskList">
      {!!tasks.length &&
        tasks.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            onDoneTaskClick={() => onDoneTask && onDoneTask(task)}
            onDeleteTaskClick={onDeleteTask}
          />
        ))}
    </ul>
  );
}

export default TaskList;
