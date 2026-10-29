import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { NaveApi, Project, Task, TaskStatus } from '@nave/shared';
import { call, message } from '../remote';

const NEXT: Record<TaskStatus, TaskStatus> = { todo: 'doing', doing: 'done', done: 'todo' };

interface Props {
  api: NaveApi;
  projectId: string | null;
  onProject(id: string): void;
}

export function Tasks({ api, projectId, onProject }: Props) {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const active = projectId ?? projects?.[0]?.id ?? null;

  useEffect(() => {
    let current = true;
    call(api, 'project:list', { includeArchived: false })
      .then((list) => current && setProjects(list))
      .catch((e: unknown) => current && setError(message(e)));
    return () => {
      current = false;
    };
  }, [api]);

  useEffect(() => {
    if (!active) return;
    let current = true;
    call(api, 'task:list', { projectId: active })
      .then((list) => {
        if (!current) return;
        setTasks(list);
        setError(null);
      })
      .catch((e: unknown) => current && setError(message(e)));
    return () => {
      current = false;
    };
  }, [api, active, tick]);

  useEffect(() => {
    const timer = setInterval(() => setTick((n) => n + 1), 20_000);
    return () => clearInterval(timer);
  }, []);

  const add = (e: FormEvent): void => {
    e.preventDefault();
    if (!active || !title.trim()) return;
    call(api, 'task:create', { projectId: active, title: title.trim() })
      .then(() => {
        setTitle('');
        setTick((n) => n + 1);
      })
      .catch((err: unknown) => setError(message(err)));
  };

  const setStatus = (task: Task, status: TaskStatus): void => {
    call(api, 'task:update', { id: task.id, status })
      .then(() => setTick((n) => n + 1))
      .catch((err: unknown) => setError(message(err)));
  };

  if (projects !== null && projects.length === 0) return <p className="muted">{t('tasks.noProject')}</p>;

  return (
    <section>
      <label className="field">
        {t('tasks.project')}
        <select data-testid="project-select" value={active ?? ''} onChange={(e) => onProject(e.target.value)}>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
          ))}
        </select>
      </label>
      <form className="inline" onSubmit={add}>
        <input data-testid="task-input" value={title} maxLength={200} placeholder={t('tasks.new')} aria-label={t('tasks.new')} onChange={(e) => setTitle(e.target.value)} />
        <button type="submit" className="primary" data-testid="task-add">{t('common.add')}</button>
      </form>
      {error && <p className="error" role="alert" data-testid="error">{error}</p>}
      <ul className="list">
        {tasks.map((task) => (
          <li key={task.id} className={`task ${task.status}`} data-testid="task">
            <input type="checkbox" aria-label={t('tasks.status.done')} checked={task.status === 'done'} onChange={() => setStatus(task, task.status === 'done' ? 'todo' : 'done')} />
            <span className="title">{task.title}</span>
            <button type="button" className="chip" aria-label={t('tasks.next')} data-testid="task-status" onClick={() => setStatus(task, NEXT[task.status])}>
              {t(`tasks.status.${task.status}`)}
            </button>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && active && !error && <p className="muted">{t('tasks.none')}</p>}
    </section>
  );
}
