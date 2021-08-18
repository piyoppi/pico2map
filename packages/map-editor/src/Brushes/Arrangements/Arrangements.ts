/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
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
