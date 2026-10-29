import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { BRAIN_KINDS } from '@nave/shared';
import type { BrainContext, BrainDetail, BrainHit, BrainNode } from '@nave/shared';
import { useNave } from '../store';
import { Dialog } from './Dialog';
import { GlassButton } from './GlassButton';

function Editor({ detail, onClose, onOpen }: { detail: BrainDetail; onClose(): void; onOpen(id: string): void }) {
  const { t } = useTranslation();
  const { saveBrain, removeBrain } = useNave();
  const { node } = detail;
  const [title, setTitle] = useState(node.title);
  const [body, setBody] = useState(node.body);
  const [kind, setKind] = useState(node.kind);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="brain-editor" data-testid="brain-editor">
      <div className="brain-editor-head">
        <span className={`badge ${node.confidence}`}>{t(`brain.confidence.${node.confidence}`)}</span>
        {node.source === 'claude' && <span className="badge claude">{t('brain.byClaude')}</span>}
        <span className="spacer" />
        <GlassButton variant="ghost" onClick={onClose}>
          {t('common.close')}
        </GlassButton>
      </div>
      <input data-testid="brain-title" value={title} maxLength={160} aria-label={t('brain.title')} onChange={(e) => setTitle(e.target.value)} />
      <select aria-label={t('brain.kind')} value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
        {BRAIN_KINDS.map((k) => (
          <option key={k} value={k}>
            {t(`brain.kinds.${k}`)}
          </option>
        ))}
      </select>
      <textarea data-testid="brain-body" value={body} maxLength={50000} aria-label={t('brain.body')} placeholder={t('brain.bodyHint')} onChange={(e) => setBody(e.target.value)} />
      {detail.links.length > 0 && (
        <p className="brain-links" data-testid="brain-links">
          {t('brain.links')}{' '}
          {detail.links.map((l) =>
            l.targetId ? (
              <button key={l.title} type="button" className="link" onClick={() => onOpen(l.targetId as string)}>
                {l.title}
              </button>
            ) : (
              <span key={l.title} className="muted" title={t('brain.unresolved')}>
                {l.title}?
              </span>
            )
          )}
        </p>
      )}
      {detail.backlinks.length > 0 && (
        <p className="brain-links" data-testid="brain-backlinks">
          {t('brain.backlinks')}{' '}
          {detail.backlinks.map((b) => (
            <button key={b.id} type="button" className="link" onClick={() => onOpen(b.id)}>
              {b.title}
            </button>
          ))}
        </p>
      )}
      <div className="actions">
        <GlassButton variant="ghost" onClick={() => setConfirming(true)}>
          {t('brain.delete')}
        </GlassButton>
        <GlassButton variant="primary" data-testid="brain-save" onClick={() => void saveBrain(node.id, { title, body, kind }).then(onClose)}>
          {node.confidence === 'unverified' ? t('brain.saveAndVerify') : t('brain.save')}
        </GlassButton>
      </div>
      {confirming && (
        <Dialog title={t('brain.deleteTitle')} onClose={() => setConfirming(false)}>
          <p>{t('brain.deleteBody')}</p>
          <div className="actions">
            <GlassButton variant="ghost" onClick={() => setConfirming(false)}>
              {t('common.cancel')}
            </GlassButton>
            <GlassButton variant="danger" data-testid="brain-confirm-delete" onClick={() => void removeBrain(node.id).then(onClose)}>
              {t('brain.delete')}
            </GlassButton>
          </div>
        </Dialog>
      )}
    </div>
  );
}

function NodeRow({ node, snippet, onOpen }: { node: BrainNode; snippet?: string; onOpen(id: string): void }) {
  const { t } = useTranslation();
  const reviewBrain = useNave((s) => s.reviewBrain);
  return (
    <li className={`brain-node ${node.confidence}`} data-testid="brain-node" data-confidence={node.confidence}>
      <button type="button" className="brain-node-main" onClick={() => onOpen(node.id)}>
        <span className="brain-node-title">{node.title}</span>
        <span className={`badge ${node.confidence}`}>{t(`brain.confidence.${node.confidence}`)}</span>
        {node.source === 'claude' && <span className="badge claude">{t('brain.byClaude')}</span>}
        {snippet && <span className="snippet">{snippet}</span>}
      </button>
      {node.confidence === 'unverified' && (
        <div className="brain-review">
          <GlassButton data-testid="brain-accept" onClick={() => void reviewBrain(node.id, 'accept')}>
            {t('brain.accept')}
          </GlassButton>
          <GlassButton onClick={() => onOpen(node.id)}>{t('brain.edit')}</GlassButton>
          <GlassButton data-testid="brain-reject" onClick={() => void reviewBrain(node.id, 'reject')}>
            {t('brain.reject')}
          </GlassButton>
        </div>
      )}
      {node.confidence === 'deprecated' && (
        <div className="brain-review">
          <GlassButton data-testid="brain-restore" onClick={() => void reviewBrain(node.id, 'restore')}>
            {t('brain.restore')}
          </GlassButton>
        </div>
      )}
    </li>
  );
}

export function BrainTab() {
  const { t } = useTranslation();
  const { brain, activeId, board, loadBrain, addBrain, openBrain, searchBrain, contextBrain, pasteToClaude } = useNave();
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<BrainHit[] | null>(null);
  const [detail, setDetail] = useState<BrainDetail | null>(null);
  const [context, setContext] = useState<BrainContext | null>(null);
  const claudes = (board?.panels ?? []).filter((p) => p.kind === 'claude');
  const hits = query.trim() === '' ? null : result;

  useEffect(() => {
    void loadBrain();
  }, [loadBrain, activeId]);

  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => void searchBrain(query).then(setResult), 250);
    return () => clearTimeout(timer);
  }, [query, searchBrain, brain]);

  const open = (id: string): void => void openBrain(id).then(setDetail);
  const submit = (e: FormEvent): void => {
    e.preventDefault();
    if (title.trim()) void addBrain(title);
    setTitle('');
  };

  if (!activeId) return <p className="muted">{t('side.noProject')}</p>;
  if (detail) return <Editor detail={detail} onClose={() => setDetail(null)} onOpen={open} />;

  const group = (c: BrainNode['confidence']): BrainNode[] => brain.filter((n) => n.confidence === c);
  const sections: Array<[BrainNode['confidence'], BrainNode[]]> = [['unverified', group('unverified')], ['verified', group('verified')], ['deprecated', group('deprecated')]];

  return (
    <>
      <input data-testid="brain-search" type="search" value={query} placeholder={t('brain.search')} aria-label={t('brain.search')} onChange={(e) => setQuery(e.target.value)} />
      {hits !== null ? (
        <ul className="side-list" data-testid="brain-hits">
          {hits.map((h) => (
            <NodeRow key={h.node.id} node={h.node} snippet={h.snippet} onOpen={open} />
          ))}
          {hits.length === 0 && <p className="muted">{t('brain.noHits')}</p>}
        </ul>
      ) : (
        <>
          <form onSubmit={submit} className="inline-form">
            <input data-testid="brain-new-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('brain.newNode')} maxLength={160} aria-label={t('brain.newNode')} />
            <GlassButton type="submit" variant="primary" data-testid="brain-add">
              {t('side.add')}
            </GlassButton>
          </form>
          {brain.length === 0 && <p className="muted">{t('brain.empty')}</p>}
          {sections.map(([confidence, nodes]) =>
            nodes.length === 0 ? null : (
              <section key={confidence} data-testid={`brain-section-${confidence}`}>
                <h3 className="brain-h">{t(`brain.section.${confidence}`, { count: nodes.length })}</h3>
                <ul className="side-list">
                  {nodes.map((n) => (
                    <NodeRow key={n.id + n.updatedAt} node={n} onOpen={open} />
                  ))}
                </ul>
              </section>
            )
          )}
        </>
      )}
      <GlassButton data-testid="brain-context-btn" onClick={() => void contextBrain(query.trim() || brain[0]?.title || '').then(setContext)} disabled={brain.length === 0}>
        {t('brain.context')}
      </GlassButton>
      {context && (
        <Dialog title={t('brain.contextTitle')} onClose={() => setContext(null)}>
          {context.nodes.length === 0 ? (
            <p className="muted">{t('brain.contextEmpty')}</p>
          ) : (
            <>
              <p className="muted">{t('brain.contextInfo', { count: context.nodes.length })}{context.truncated ? ` ${t('brain.contextTruncated')}` : ''}</p>
              <pre className="context" data-testid="brain-context-text">{context.text}</pre>
            </>
          )}
          <div className="actions">
            <GlassButton variant="ghost" onClick={() => setContext(null)}>
              {t('common.close')}
            </GlassButton>
            <GlassButton
              variant="primary"
              data-testid="brain-context-send"
              disabled={claudes.length === 0 || context.text === ''}
              title={claudes.length === 0 ? t('side.noClaude') : t('side.sendHint')}
              onClick={() => {
                const target = claudes[0];
                if (target) void pasteToClaude(target.id, context.text);
                setContext(null);
              }}
            >
              {t('side.sendToClaude')}
            </GlassButton>
          </div>
        </Dialog>
      )}
    </>
  );
}
