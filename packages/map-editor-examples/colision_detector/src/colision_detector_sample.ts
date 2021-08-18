/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { Projects, defineComponent } from '@piyoppi/pico2map-ui-components'
import { TiledMap } from '@piyoppi/pico2map-tiled'
import { TiledColisionDetector } from '@piyoppi/pico2map-tiled-colision-detector'

// Define some custom elements
defineComponent()

// Get some elements
const mapCanvas = document.getElementById('mapCanvas') as HTMLInputElement
const characterElement = document.getElementById('character') as HTMLDivElement

/**
 * Update characterElement state
 */
function updateDisplayedCharacter(x: number, y: number) {
  characterElement.style.left = `${x}px`
  characterElement.style.top = `${y}px`
}

async function initialize() {

  /**
   * Initialize tiledMap
   */

  const chipSize = { width: 32, height: 32 }
  const serializedDataResponse = await fetch("assets/json/map.json")
  const tiledMap = TiledMap.fromObject(await serializedDataResponse.json())
  const newProject = Projects.add(tiledMap)
  mapCanvas.setAttribute('projectId', newProject.projectId.toString())

  /**
   * Character controller
   */

  const character = {x: 0, y: 0, width: 24, height: 24}
  const detector = new TiledColisionDetector(tiledMap.coliders, chipSize.width, chipSize.height)
  const velocity = 3

  document.addEventListener('keydown', e => {
    switch(e.key) {
      case 'ArrowUp':
        character.y -= velocity
        break
      case 'ArrowDown':
        character.y += velocity
        break
      case 'ArrowLeft':
        character.x -= velocity
        break
      case 'ArrowRight':
        character.x += velocity
        break
    }

    // Solve character position
    const overlapped = detector.solveOverlapped(character)
    character.x += overlapped.dx
    character.y += overlapped.dy

    updateDisplayedCharacter(character.x, character.y)
  })

  updateDisplayedCharacter(character.x, character.y)
}
initialize()
