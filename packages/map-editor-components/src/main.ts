import { MapChipSelectorComponent } from './MapChipSelectorComponent'
import { MapCanvasComponent } from './MapCanvasComponent'
import { AutoTileSelectorComponent } from  './AutoTileSelectorComponent'

export function defineComponent() {
  customElements.define('map-canvas-component', MapCanvasComponent)
  customElements.define('auto-tile-selector-component', AutoTileSelectorComponent)
  customElements.define('map-chip-selector-component', MapChipSelectorComponent)
}
export { Projects } from '@piyoppi/pico2map-editor'
export { MapChipSelectedEvent, AutoTileSelectedEvent } from './Events'
