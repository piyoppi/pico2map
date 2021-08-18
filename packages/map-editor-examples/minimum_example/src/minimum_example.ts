/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { Projects, defineComponent } from '@piyoppi/pico2map-ui-components'
import { TiledMap, MapChipImage } from '@piyoppi/pico2map-tiled'

// Define some custom elements
defineComponent()

// Map size is 15 x 10, MapChip size is 32 x 32px
const tiledMap = new TiledMap(15, 10, 32, 32)

// MapChip image (using 'chip.png' and chipId = 1)
const mapChipImage = new MapChipImage("images/chip.png", 1)

const init = async () => {
  await mapChipImage.waitWhileLoading()
  tiledMap.mapChipsCollection.push(mapChipImage)

  // Attach tiledMap to project(projectId: 1)
  Projects.add(tiledMap, 1)
}

init()
