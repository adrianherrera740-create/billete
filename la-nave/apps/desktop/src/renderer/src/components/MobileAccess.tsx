import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import type { MobileDevice, MobileStatus, PairingInfo } from '@nave/shared';
import { useNave } from '../store';
import { GlassButton } from './GlassButton';

const fail = (message: string): void => useNave.setState({ error: message });

export function MobileAccess() {
  const { t } = useTranslation();
  const tick = useNave((s) => s.changeTick);
  const [status, setStatus] = useState<MobileStatus | null>(null);
  const [devices, setDevices] = useState<MobileDevice[]>([]);
  const [pairing, setPairing] = useState<PairingInfo | null>(null);
  const [qrFor, setQrFor] = useState<{ url: string; image: string } | null>(null);
  const [version, setVersion] = useState(0);
  const refresh = (): void => setVersion((v) => v + 1);

  useEffect(() => {
    let current = true;
    void Promise.all([window.nave.invoke('mobile:status', undefined), window.nave.invoke('mobile:devices', undefined)]).then(([s, d]) => {
      if (!current) return;
      if (s.ok) setStatus(s.data);
      if (d.ok) setDevices(d.data);
    });
    return () => {
      current = false;
    };
  }, [version, tick]);

  useEffect(() => {
    if (!pairing) return;
    let current = true;
    void QRCode.toDataURL(pairing.url, { margin: 1, width: 220, errorCorrectionLevel: 'M' }).then((image) => current && setQrFor({ url: pairing.url, image }));
    // Al caducar el código desaparece solo.
    const timer = setTimeout(() => setPairing(null), Math.max(0, new Date(pairing.expiresAt).getTime() - Date.now()));
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [pairing]);

  const setEnabled = async (enabled: boolean): Promise<void> => {
    const res = await window.nave.invoke('mobile:set-enabled', { enabled });
    if (res.ok) {
      setStatus(res.data);
      if (!enabled) setPairing(null);
    } else fail(res.error.message);
  };

  const startPairing = async (): Promise<void> => {
    const res = await window.nave.invoke('mobile:pair-start', undefined);
    if (res.ok) setPairing(res.data);
    else fail(res.error.message);
  };

  const publish = async (): Promise<void> => {
    const res = await window.nave.invoke('mobile:publish', undefined);
    if (res.ok && res.data.ok) useNave.setState({ info: t('mobile.published', { url: res.data.output || '' }) });
    else fail(res.ok ? res.data.output : res.error.message);
    refresh();
  };

  const revoke = async (device: MobileDevice): Promise<void> => {
    const res = await window.nave.invoke('mobile:revoke', { id: device.id });
    if (res.ok) {
      useNave.setState({ info: t('mobile.revoked') });
      refresh();
    } else fail(res.error.message);
  };

  const qr = pairing && qrFor?.url === pairing.url ? qrFor.image : null;
  const ts = status?.tailscale;
  const active = devices.filter((d) => d.revokedAt === null);

  return (
    <section className="backups" data-testid="mobile-access">
      <h3 className="brain-h">{t('mobile.title')}</h3>
      <label className="check">
        <input type="checkbox" data-testid="mobile-enable" checked={status?.enabled ?? false} onChange={(e) => void setEnabled(e.target.checked)} />
        {t('mobile.enable')}
      </label>
      <p className="muted">{t('mobile.hint')}</p>
      {status?.enabled && (
        <>
          <p data-testid="mobile-state">{status.running && status.localUrl ? t('mobile.running', { url: status.localUrl }) : t('mobile.stopped')}</p>
          <p className="muted">
            {!ts?.installed ? t('mobile.tailscaleMissing') : !ts.running ? t('mobile.tailscaleOff') : t('mobile.tailscaleOk', { name: ts.dnsName ?? '' })}
          </p>
          {ts?.installed && ts.running && (
            <>
              <GlassButton data-testid="mobile-publish" onClick={() => void publish()}>
                {t('mobile.publish')}
              </GlassButton>
              <p className="muted">{t('mobile.publishHint')}</p>
            </>
          )}
          <GlassButton variant="primary" data-testid="mobile-pair" onClick={() => void startPairing()}>
            {t('mobile.pair')}
          </GlassButton>
          {pairing && (
            <div data-testid="mobile-pairing">
              <p className="muted">{t('mobile.pairHint', { time: new Date(pairing.expiresAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) })}</p>
              {pairing.via === 'local' && <p className="muted">{t('mobile.pairLocal')}</p>}
              {qr && <img src={qr} alt={t('mobile.pair')} width={220} height={220} data-testid="mobile-qr" style={{ background: '#fff', borderRadius: 8 }} />}
              <label>
                {t('mobile.link')}
                <input readOnly data-testid="mobile-pair-url" value={pairing.url} onFocus={(e) => e.currentTarget.select()} />
              </label>
            </div>
          )}
          <h4>{t('mobile.devices')}</h4>
          <ul className="side-list backup-list">
            {active.map((d) => (
              <li key={d.id} className="task" data-testid="mobile-device">
                <span className="task-title">
                  {d.name} · {d.lastSeenAt ? t('mobile.lastSeen', { date: new Date(d.lastSeenAt).toLocaleString('es-ES') }) : t('mobile.never')}
                </span>
                <GlassButton variant="danger" data-testid="mobile-revoke" onClick={() => void revoke(d)}>
                  {t('mobile.revoke')}
                </GlassButton>
              </li>
            ))}
          </ul>
          {active.length === 0 && <p className="muted">{t('mobile.noDevices')}</p>}
        </>
      )}
    </section>
  );
}
