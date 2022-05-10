import TaskForm from '../../components/TaskForm/TaskForm';
import './TaskCreatePage.scss';

function TaskCreatePage(): JSX.Element {
  return (
    <div className="TaskCreatePage">
      <h2>Quelle tâche voulez-vous ajouter ?</h2>
      <TaskForm />
    </div>
  );
}

export default TaskCreatePage;
