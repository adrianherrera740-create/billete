import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Note, Task, TaskStatus } from '@nave/shared';
import { useNave } from '../store';
import type { SideTab } from '../store';
import { BrainTab } from './BrainTab';
import { Dialog } from './Dialog';
import { GlassButton } from './GlassButton';

type Tab = SideTab;
const NEXT: Record<TaskStatus, TaskStatus> = { todo: 'doing', doing: 'done', done: 'todo' };

function TaskRow({ task }: { task: Task }) {
  const { t } = useTranslation();
  const setTaskStatus = useNave((s) => s.setTaskStatus);
  const removeTask = useNave((s) => s.removeTask);
  return (
    <li className={`task ${task.status}`} data-testid="task">
      <input
        type="checkbox"
        aria-label={t('side.toggleDone')}
        checked={task.status === 'done'}
        onChange={() => void setTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
      />
      <span className="task-title">{task.title}</span>
      <GlassButton variant="ghost" data-testid="task-status" title={t('side.nextStatus')} onClick={() => void setTaskStatus(task.id, NEXT[task.status])}>
        {t(`side.status.${task.status}`)}
      </GlassButton>
      <GlassButton variant="ghost" aria-label={t('side.deleteTask')} title={t('side.deleteTask')} onClick={() => void removeTask(task.id)}>
        ✕
      </GlassButton>
    </li>
  );
}

function Tasks() {
  const { t } = useTranslation();
  const tasks = useNave((s) => s.tasks);
  const addTask = useNave((s) => s.addTask);
  const hasProject = useNave((s) => s.activeId !== null);
  const [title, setTitle] = useState('');
  const submit = (e: FormEvent): void => {
    e.preventDefault();
    if (title.trim()) void addTask(title);
    setTitle('');
  };
  if (!hasProject) return <p className="muted">{t('side.noProject')}</p>;
  return (
    <>
      <form onSubmit={submit} className="inline-form">
        <input data-testid="task-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('side.newTask')} maxLength={200} aria-label={t('side.newTask')} />
        <GlassButton type="submit" variant="primary" data-testid="task-add-btn">
          {t('side.add')}
        </GlassButton>
      </form>
      <ul className="side-list">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </ul>
      {tasks.length === 0 && <p className="muted">{t('side.noTasks')}</p>}
    </>
  );
}

function NoteCard({ note }: { note: Note }) {
  const { t } = useTranslation();
  const { saveNote, removeNote, pasteToClaude, projects, board } = useNave();
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [confirming, setConfirming] = useState(false);
  const claudes = (board?.panels ?? []).filter((p) => p.kind === 'claude');
  const [target, setTarget] = useState('');
  const targetId = claudes.some((p) => p.id === target) ? target : (claudes[0]?.id ?? '');
  const text = [title.trim(), body.trim()].filter(Boolean).join('\n\n');

  return (
    <li className="note" data-testid="note">
      <input className="note-title" value={title} placeholder={t('side.noteTitle')} maxLength={120} aria-label={t('side.noteTitle')} onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== note.title && void saveNote(note.id, { title })} />
      <textarea data-testid="note-body" value={body} placeholder={t('side.noteBody')} maxLength={20000} aria-label={t('side.noteBody')} onChange={(e) => setBody(e.target.value)} onBlur={() => body !== note.body && void saveNote(note.id, { body })} />
      <div className="note-actions">
        <select aria-label={t('side.moveTo')} value={note.projectId ?? ''} onChange={(e) => void saveNote(note.id, { projectId: e.target.value === '' ? null : e.target.value })}>
          <option value="">{t('side.inboxOption')}</option>
          {projects.filter((p) => p.archivedAt === null).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {claudes.length > 1 && (
          <select aria-label={t('side.sendTarget')} value={targetId} onChange={(e) => setTarget(e.target.value)}>
            {claudes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        )}
        <GlassButton data-testid="note-send-btn" disabled={claudes.length === 0 || text === ''} title={claudes.length === 0 ? t('side.noClaude') : t('side.sendHint')} onClick={() => void pasteToClaude(targetId, text)}>
          {t('side.sendToClaude')}
        </GlassButton>
        <GlassButton variant="ghost" aria-label={t('side.deleteNote')} title={t('side.deleteNote')} onClick={() => setConfirming(true)}>
          ✕
        </GlassButton>
      </div>
      {confirming && (
        <Dialog title={t('side.deleteNoteTitle')} onClose={() => setConfirming(false)}>
          <p>{t('side.deleteNoteBody')}</p>
          <div className="actions">
            <GlassButton variant="ghost" onClick={() => setConfirming(false)}>
              {t('common.cancel')}
            </GlassButton>
            <GlassButton variant="danger" data-testid="confirm-note-delete" onClick={() => void removeNote(note.id)}>
              {t('side.deleteNote')}
            </GlassButton>
          </div>
        </Dialog>
      )}
    </li>
  );
}

function Notes({ scope }: { scope: 'project' | 'inbox' }) {
  const { t } = useTranslation();
  const notes = useNave((s) => (scope === 'inbox' ? s.inbox : s.notes));
  const activeId = useNave((s) => s.activeId);
  const addNote = useNave((s) => s.addNote);
  if (scope === 'project' && !activeId) return <p className="muted">{t('side.noProject')}</p>;
  return (
    <>
      <GlassButton variant="primary" data-testid={scope === 'inbox' ? 'inbox-add-btn' : 'note-add-btn'} onClick={() => void addNote(scope === 'inbox' ? null : activeId)}>
        {t('side.newNote')}
      </GlassButton>
      <ul className="side-list">
        {notes.map((note) => (
          <NoteCard key={`${note.id}-${note.updatedAt}`} note={note} />
        ))}
      </ul>
      {notes.length === 0 && <p className="muted">{scope === 'inbox' ? t('side.inboxEmpty') : t('side.noNotes')}</p>}
    </>
  );
}

export function SidePanel() {
  const { t } = useTranslation();
  const tab = useNave((s) => s.sideTab);
  const setTab = useNave((s) => s.setSideTab);
  const tabs: Tab[] = ['tasks', 'notes', 'inbox', 'brain'];
  return (
    <aside className="side glass" data-testid="side-panel">
      <div className="tabs" role="tablist">
        {tabs.map((id) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} data-testid={`tab-${id}`} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
            {t(`side.tab.${id}`)}
          </button>
        ))}
      </div>
      <div className="side-body">
        {tab === 'tasks' && <Tasks />}
        {tab === 'notes' && <Notes scope="project" />}
        {tab === 'inbox' && <Notes scope="inbox" />}
        {tab === 'brain' && <BrainTab />}
      </div>
    </aside>
  );
}
