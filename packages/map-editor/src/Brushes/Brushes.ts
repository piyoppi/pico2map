import { PenDescription } from './Pen'
import { RectangleBrushDescription } from './RectangleBrush'
import { Brush } from './Brush'

const registeredBrushDescriptions = [
  PenDescription,
  RectangleBrushDescription
]

export const Brushes = registeredBrushDescriptions.map( description => ({
  name: description.name,
  create: <T>() => description.create<T>()
}))
