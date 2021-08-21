/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { DefaultArrangementDescription } from './DefaultArrangement'
import { AutoTileArrangementDescription } from './AutoTileArrangement'
import { DefaultEraseArrangementDescription } from './DefaultEraseArrangement'

const registeredArrangementDescriptions = [
  DefaultArrangementDescription,
  AutoTileArrangementDescription,
  DefaultEraseArrangementDescription
]

export const Arrangements = registeredArrangementDescriptions.map( description => ({
  name: description.name,
  create: () => description.create()
}))
