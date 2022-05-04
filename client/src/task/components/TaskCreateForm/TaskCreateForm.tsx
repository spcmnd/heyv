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
    if (!title || !occurrence || !periodicity) {
      return;
    }

    try {
      await heyvHttp.post('/task', taskCreationDto);
      toast('La tâche a été créée avec succès!', {
        type: 'success',
      });
      navigate('/');
    } catch (error: any) {
      for (const err of error.response.data.message) {
        toast('Error: ' + err, {
          type: 'error',
        });
      }
    }
  };

  return (
    <form className="TaskCreateForm">
      <TextInput
        placeholder="Titre de la tâche..."
        onChange={handleTitleInputChange}
        value={title}
        hasError={!!title && (title?.length < 8 || title?.length > 64)}
      />
      <p className="occurrence-question">
        A quelle fréquence cette tâche doit être faite ?
      </p>
      <p className="occurrence-hint">Exemple: 2 fois par semaine.</p>
      <div className="occurrence">
        <TextInput
          onChange={handleOccurrenceInputChange}
          value={occurrence}
          hasError={parseInt(occurrence) < 1 || parseInt(occurrence) > 3}
        />
        <p>fois par</p>
        <SelectInput
          onValueChange={(value: string) =>
            handlePeriodicityInputChange(value as PeriodicityEnum)
          }
          options={Object.entries(PeriodicityEnum).map(([key, value]) => ({
            label: key,
            value,
          }))}
          value={periodicity}
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
          disabled={!title || !occurrence || !periodicity}
          onClick={handleSubmitClick}
        >
          Ajouter
        </Button>
      </div>
    </form>
  );
}

export default TaskCreateForm;
