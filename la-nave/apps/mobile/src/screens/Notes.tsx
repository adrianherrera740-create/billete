import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NaveApi, Note, Project } from '@nave/shared';
import { call, message } from '../remote';

interface Props {
  api: NaveApi;
  projectId: string | null;
  onProject(id: string): void;
}

function NoteCard({ api, note, onSaved, onError }: { api: NaveApi; note: Note; onSaved(): void; onError(message: string): void }) {
  const { t } = useTranslation();
  const [body, setBody] = useState(note.body);
  const [saved, setSaved] = useState(false);
  const save = (): void => {
    if (body === note.body) return;
    call(api, 'note:update', { id: note.id, body })
      .then(() => {
        setSaved(true);
        onSaved();
      })
      .catch((e: unknown) => onError(message(e)));
  };
  return (
    <li className="card note" data-testid="note">
      {note.title && <strong>{note.title}</strong>}
      <textarea data-testid="note-body" value={body} maxLength={20000} aria-label={t('notes.placeholder')} onChange={(e) => { setBody(e.target.value); setSaved(false); }} onBlur={save} />
      {saved && <span className="ok">{t('notes.saved')}</span>}
    </li>
  );
}

export function Notes({ api, projectId, onProject }: Props) {
  const { t } = useTranslation();
  const INBOX = '__inbox__';
  const [projects, setProjects] = useState<Project[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const scope = projectId ?? INBOX;

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
    let current = true;
    call(api, 'note:list', { projectId: scope === INBOX ? null : scope })
      .then((list) => {
        if (!current) return;
        setNotes(list);
        setError(null);
      })
      .catch((e: unknown) => current && setError(message(e)));
    return () => {
      current = false;
    };
  }, [api, scope, tick]);

  const add = (): void => {
    call(api, 'note:create', { projectId: scope === INBOX ? null : scope })
      .then(() => setTick((n) => n + 1))
      .catch((e: unknown) => setError(message(e)));
  };

  return (
    <section>
      <label className="field">
        {t('notes.scope')}
        <select data-testid="notes-scope" value={scope} onChange={(e) => (e.target.value === INBOX ? onProject('') : onProject(e.target.value))}>
          <option value={INBOX}>{t('common.inbox')}</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
          ))}
        </select>
      </label>
      <button type="button" className="primary" data-testid="note-add" onClick={add}>{t('notes.new')}</button>
      {error && <p className="error" role="alert" data-testid="error">{error}</p>}
      <ul className="list">
        {notes.map((n) => (
          <NoteCard key={`${n.id}-${n.updatedAt}`} api={api} note={n} onSaved={() => setTick((v) => v + 1)} onError={setError} />
        ))}
      </ul>
      {notes.length === 0 && !error && <p className="muted">{t('notes.none')}</p>}
    </section>
  );
}
