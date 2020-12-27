import { PenDescription } from './Pen'
import { RectangleBrushDescription } from './RectangleBrush'
import { Brush } from './Brush'

export interface RegisteredBrush {
  name: string
  brush: Brush
}

const registeredBrushDescriptions = [
  PenDescription,
  RectangleBrushDescription
]

export const Brushes = registeredBrushDescriptions.map( description => ({
  name: description.name,
  create: () => description.create()
}))
