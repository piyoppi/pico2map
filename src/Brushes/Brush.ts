import { Arrangement } from './Arrangements/Arrangement';
import { MapChip } from './../MapChip'

export interface BrushPaint {
  x: number,
  y: number,
  chip: MapChip | null
}

export interface Brush {
  setArrangement(arrangement: Arrangement): void
  mouseDown(chipX: number, chipY: number): void
  mouseMove(chipX: number, chipY: number): Array<BrushPaint>
  mouseUp(chipX: number, chipY: number): Array<BrushPaint>
  cleanUp(): void
}

export interface BrushDescription {
  name: string
  create(): Brush
}
