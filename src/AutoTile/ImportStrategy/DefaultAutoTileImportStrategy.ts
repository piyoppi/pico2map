import { MapChipFragment } from './../../MapChip'
import { AutoTileImportStrategy, MapChipFragmentGroups } from './ImportStrategy'
import { MapChipImage } from './../../MapChips'

type MapChipFragments = Array<MapChipFragment>

export class DefaultAutoTileImportStrategy implements AutoTileImportStrategy {
  constructor(
    private _mapChipImage: MapChipImage,
    private _chipWidth: number,
    private _chipHeight: number,
  ) {

  }

  getMapChipFragments() {
    const countX = Math.floor(this._mapChipImage.image.width / this._chipWidth)
    const countY = Math.floor(this._mapChipImage.image.height / this._chipHeight)
    const mapChipFragmentGroups: MapChipFragmentGroups = []

    for (let y = 0; y < countY; y += 5) {
      for (let x = 0; x < countX; x++) {
        const mapChipFragments: MapChipFragments = []
        mapChipFragments.push(new MapChipFragment(x, y, this._mapChipImage.id))
        mapChipFragments.push(new MapChipFragment(x, y + 1, this._mapChipImage.id))
        mapChipFragments.push(new MapChipFragment(x, y + 2, this._mapChipImage.id))
        mapChipFragments.push(new MapChipFragment(x, y + 3, this._mapChipImage.id))
        mapChipFragments.push(new MapChipFragment(x, y + 4, this._mapChipImage.id))
        mapChipFragmentGroups.push(mapChipFragments)
      }
    }

    return mapChipFragmentGroups
  }
}
