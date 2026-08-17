import { useEffect, useState } from "react";
import {
  App,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useTaskTemplates } from "../hooks/useTaskTemplates.ts";
import type {
  RecurrenceFrequency,
  TaskTemplate,
} from "../types/taskTemplate.ts";
import type { CreateTaskTemplateInput } from "../types/taskTemplate.ts";
import type { TaskPriority } from "../types/taskOccurrence.ts";

type RecurrenceRuleInput = NonNullable<
  CreateTaskTemplateInput["recurrence_rule"]
>;
type MonthlyMode = "day" | "position";

interface CreateTaskTemplateModalProps {
  open: boolean;
  onClose: () => void;
  taskId?: number | null;
  onSuccess?: () => void;
}

interface RecurrenceFormValues {
  recurrence_enabled?: boolean;
  frequency?: RecurrenceFrequency;
  interval?: number;
  weekdays?: number[];
  monthly_mode?: MonthlyMode;
  day_of_month?: number;
  week_position?: number;
  month?: number;
  start_date?: Dayjs;
  end_date?: Dayjs;
}

interface TaskTemplateFormValues extends RecurrenceFormValues {
  title: string;
  description?: string;
  priority: TaskPriority;
  estimated_duration_minutes?: number;
  room?: string;
  category?: string[];
}

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Faible" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "HIGH", label: "Haute" },
];

const FREQUENCY_OPTIONS: { value: RecurrenceFrequency; label: string }[] = [
  { value: "DAILY", label: "Quotidienne" },
  { value: "WEEKLY", label: "Hebdomadaire" },
  { value: "MONTHLY", label: "Mensuelle" },
  { value: "YEARLY", label: "Annuelle" },
];

const WEEKDAY_OPTIONS = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 7, label: "Dimanche" },
];

const MONTH_OPTIONS = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
];

const WEEK_POSITION_OPTIONS = [
  { value: -1, label: "Dernier" },
  { value: 1, label: "Premier" },
  { value: 2, label: "Deuxième" },
  { value: 3, label: "Troisième" },
  { value: 4, label: "Quatrième" },
];

const flattenErrors = (details: unknown): string => {
  if (details === null || details === undefined) {
    return "une erreur est survenue.";
  }

  if (typeof details === "string") {
    return details;
  }

  if (Array.isArray(details)) {
    return details.map(flattenErrors).join(", ");
  }

  if (typeof details === "object") {
    return Object.entries(details)
      .map(([key, value]) =>
        key === "non_field_errors"
          ? flattenErrors(value)
          : `${key} : ${flattenErrors(value)}`,
      )
      .join(" / ");
  }

  return String(details);
};

const buildInitialValues = (
  taskTemplate: TaskTemplate,
): TaskTemplateFormValues => {
  const values: TaskTemplateFormValues = {
    title: taskTemplate.title,
    description: taskTemplate.description ?? undefined,
    priority: taskTemplate.priority,
    estimated_duration_minutes:
      taskTemplate.estimated_duration_minutes ?? undefined,
    room: taskTemplate.room ?? undefined,
    category: taskTemplate.category,
    recurrence_enabled: Boolean(taskTemplate.recurrence_rule),
  };

  const rule = taskTemplate.recurrence_rule;

  if (rule) {
    values.frequency = rule.frequency;
    values.interval = rule.interval;
    values.weekdays = rule.weekdays;

    if (rule.week_position !== null) {
      values.monthly_mode = "position";
      values.week_position = rule.week_position;
    } else {
      values.monthly_mode = "day";
    }

    if (rule.day_of_month !== null) {
      values.day_of_month = rule.day_of_month;
    }

    if (rule.month !== null) {
      values.month = rule.month;
    }

    if (rule.start_date) {
      values.start_date = dayjs(rule.start_date);
    }

    if (rule.end_date) {
      values.end_date = dayjs(rule.end_date);
    }
  }

  return values;
};

function CreateTaskTemplateModal({
  open,
  onClose,
  taskId = null,
  onSuccess,
}: CreateTaskTemplateModalProps) {
  const [form] = Form.useForm<TaskTemplateFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const { rooms, categories, referenceLoading, create, get, update } =
    useTaskTemplates();

  const recurrenceEnabled = Form.useWatch("recurrence_enabled", form);
  const frequency = Form.useWatch("frequency", form) as
    RecurrenceFrequency | undefined;
  const monthlyMode = Form.useWatch("monthly_mode", form) as
    MonthlyMode | undefined;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!taskId) {
      form.resetFields();
      return;
    }

    let cancelled = false;
    setLoading(true);

    get(taskId)
      .then((taskTemplate) => {
        if (!cancelled) {
          form.setFieldsValue(buildInitialValues(taskTemplate));
        }
      })
      .catch(() => {
        if (!cancelled) {
          message.error("Impossible de charger la tâche.");
          onClose();
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, taskId, form, get, onClose, message]);

  const buildRecurrenceRule = (
    values: TaskTemplateFormValues,
  ): RecurrenceRuleInput | undefined => {
    if (!values.frequency) {
      return undefined;
    }

    const rule: RecurrenceRuleInput = {
      frequency: values.frequency,
      interval: values.interval ?? 1,
    };

    if (values.frequency === "WEEKLY") {
      rule.weekdays = values.weekdays ?? [];
    } else if (values.frequency === "MONTHLY") {
      if (monthlyMode === "day") {
        rule.day_of_month = values.day_of_month;
      } else {
        rule.week_position = values.week_position;
        rule.weekdays = values.weekdays ?? [];
      }
    } else if (values.frequency === "YEARLY") {
      rule.month = values.month;
      rule.day_of_month = values.day_of_month;
    }

    if (values.start_date) {
      rule.start_date = values.start_date.format("YYYY-MM-DD");
    }

    if (values.end_date) {
      rule.end_date = values.end_date.format("YYYY-MM-DD");
    }

    return rule;
  };

  const buildInput = (
    values: TaskTemplateFormValues,
  ): CreateTaskTemplateInput => {
    const input: CreateTaskTemplateInput = {
      title: values.title,
      priority: values.priority,
    };

    if (values.description) {
      input.description = values.description;
    }

    if (values.estimated_duration_minutes !== undefined) {
      input.estimated_duration_minutes = values.estimated_duration_minutes;
    }

    if (values.room) {
      input.room = values.room;
    }

    if (values.category?.length) {
      input.category = values.category;
    }

    if (values.recurrence_enabled) {
      const recurrenceRule = buildRecurrenceRule(values);

      if (recurrenceRule) {
        input.recurrence_rule = recurrenceRule;
      }
    }

    return input;
  };

  const handleFinish = async (values: TaskTemplateFormValues) => {
    setSubmitting(true);

    try {
      const input = buildInput(values);

      if (taskId) {
        await update(taskId, input);
        message.success("Tâche modifiée.");
      } else {
        await create(input);
        message.success("Modèle de tâche créé.");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      const details = (error as Error & { details?: unknown }).details;
      message.error(
        taskId
          ? `Impossible de modifier la tâche : ${flattenErrors(details)}`
          : `Impossible de créer le modèle de tâche : ${flattenErrors(details)}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const showWeeklyWeekdays = frequency === "WEEKLY";
  const showMonthlySection = frequency === "MONTHLY";
  const showMonthlyPosition = showMonthlySection && monthlyMode === "position";
  const showMonthlyDay = showMonthlySection && monthlyMode === "day";
  const showYearlySection = frequency === "YEARLY";

  return (
    <Modal
      open={open}
      title={
        taskId ? "Modifier le modèle de tâche" : "Créer un modèle de tâche"
      }
      okText={taskId ? "Modifier" : "Créer"}
      cancelText="Annuler"
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={submitting}
      destroyOnHidden
      width={640}
    >
      <Spin spinning={loading}>
        <Form<TaskTemplateFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={{
            priority: "MEDIUM",
            interval: 1,
            monthly_mode: "day",
          }}
          onFinish={handleFinish}
        >
          <Form.Item
            label="Titre"
            name="title"
            rules={[{ required: true, message: "Veuillez entrer un titre." }]}
          >
            <Input placeholder="Ex. : Passer l'aspirateur" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea
              rows={3}
              placeholder="Décrivez la tâche en quelques mots."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Priorité" name="priority">
                <Select options={PRIORITY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Durée estimée"
                name="estimated_duration_minutes"
              >
                <InputNumber
                  min={1}
                  addonAfter="min"
                  placeholder="Ex. : 30"
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Pièce" name="room">
                <Select
                  allowClear
                  showSearch
                  loading={referenceLoading}
                  placeholder="Sélectionnez une pièce"
                  options={rooms.map((room) => ({
                    value: room.name,
                    label: room.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Catégories" name="category">
                <Select
                  mode="multiple"
                  loading={referenceLoading}
                  placeholder="Sélectionnez des catégories"
                  options={categories.map((category) => ({
                    value: category.name,
                    label: category.name,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="recurrence_enabled" valuePropName="checked">
            <Checkbox>Activer une récurrence</Checkbox>
          </Form.Item>

          {recurrenceEnabled && (
            <>
              <Divider className="mt-0" />

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Fréquence"
                    name="frequency"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez choisir une fréquence.",
                      },
                    ]}
                  >
                    <Select
                      options={FREQUENCY_OPTIONS}
                      placeholder="Choisissez une fréquence"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Intervalle" name="interval">
                    <InputNumber
                      min={1}
                      addonAfter="période(s)"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {showWeeklyWeekdays && (
                <Card size="small" className="mb-6">
                  <Form.Item
                    label="Jours de la semaine"
                    name="weekdays"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez sélectionner au moins un jour.",
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      options={WEEKDAY_OPTIONS}
                      placeholder="Sélectionnez les jours"
                    />
                  </Form.Item>
                </Card>
              )}

              {showMonthlySection && (
                <Card size="small" className="mb-6">
                  <Form.Item label="Occurrence" name="monthly_mode">
                    <Radio.Group
                      options={[
                        { value: "day", label: "Un jour précis du mois" },
                        {
                          value: "position",
                          label: "Une position dans le mois",
                        },
                      ]}
                    />
                  </Form.Item>

                  {showMonthlyDay && (
                    <Form.Item
                      label="Jour du mois"
                      name="day_of_month"
                      rules={[
                        { required: true, message: "Veuillez saisir un jour." },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        max={31}
                        className="w-full"
                        placeholder="Ex. : 15"
                      />
                    </Form.Item>
                  )}

                  {showMonthlyPosition && (
                    <>
                      <Form.Item
                        label="Position"
                        name="week_position"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez choisir une position.",
                          },
                        ]}
                      >
                        <Select
                          options={WEEK_POSITION_OPTIONS}
                          placeholder="Ex. : Dernier"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Jours de la semaine"
                        name="weekdays"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez sélectionner au moins un jour.",
                          },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          options={WEEKDAY_OPTIONS}
                          placeholder="Sélectionnez les jours"
                        />
                      </Form.Item>
                    </>
                  )}
                </Card>
              )}

              {showYearlySection && (
                <Card size="small" className="mb-6">
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Mois"
                        name="month"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez choisir un mois.",
                          },
                        ]}
                      >
                        <Select
                          options={MONTH_OPTIONS}
                          placeholder="Choisissez un mois"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Jour du mois (optionnel)"
                        name="day_of_month"
                      >
                        <InputNumber
                          min={1}
                          max={31}
                          className="w-full"
                          placeholder="Ex. : 15"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              )}

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Date de début" name="start_date">
                    <DatePicker
                      format="DD.MM.YYYY"
                      className="w-full"
                      placeholder="JJ.MM.AAAA"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Date de fin" name="end_date">
                    <DatePicker
                      format="DD.MM.YYYY"
                      className="w-full"
                      placeholder="JJ.MM.AAAA"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Spin>
    </Modal>
  );
}

export default CreateTaskTemplateModal;
