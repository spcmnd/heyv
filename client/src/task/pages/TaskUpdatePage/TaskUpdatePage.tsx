import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TaskForm from '../../components/TaskForm/TaskForm';
import useTask from '../../context/TaskProvider';
import './TaskUpdatePage.scss';

function TaskUpdatePage(): JSX.Element {
  const { id } = useParams();
  const { currentTask, getTask } = useTask();

  useEffect(() => {
    if (id) {
      getTask(parseInt(id));
    }
  }, [getTask, id]);

  return (
    <div className="TaskUpdatePage">
      <h2>Quelle modification voulez-vous apporter à cette tâche ?</h2>
      {currentTask && <TaskForm existingTask={currentTask} />}
    </div>
  );
}

export default TaskUpdatePage;
