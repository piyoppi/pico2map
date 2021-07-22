import { AutoTileSelector } from '../src/AutoTileSelector'
import { AutoTile, AutoTiles, MapChipFragment, MapChipsCollection, MapChipImage } from '@piyoppi/pico2map-tiled'

const autoTiles = new AutoTiles()
autoTiles.push(new AutoTile([new MapChipFragment(0, 0, 1)], 1))
autoTiles.push(new AutoTile([new MapChipFragment(1, 0, 1)], 2))
autoTiles.push(new AutoTile([new MapChipFragment(2, 0, 1)], 3))
autoTiles.push(new AutoTile([new MapChipFragment(3, 0, 1)], 4))
autoTiles.push(new AutoTile([new MapChipFragment(4, 0, 1)], 5))
autoTiles.push(new AutoTile([new MapChipFragment(5, 0, 1)], 6))
autoTiles.push(new AutoTile([new MapChipFragment(6, 0, 1)], 7))
autoTiles.push(new AutoTile([new MapChipFragment(7, 0, 1)], 8))
autoTiles.push(new AutoTile([new MapChipFragment(8, 0, 1)], 9))
autoTiles.push(new AutoTile([new MapChipFragment(9, 0, 1)], 10))

const mapChips = new MapChipsCollection()
const mapChipImage = new MapChipImage('dummy.png', 1)
mapChips.push(mapChipImage)

describe('getSizeOfIndexImage', () => {
  it('Should return the size', () => {
    const selector = new AutoTileSelector(128, 32, 32, autoTiles, mapChips)

    expect(selector.getSizeOfIndexImage()).toEqual({width: 128, height: 96})
  })
})

describe('generateIndexImage', () => {
  it('Should call canvas.drawImage', () => {
    const selector = new AutoTileSelector(128, 32, 32, autoTiles, mapChips)
    const drawImageMock = jest.fn()
    const dummyCanvas = {
      getContext: () => ({
        drawImage: drawImageMock,
        clearRect: jest.fn()
      }),
    }

    selector.generateIndexImage(dummyCanvas as any)

    expect(drawImageMock).toHaveBeenNthCalledWith( 1, expect.anything(),   0, 0, 32, 32,  0,  0, 32, 32)
    expect(drawImageMock).toHaveBeenNthCalledWith( 2, expect.anything(),  32, 0, 32, 32, 32,  0, 32, 32)
    expect(drawImageMock).toHaveBeenNthCalledWith( 3, expect.anything(),  64, 0, 32, 32, 64,  0, 32, 32)
    expect(drawImageMock).toHaveBeenNthCalledWith( 4, expect.anything(),  96, 0, 32, 32, 96,  0, 32, 32)
    expect(drawImageMock).toHaveBeenNthCalledWith( 5, expect.anything(), 128, 0, 32, 32,  0, 32, 32, 32)
    expect(drawImageMock).toHaveBeenNthCalledWith( 6, expect.anything(), 160, 0, 32, 32, 32, 32, 32, 32)
    expect(drawImageMock).toHaveBeenNthCalledWith( 7, expect.anything(), 192, 0, 32, 32, 64, 32, 32, 32)
    expect(drawImageMock).toHaveBeenNthCalledWith( 8, expect.anything(), 224, 0, 32, 32, 96, 32, 32, 32)
    expect(drawImageMock).toHaveBeenNthCalledWith( 9, expect.anything(), 256, 0, 32, 32,  0, 64, 32, 32)
    expect(drawImageMock).toHaveBeenNthCalledWith(10, expect.anything(), 288, 0, 32, 32, 32, 64, 32, 32)
  })
})
