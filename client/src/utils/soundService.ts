class SoundService {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Check localStorage for saved sound preference
    const saved = localStorage.getItem('questify_sound_muted');
    if (saved !== null) {
      this.muted = saved === 'true';
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('questify_sound_muted', String(this.muted));
    return this.muted;
  }

  public setMuted(val: boolean): void {
    this.muted = val;
    localStorage.setItem('questify_sound_muted', String(this.muted));
  }

  /**
   * Helper to play an 8-bit chip synth tone
   */
  private playTone(
    freq: number,
    type: OscillatorType,
    duration: number,
    startTime: number = 0,
    volume: number = 0.15
  ): void {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Sound: UI Click / Tap
   */
  public playClick(): void {
    this.playTone(600, 'square', 0.05, 0, 0.08);
  }

  /**
   * Sound: Coin pickup jingle (classic Mario/RPG double blip)
   */
  public playCoin(): void {
    this.playTone(987.77, 'square', 0.08, 0, 0.12);      // B5
    this.playTone(1318.51, 'square', 0.28, 0.08, 0.14);   // E6
  }

  /**
   * Sound: Equip armor/weapon (metallic clank)
   */
  public playEquip(): void {
    this.playTone(320, 'triangle', 0.06, 0, 0.2);
    this.playTone(580, 'square', 0.12, 0.04, 0.15);
  }

  /**
   * Sound: Shop item purchased (cash register chime)
   */
  public playBuy(): void {
    this.playTone(880, 'square', 0.08, 0, 0.12);
    this.playTone(1108, 'square', 0.08, 0.07, 0.12);
    this.playTone(1320, 'square', 0.2, 0.14, 0.15);
  }

  /**
   * Sound: Mission completed fanfare
   */
  public playMissionComplete(): void {
    // Joyful RPG quest solved arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      this.playTone(freq, 'square', 0.15, index * 0.09, 0.15);
    });
  }

  /**
   * Sound: Epic Level Up fanfare
   */
  public playLevelUp(): void {
    // Grand triumphant fanfare (C - E - G - C6 - D6 - E6 - G6)
    const melody = [
      { f: 523.25, d: 0.12, t: 0.0 },
      { f: 659.25, d: 0.12, t: 0.1 },
      { f: 783.99, d: 0.12, t: 0.2 },
      { f: 1046.5, d: 0.18, t: 0.3 },
      { f: 1174.66, d: 0.18, t: 0.45 },
      { f: 1318.51, d: 0.22, t: 0.6 },
      { f: 1567.98, d: 0.5, t: 0.8 },
    ];
    melody.forEach((note) => {
      this.playTone(note.f, 'square', note.d, note.t, 0.18);
    });
  }
}

export const sound = new SoundService();
