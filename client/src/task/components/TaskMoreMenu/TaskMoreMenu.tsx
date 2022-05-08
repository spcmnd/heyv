import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoreIcon from '../../../core/components/icons/MoreIcon/MoreIcon';
import { Task } from '../../models/task';
import './TaskMoreMenu.scss';

interface Props {
  task: Task;
  onTaskDeleted: () => void;
}

function TaskMoreMenu({ task, onTaskDeleted }: Props): JSX.Element {
  const [menuOpened, setMenuOpened] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  const onMenuOutsideClick = useCallback(() => setMenuOpened(false), []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onMenuOutsideClick && onMenuOutsideClick();
      }
    };

    document.addEventListener('click', handleOutsideClick, true);

    return () =>
      document.removeEventListener('click', handleOutsideClick, true);
  }, [onMenuOutsideClick]);

  const deleteTask = () => {
    onMenuOutsideClick && onMenuOutsideClick();
    onTaskDeleted();
  };

  return (
    <div className="TaskMoreMenu">
      <MoreIcon onClick={() => setMenuOpened(true)} />
      <ul className={classNames('menu', { opened: menuOpened })} ref={menuRef}>
        <li onClick={() => navigate(`${task.id}/edit`)}>Modifier</li>
        <li onClick={() => deleteTask()}>Supprimer</li>
      </ul>
    </div>
  );
}

export default TaskMoreMenu;
