export type SoundName = "pop" | "click" | "whoosh" | "win" | "boop" | "tick" | "drumroll";

type Ctor = typeof AudioContext;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  enabled = false;

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (this.ctx) return this.ctx;
    const Ctx: Ctor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
    if (!Ctx) return null;
    try {
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.16;
      this.master.connect(this.ctx.destination);
    } catch {
      this.ctx = null;
    }
    return this.ctx;
  }

  unlock(): void {
    const ctx = this.ensure();
    if (ctx && ctx.state === "suspended") void ctx.resume();
  }

  private tone(
    ctx: AudioContext,
    type: OscillatorType,
    from: number,
    to: number,
    start: number,
    duration: number,
    volume: number,
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, start);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(this.master ?? ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }

  private noise(ctx: AudioContext, start: number, duration: number, volume: number): void {
    const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(900, start);
    filter.frequency.exponentialRampToValueAtTime(2600, start + duration);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(this.master ?? ctx.destination);
    source.start(start);
  }

  play(name: SoundName): void {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    const t = ctx.currentTime + 0.01;

    switch (name) {
      case "pop":
        this.tone(ctx, "sine", 520, 880, t, 0.12, 0.5);
        break;
      case "click":
        this.tone(ctx, "square", 1200, 700, t, 0.05, 0.18);
        break;
      case "boop":
        this.tone(ctx, "sine", 300, 180, t, 0.16, 0.45);
        break;
      case "tick":
        this.tone(ctx, "triangle", 900, 900, t, 0.03, 0.2);
        break;
      case "whoosh":
        this.noise(ctx, t, 0.35, 0.35);
        break;
      case "win":
        this.tone(ctx, "sine", 523, 523, t, 0.12, 0.4);
        this.tone(ctx, "sine", 659, 659, t + 0.11, 0.12, 0.4);
        this.tone(ctx, "sine", 784, 784, t + 0.22, 0.2, 0.45);
        break;
      case "drumroll":
        for (let i = 0; i < 14; i++) {
          this.tone(ctx, "triangle", 180 + i * 4, 160, t + i * 0.055, 0.05, 0.16);
        }
        break;
    }
  }
}

export const soundEngine = new SoundEngine();

export function celebrate(detail?: { title?: string; description?: string }): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("trollverse:celebrate", { detail }));
}

export function fireAchievement(id: string, name: string, description: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("trollverse:achievement", { detail: { id, name, description } }),
  );
}
