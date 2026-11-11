// Web Audio API Synthesized Audio Alerts for Health Reminders

class NotificationSoundService {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      try {
        this.audioCtx = new AudioContextClass();
      } catch (e) {
        console.warn('AudioContext initialization failed', e);
        return null;
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    return this.audioCtx;
  }

  /**
   * Pleasant ascending harmonic chime for medication reminders
   */
  playMedicationChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = ctx.currentTime + 0.05;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.12);

      gain.gain.setValueAtTime(0, startTime + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, startTime + index * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + index * 0.12);
      osc.stop(startTime + index * 0.12 + 0.38);
    });
  }

  /**
   * Resonant clinical dual-pulse chime for vital signs monitoring reminders
   */
  playVitalsReminderChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const pulses = [
      { freq: 440, start: 0.05 },
      { freq: 880, start: 0.18 },
      { freq: 880, start: 0.38 },
    ];

    const baseTime = ctx.currentTime;

    pulses.forEach(({ freq, start }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, baseTime + start);

      gain.gain.setValueAtTime(0, baseTime + start);
      gain.gain.linearRampToValueAtTime(0.15, baseTime + start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, baseTime + start + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(baseTime + start);
      osc.stop(baseTime + start + 0.25);
    });
  }
}

export const notificationSound = new NotificationSoundService();

/**
 * Native Browser Notification helpers
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch {
    return 'denied';
  }
}

export function dispatchBrowserNotification(title: string, options?: NotificationOptions) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    } catch (e) {
      console.warn('Native notification failed', e);
    }
  }
}
