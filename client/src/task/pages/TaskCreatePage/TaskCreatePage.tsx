import TaskCreateForm from '../../components/TaskCreateForm/TaskCreateForm';
import './TaskCreatePage.scss';

function TaskCreatePage(): JSX.Element {
  return (
    <div className="TaskCreatePage">
      <h2>Quelle tâche voulez-vous ajouter ?</h2>
      <TaskCreateForm />
    </div>
  );
}

export default TaskCreatePage;
