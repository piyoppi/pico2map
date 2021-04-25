import { GridImageGenerator } from './../src/GridImageGenerator'

describe('#setGridSize', () => {
  it('Should set width and height', () => {
    const generator = new GridImageGenerator()

    generator.setGridSize(12, 34)
  
    expect(generator.width).toEqual(12)
    expect(generator.height).toEqual(34)
  })

  it('Should mark as changed', () => {
    const generator = new GridImageGenerator()

    generator.setGridSize(12, 34)

    expect(generator.changed).toEqual(true)
  })

  it('Should not mark as changed if generator is set to same size', () => {
    const generator = new GridImageGenerator()

    generator.setGridSize(12, 34)
    generator.setGridSize(12, 34)

    expect(generator.changed).toEqual(false)
  })
})

describe('gridColor', () => {
  it('Should set a color', () => {
    const generator = new GridImageGenerator()

    generator.gridColor = '#123456'
    
    expect(generator.gridColor).toEqual('#123456')
  })

  it('Should mark as changed', () => {
    const generator = new GridImageGenerator()

    generator.gridColor = '#123456'

    expect(generator.changed).toEqual(true)
  })

  it('Should not mark as changed if generator is set to same size', () => {
    const generator = new GridImageGenerator()

    generator.gridColor = '#123456'
    generator.gridColor = '#123456'

    expect(generator.changed).toEqual(false)
  })
})
