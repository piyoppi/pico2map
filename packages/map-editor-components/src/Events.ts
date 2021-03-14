import { MapChipFragmentProperties } from '@piyoppi/pico2map-tiled'

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
