import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../../core/components/Button/Button';
import SelectInput from '../../../core/components/SelectInput/SelectInput';
import TextInput from '../../../core/components/TextInput/TextInput';
import useInput from '../../../core/hooks/useInput';
import { PeriodicityEnum } from '../../models/periodicity.enum';
import { TaskCreationDto } from '../../models/task.dto';
import taskService from '../../services/task-service';
import './TaskCreateForm.scss';

function TaskCreateForm(): JSX.Element {
  const {
    value: titleValue,
    touched: titleTouched,
    onChange: titleOnChange,
    onTouched: titleOnTouched,
  } = useInput<string>('');
  const {
    value: occurrenceValue,
    touched: occurrenceTouched,
    onChange: occurrenceOnChange,
    onTouched: occurrenceOnTouched,
  } = useInput<string>('');
  const { value: periodicityValue, onChange: periodicityOnChange } =
    useInput<PeriodicityEnum>(PeriodicityEnum.Daily);
  const navigate = useNavigate();

  const handleTitleInputChange = (event: InputEvent) => {
    const inputValue = (event?.target as HTMLInputElement)?.value;
    titleOnChange(inputValue);
  };

  const handleOccurrenceInputChange = (event: InputEvent) => {
    const inputValue = (event?.target as HTMLInputElement)?.value;
    occurrenceOnChange(inputValue);
  };

  const handlePeriodicityInputChange = (value: PeriodicityEnum) => {
    periodicityOnChange(value);
  };

  const handleSubmitClick = (event: MouseEvent) => {
    event.preventDefault();
    submitForm({
      title: titleValue,
      occurrence: parseInt(occurrenceValue),
      periodicity: periodicityValue,
    });
  };

  const submitForm = async (taskCreationDto: TaskCreationDto) => {
    if (!titleValue || !occurrenceValue || !periodicityValue) {
      return;
    }

    try {
      await taskService.createTask(taskCreationDto);
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
        value={titleValue}
        hasError={
          !!titleValue &&
          titleTouched &&
          (titleValue?.length < 8 || titleValue?.length > 64)
        }
        onTouchEnd={titleOnTouched}
      />
      <p className="occurrence-question">
        A quelle fréquence cette tâche doit être faite ?
      </p>
      <p className="occurrence-hint">Exemple: 2 fois par semaine.</p>
      <div className="occurrence">
        <TextInput
          onChange={handleOccurrenceInputChange}
          value={occurrenceValue}
          hasError={
            !!occurrenceValue &&
            occurrenceTouched &&
            (parseInt(occurrenceValue) < 1 || parseInt(occurrenceValue) > 3)
          }
          onTouchEnd={occurrenceOnTouched}
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
          value={periodicityValue}
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
          disabled={!titleValue || !occurrenceValue || !periodicityValue}
          onClick={handleSubmitClick}
        >
          Ajouter
        </Button>
      </div>
    </form>
  );
}

export default TaskCreateForm;
