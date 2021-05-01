import { ColiderTypes } from '@piyoppi/pico2map-tiled-colision-detector'
import { Arrangement, ArrangementPaint, ArrangementDescription, ColiderTypesRequired } from './Arrangement'
import { BrushPaint } from './../Brush'

export const ColiderArrangementDescription: ArrangementDescription<ColiderTypes> = {
  name: 'ColiderArrangement',
  create: () => new ColiderArrangement()
}

export class ColiderArrangement implements Arrangement<ColiderTypes>, ColiderTypesRequired {
  private _coliderType: ColiderTypes = 0
  
  setColiderTypes(coliderType: ColiderTypes) {
    this._coliderType = coliderType
  }

  apply(paints: Array<BrushPaint>): Array<ArrangementPaint<ColiderTypes>> {
    return paints.map(paint => ({...paint, item: this._coliderType}))
  }
}
