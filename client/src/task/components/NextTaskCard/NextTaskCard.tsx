import { toast } from 'react-toastify';
import Button from '../../../core/components/Button/Button';
import Card from '../../../core/components/Card/Card';
import MoreIcon from '../../../core/components/icons/MoreIcon/MoreIcon';
import SuccessIcon from '../../../core/components/icons/SuccessIcon/SuccessIcon';
import heyvHttp from '../../../core/http/heyv-http';
import { TaskDto } from '../../models/task.dto';
import './NextTaskCard.scss';

interface Props {
  task: TaskDto;
  onDoneTask?: () => void;
}

function NextTaskCard({ task, onDoneTask }: Props): JSX.Element {
  const dueDate: Date = new Date(task.dueDate);
  const dayDelay: number = Math.round(
    (new Date().getTime() - dueDate.getTime()) / (1000 * 3600 * 24)
  );

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
    <Card className="NextTaskCard" color="secondary">
      <div className="head">
        <p className="title">{task.title}</p>
        <MoreIcon />
      </div>
      <p className="delayed">
        Dépassée depuis {dayDelay} jour{dayDelay > 1 ? 's' : ''}
      </p>
      <div className="footer">
        <p className="due-date">{dueDate.toLocaleDateString()}</p>
        <Button
          color="on-light"
          variant="outlined"
          icon={<SuccessIcon />}
          onClick={() => doneTask(task)}
        >
          Fait
        </Button>
      </div>
    </Card>
  );
}

export default NextTaskCard;
