import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TaskForm from '../../components/TaskForm/TaskForm';
import { Task } from '../../models/task';
import taskService from '../../services/task-service';
import './TaskUpdatePage.scss';

function TaskUpdatePage(): JSX.Element {
  const { id } = useParams();
  const [task, setTask] = useState<Task>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      taskService
        .getOneTask(parseInt(id))
        .then((task: Task) => setTask(task))
        .catch(() => {
          toast('La tâche ne peut pas être trouvée', { type: 'error' });
          navigate('/');
        });
    }
  }, [id, navigate]);

  return (
    <div className="TaskUpdatePage">
      <h2>Quelle modification voulez-vous apporter à cette tâche ?</h2>
      {task && <TaskForm existingTask={task} />}
    </div>
  );
}

export default TaskUpdatePage;
