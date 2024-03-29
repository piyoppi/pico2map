/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import { CursorPositionCalculator } from './Helpers/CursorPositionCalculator'
import { GridImageGenerator, convertFromCursorPositionToChipPosition, convertChipPositionDivisionByCursorSize } from '@piyoppi/pico2map-editor'

export class MapGridComponent extends LitElement {
  private gridImageSrc = ''
  private gridImageGenerator: GridImageGenerator = new GridImageGenerator()
  private cursorPositionCalculator = new CursorPositionCalculator()
  private mapMouseDownPosition = {x: -1, y: -1}
  private lastCursor = {x: -1, y: -1}
  private isMouseDown = false
  private mouseUpEventCallee: ((e: MouseEvent) => void) | null = null

  @property({type: Number}) gridWidth = 0
  @property({type: Number}) gridHeight = 0
  @property({type: Number}) chipCountX = 0
  @property({type: Number}) chipCountY = 0
  @property({type: Boolean}) cursorHidden = false
  @property({type: Number}) cursorX = 0
  @property({type: Number}) cursorY = 0
  @property({type: Number}) cursorWidth = 1
  @property({type: Number}) cursorHeight = 1

  @property({type: String})
  get gridColor(): string {
    return this.gridImageGenerator.gridColor
  }
  set gridColor(value: string) {
    const oldValue = this.gridImageGenerator.gridColor
    this.gridImageGenerator.gridColor = value

    this.requestUpdate('gridColor', oldValue)
  }

  private get width() {
    return this.chipCountX * this.gridWidth
  }

  private get height() {
    return this.chipCountY * this.gridHeight
  }

  get cursorPosition() {
    return {
      x: this.cursorX * this.gridWidth,
      y: this.cursorY * this.gridHeight
    }
  }

  firstUpdated() {
    const element = this.shadowRoot?.getElementById('boundary')
    if (element) this.cursorPositionCalculator.setElement(element)
  }

  mouseDown(e: MouseEvent) {
    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    const cursor = this.convertFromCursorPositionToChipPosition(mouseCursorPosition.x, mouseCursorPosition.y)
    this.mapMouseDownPosition = this.lastCursor = cursor
    this.isMouseDown = true

    this.mouseUpEventCallee = () => this.mouseUp()
    document.addEventListener('mouseup', this.mouseUpEventCallee)
  }

  mouseMove(e: MouseEvent) {
    if (this.cursorHidden) return

    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    let cursor = this.convertFromCursorPositionToChipPosition(mouseCursorPosition.x, mouseCursorPosition.y)

    if (this.isMouseDown) {
      cursor = convertChipPositionDivisionByCursorSize(
        cursor.x,
        cursor.y,
        this.mapMouseDownPosition.x,
        this.mapMouseDownPosition.y,
        this.cursorWidth,
        this.cursorHeight
      )
    }

    if (cursor.x === this.lastCursor.x && cursor.y === this.lastCursor.y) return
    this.lastCursor = cursor

    this.cursorX = cursor.x
    this.cursorY = cursor.y
  }

  mouseUp() {
    this.isMouseDown = false
    if (this.mouseUpEventCallee) document.removeEventListener('mouseup', this.mouseUpEventCallee)

    this.mouseUpEventCallee = null
  }

  private convertFromCursorPositionToChipPosition(x: number, y: number) {
    return convertFromCursorPositionToChipPosition(
      x,
      y,
      this.gridWidth,
      this.gridHeight,
      this.chipCountX,
      this.chipCountY,
      this.cursorWidth,
      this.cursorHeight
    )
  }

  render() {
    this.gridImageGenerator.setGridSize(this.gridWidth, this.gridHeight)
    if (this.gridImageGenerator.changed) {
      this.gridImageSrc = this.gridImageGenerator.generateLinePart().toDataURL()
    }

    return html`
      <style>
        .grid {
          background-image: url("${this.gridImageSrc}");
        }

        #boundary {
          width: ${this.width + 1}px;
          height: ${this.height + 1}px;
        }

        .cursor {
          width: ${this.gridWidth * this.cursorWidth}px;
          height: ${this.gridHeight * this.cursorHeight}px;
          left: ${this.cursorPosition.x}px;
          top: ${this.cursorPosition.y}px;
        }

        .grid-image {
          background-position: 1px 1px
        }
      </style>

      <div id="boundary">
        <div
          class="grid-image grid"
          @mousedown="${(e: MouseEvent) => this.mouseDown(e)}"
          @mousemove="${(e: MouseEvent) => this.mouseMove(e)}"
        ></div>
        ${!this.cursorHidden ? html`<div class="cursor"></div>` : null}
      </div>
    `;
  }

  static get styles() {
    return css`
      .grid-image {
        position: absolute;
        top: 0;
        left: 0;
        background-repeat: repeat;
        width: 100%;
        height: 100%;
      }

      #boundary {
        position: relative;
      }

      .cursor {
        position: absolute;
        border-style: solid;
        box-sizing: border-box;
        border-color: red;
        pointer-events: none;
      }
    `
  }
}
