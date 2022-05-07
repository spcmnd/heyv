import Button from '../../../core/components/Button/Button';
import Card from '../../../core/components/Card/Card';
import MoreIcon from '../../../core/components/icons/MoreIcon/MoreIcon';
import SuccessIcon from '../../../core/components/icons/SuccessIcon/SuccessIcon';
import getDayDelay from '../../../core/helpers/get-day-delay';
import { Task } from '../../models/task';
import './NextTaskCard.scss';

interface Props {
  task: Task;
  onDoneTask?: (task: Task) => void;
}

function NextTaskCard({ task, onDoneTask }: Props): JSX.Element {
  const dueDate: Date = task.dueDate!;
  const dayDelay: number = getDayDelay(dueDate);

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
          onClick={() => onDoneTask && onDoneTask(task)}
        >
          Fait
        </Button>
      </div>
    </Card>
  );
}

export default NextTaskCard;
