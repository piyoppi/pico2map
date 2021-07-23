import { MapChipPicker } from '../src/MapChipPicker'
import { TiledMap, MapChipFragment, MapChip } from '@piyoppi/pico2map-tiled'

const c1 = new MapChip([new MapChipFragment(1, 0, 0)])
const c2 = new MapChip([new MapChipFragment(2, 0, 0)])

const tiledMap = new TiledMap(3, 3, 32, 32)
tiledMap.addLayer()
// layer 0
tiledMap.put(c1, 0, 0, 0)
tiledMap.put(c1, 1, 0, 0)
// layer 1
tiledMap.put(c2, 0, 0, 1)

describe('#pick', () => {
  it('Should Picking a map chip from the foreground layer', () => {
    const picker = new MapChipPicker(tiledMap)

    expect(picker.pick(0, 0)).toEqual(c2)
    expect(picker.pick(1, 0)).toEqual(c1)
    expect(picker.pick(2, 0)).toEqual(null)
  })

  it('Should picking a map chip from the specific layer when layer index is given', () => {
    const picker = new MapChipPicker(tiledMap)

    expect(picker.pick(0, 0, 0)).toEqual(c1)
    expect(picker.pick(0, 0, 1)).toEqual(c2)
  })
})
