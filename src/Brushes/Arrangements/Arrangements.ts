import { DefaultArrangementDescription } from './DefaultArrangement'
import { AutoTileArrangementDescription } from './AutoTileArrangement'

const registeredArrangementDescriptions = [
  DefaultArrangementDescription,
  AutoTileArrangementDescription 
]

export const Arrangements = registeredArrangementDescriptions.map( description => ({
  name: description.name,
  create: () => description.create()
}))
