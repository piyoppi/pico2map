import { MapChipFragment, MapChipFragmentProperties } from './../MapChip'

export type AutoTileProperties = {
  id: number,
  mapChipFragments: Array<MapChipFragmentProperties>
}

export class AutoTile {
  constructor(
    private _mapChipFragments: Array<MapChipFragment>,
    private _id: number
  ) {
  }

  get id() {
    return this._id
  }

  get mapChipFragments() {
    return this._mapChipFragments
  }

  getMapChipImageIds(): Array<number> {
    return this._mapChipFragments.map(fragment => fragment.chipId)
  }

  toObject(): AutoTileProperties {
    return {
      id: this._id,
      mapChipFragments: this._mapChipFragments.map(fragment => fragment.toObject())
    }
  }

  static fromObject(val: AutoTileProperties): AutoTile {
    return new AutoTile(val.mapChipFragments.map(fragment => MapChipFragment.fromObject(fragment)), val.id)
  }
}
