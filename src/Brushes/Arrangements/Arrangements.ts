import { DefaultArrangementDescription } from './DefaultArrangement'
import { AutoTileArrangementDescription } from './AutoTileArrangement'
import { EraseArrangementDescription } from './EraseArrangement'

const registeredArrangementDescriptions = [
  DefaultArrangementDescription,
  AutoTileArrangementDescription,
  EraseArrangementDescription
]

export const Arrangements = registeredArrangementDescriptions.map( description => ({
  name: description.name,
  create: () => description.create()
}))
