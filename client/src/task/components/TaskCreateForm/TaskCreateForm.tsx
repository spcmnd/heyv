import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../../core/components/Button/Button';
import SelectInput from '../../../core/components/SelectInput/SelectInput';
import TextInput from '../../../core/components/TextInput/TextInput';
import heyvHttp from '../../../core/http/heyv-http';
import { PeriodicityEnum } from '../../models/periodicity.enum';
import { TaskCreationDto } from '../../models/task.dto';
import './TaskCreateForm.scss';

function TaskCreateForm(): JSX.Element {
  const [title, setTitle] = useState('');
  const [occurrence, setOccurrence] = useState('');
  const [periodicity, setPeriodicity] = useState<PeriodicityEnum>(
    PeriodicityEnum.Daily
  );
  const navigate = useNavigate();

  const handleTitleInputChange = (event: InputEvent) => {
    const inputValue = (event?.target as HTMLInputElement)?.value;
    setTitle(inputValue);
  };

  const handleOccurrenceInputChange = (event: InputEvent) => {
    const inputValue = (event?.target as HTMLInputElement)?.value;
    setOccurrence(inputValue);
  };

  const handlePeriodicityInputChange = (value: PeriodicityEnum) => {
    setPeriodicity(value);
  };

  const handleSubmitClick = (event: MouseEvent) => {
    event.preventDefault();
    submitForm({
      title,
      occurrence: parseInt(occurrence),
      periodicity,
    });
  };

  const submitForm = async (taskCreationDto: TaskCreationDto) => {
    try {
      await heyvHttp.post('/task', taskCreationDto);
      toast('La tâche a été créée avec succès!', {
        type: 'success',
        className: 'heyv-toast-success',
      });
      navigate('/');
    } catch (error: any) {
      toast('Une erreur est survenue!', {
        type: 'error',
        className: 'heyv-toast-error',
      });
    }
  };

  return (
    <form className="TaskCreateForm">
      <TextInput
        placeholder="Titre de la tâche..."
        onChange={handleTitleInputChange}
        value={title}
      />
      <p className="occurrence-question">
        A quelle fréquence cette tâche doit être faite ?
      </p>
      <p className="occurrence-hint">Exemple: 2 fois par semaine.</p>
      <div className="occurrence">
        <TextInput onChange={handleOccurrenceInputChange} value={occurrence} />
        <p>fois par</p>
        <SelectInput
          onValueChange={(value: string) =>
            handlePeriodicityInputChange(value as PeriodicityEnum)
          }
          options={Object.entries(PeriodicityEnum).map(([key, value]) => ({
            label: key,
            value,
          }))}
        />
      </div>
      <div className="actions">
        <Button
          variant="outlined"
          color="accent"
          type="button"
          onClick={() => navigate('/')}
        >
          Annuler
        </Button>
        <Button
          variant="filled"
          color="accent"
          type="submit"
          onClick={handleSubmitClick}
        >
          Ajouter
        </Button>
      </div>
    </form>
  );
}

export default TaskCreateForm;
