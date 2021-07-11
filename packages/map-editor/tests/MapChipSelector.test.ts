import { MapChipSelector } from './../src/MapChipSelector'
import { TiledMap, MapChipFragment, MapChipImage } from '@piyoppi/pico2map-tiled'

const tiledMap = new TiledMap(30, 30, 32, 32)
const chipImage = new MapChipImage('dummy.png', 1)

chipImage.getChipCount = jest.fn().mockReturnValue({width: 4, height: 8})

describe('#mouseDown', () => {
  it('Should set startChipPosition and selectedSize', () => {
    const selector = new MapChipSelector(tiledMap, chipImage)

    selector.mouseDown(40, 80)

    expect(selector.startChipPosition).toEqual({x: 1, y: 2})
    expect(selector.startPosition).toEqual({x: 32, y: 64})
    expect(selector.selectedChipSize).toEqual({width: 1, height: 1})
    expect(selector.selectedSize).toEqual({width: 32, height: 32})
  })

  it('The state of selecting is true', () => {
    const selector = new MapChipSelector(tiledMap, chipImage)
      
    selector.mouseDown(40, 80)

    expect(selector.selecting).toEqual(true)
  })
})

describe('#mouseMove', () => {
  it('Should set selectedSize values', () => {
    const selector = new MapChipSelector(tiledMap, chipImage)

    selector.mouseDown(40, 80)
    selector.mouseMove(120, 180)
    
    expect(selector.startChipPosition).toEqual({x: 1, y: 2})
    expect(selector.startPosition).toEqual({x: 32, y: 64})
    expect(selector.selectedChipSize).toEqual({width: 3, height: 4})
    expect(selector.selectedSize).toEqual({width: 96, height: 128})
  })

  it('Should not set selectedSize values while not selecting yet', () => {
    const selector = new MapChipSelector(tiledMap, chipImage)

    selector.mouseMove(120, 180)

    expect(selector.startChipPosition).toEqual({x: -1, y: -1})
    expect(selector.selectedChipSize).toEqual({width: 1, height: 1})
  })
})

describe('#mouseUp', () => {
  it('Should set selectedSize values', () => {
    const selector = new MapChipSelector(tiledMap, chipImage)

    selector.mouseDown(40, 80)
    selector.mouseMove(80, 120)
    selector.mouseUp(120, 180)
    
    expect(selector.startChipPosition).toEqual({x: 1, y: 2})
    expect(selector.startPosition).toEqual({x: 32, y: 64})
    expect(selector.selectedChipSize).toEqual({width: 3, height: 4})
    expect(selector.selectedSize).toEqual({width: 96, height: 128})
  })

  it('The state of selecting is false', () => {
    const selector = new MapChipSelector(tiledMap, chipImage)

    selector.mouseDown(40, 80)
    selector.mouseUp(120, 180)
    
    expect(selector.selecting).toEqual(false)
  })

  it('Should set selectedChips', () => {
    const selector = new MapChipSelector(tiledMap, chipImage)

    selector.mouseDown(40, 80)
    selector.mouseUp(80, 80)

    expect(selector.selectedChips).toEqual([
      new MapChipFragment(1, 2, chipImage.id),
      new MapChipFragment(2, 2, chipImage.id)
    ])

    selector.mouseDown(80, 80)
    selector.mouseUp(40, 80)

    expect(selector.selectedChips).toEqual([
      new MapChipFragment(1, 2, chipImage.id),
      new MapChipFragment(2, 2, chipImage.id)
    ])
  })

  it('Should set selectedChips when the cursor x-position is outside of image', () => {
    const selector = new MapChipSelector(tiledMap, chipImage)

    selector.mouseDown(40, 80)
    selector.mouseUp(2000, 80)
    
    expect(selector.selectedChips).toEqual([
      new MapChipFragment(1, 2, chipImage.id),
      new MapChipFragment(2, 2, chipImage.id),
      new MapChipFragment(3, 2, chipImage.id),
    ])
  })

  it('Should set selectedChips when the cursor y-position is outside of image', () => {
    const selector = new MapChipSelector(tiledMap, chipImage)

    selector.mouseDown(40, 180)
    selector.mouseUp(40, 8000)
    
    expect(selector.selectedChips).toEqual([
      new MapChipFragment(1, 5, chipImage.id),
      new MapChipFragment(1, 6, chipImage.id),
      new MapChipFragment(1, 7, chipImage.id)
    ])
  })
})
