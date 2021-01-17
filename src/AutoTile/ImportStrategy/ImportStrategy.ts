import { MapChipFragment } from "./../../MapChip"
export type MapChipFragmentGroups = Array<Array<MapChipFragment>>

export interface AutoTileImportStrategy {
  getMapChipFragments(): MapChipFragmentGroups
}
