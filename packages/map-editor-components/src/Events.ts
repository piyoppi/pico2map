import { MapChipFragmentProperties, TiledMapDataItem } from '@piyoppi/pico2map-tiled'

interface MapChipSelectedDetail {
  selectedMapChipProperties: MapChipFragmentProperties
}

export class MapChipSelectedEvent extends CustomEvent<MapChipSelectedDetail> {
  constructor(detail: MapChipSelectedDetail) {
    super('mapchip-selected', { detail });
  }
}

interface AutoTileSelectedDetail {
  id: number
}

export class AutoTileSelectedEvent extends CustomEvent<AutoTileSelectedDetail> {
  constructor(detail: AutoTileSelectedDetail) {
    super('autotile-selected', { detail });
  }
}

export interface PickedMapChipDetail {
  picked: TiledMapDataItem
}

export class PickedMapChipEvent extends CustomEvent<PickedMapChipDetail> {
  constructor(detail: PickedMapChipDetail) {
    super('mapchip-picked', { detail });
  }
}
