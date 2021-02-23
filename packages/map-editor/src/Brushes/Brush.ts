import { Arrangement, ArrangementPaint } from './Arrangements/Arrangement';
import { MapChip } from '@piyoppi/pico2map-tiled'

export interface BrushPaint {
  x: number,
  y: number
}

export interface Brush<T> {
  setArrangement(arrangement: Arrangement<T>): void
  mouseDown(chipX: number, chipY: number): void
  mouseMove(chipX: number, chipY: number): Array<ArrangementPaint<T>>
  mouseUp(chipX: number, chipY: number): Array<ArrangementPaint<T>>
  cleanUp(): void
}

export interface BrushDescription {
  name: string
  create<T>(): Brush<T>
}
