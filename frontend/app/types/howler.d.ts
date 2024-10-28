declare module 'howler' {
  export interface Howl {
    play(spriteOrId?: string | number): number;
    pause(id?: number): this;
    stop(id?: number): this;
    mute(muted?: boolean, id?: number): this;
    volume(vol?: number, id?: number): this | number;
    seek(seek?: number, id?: number): this | number;
    playing(id?: number): boolean;
    duration(id?: number): number;
    state(): 'unloaded' | 'loading' | 'loaded';
    unload(): this;
  }

  export interface HowlOptions {
    src: string | string[];
    volume?: number;
    html5?: boolean;
    loop?: boolean;
    preload?: boolean;
    autoplay?: boolean;
    mute?: boolean;
    sprite?: { [key: string]: [number, number] };
    rate?: number;
    pool?: number;
    format?: string[];
    onload?: () => void;
    onloaderror?: (id: number, error: any) => void;
    onplay?: (id: number) => void;
    onend?: (id: number) => void;
    onpause?: (id: number) => void;
    onstop?: (id: number) => void;
    onmute?: (id: number) => void;
    onvolume?: (id: number) => void;
    onrate?: (id: number) => void;
    onseek?: (id: number) => void;
    onfade?: (id: number) => void;
  }

  export class Howl {
    constructor(options: HowlOptions);
  }

  export class Howler {
    static ctx: AudioContext;
    static masterGain: GainNode;
    static volume(vol?: number): number | this;
    static mute(muted?: boolean): boolean | this;
  }
}
