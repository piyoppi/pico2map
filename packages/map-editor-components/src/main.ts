/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { MapChipSelectorComponent } from './MapChipSelectorComponent'
import { MapCanvasComponent } from './MapCanvasComponent'
import { AutoTileSelectorComponent } from  './AutoTileSelectorComponent'
import { ColiderMarkerComponent } from  './ColisionMarkerComponent'
import { MapGridComponent } from  './MapGridComponent'

export function defineComponent() {
  customElements.define('map-canvas-component', MapCanvasComponent)
  customElements.define('auto-tile-selector-component', AutoTileSelectorComponent)
  customElements.define('map-chip-selector-component', MapChipSelectorComponent)
  customElements.define('colider-marker-component', ColiderMarkerComponent)
  customElements.define('map-grid-component', MapGridComponent)
}
export { Projects } from '@piyoppi/pico2map-editor'
export { MapChipSelectedEvent, AutoTileSelectedEvent, PickedMapChipEvent } from './Events'
export { PickedArrangementSelector } from './PickedArrangementSelector'
