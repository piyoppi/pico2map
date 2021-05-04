import { Brush } from './../../src/Brushes/Brush'
import { Arrangement } from '../../src/Brushes/Arrangements/Arrangement'

export class EmptyBrush<T> implements Brush<T> {
  setArrangement(_: Arrangement<T>) {}
  mouseDown(_: number, __: number) {}
  mouseMove(_: number, __: number) {return []}
  mouseUp(_: number, __: number) {return []}
  cleanUp() {}
}
