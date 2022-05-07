import { toast } from 'react-toastify';
import heyvHttp from '../../../core/http/heyv-http';
import { TaskDto } from '../../models/task.dto';
import TaskListItem from '../TaskListItem/TaskListItem';
import './TaskList.scss';

interface Props {
  tasks: TaskDto[];
  onDoneTask: () => void;
}

function TaskList({ tasks, onDoneTask }: Props): JSX.Element {
  const doneTask = (task: TaskDto): void => {
    heyvHttp
      .post(`/task/${task.id}/done`)
      .then(() => {
        toast('Tâche faite avec succès!', { type: 'success' });
        onDoneTask && onDoneTask();
      })
      .catch((err: any) =>
        toast(`Error: ${err.data.message[0]}`, { type: 'error' })
      );
  };

  return (
    <ul className="TaskList">
      {!!tasks.length &&
        tasks.map((task) => (
          <TaskListItem key={task.id} task={task} onDoneTaskClick={doneTask} />
        ))}
    </ul>
  );
}

export default TaskList;
