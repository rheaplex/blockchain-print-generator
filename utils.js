///////////////////////////////////////////////////////////////////////////////
// Colour representations
///////////////////////////////////////////////////////////////////////////////

const DIV_1_255 = 1.0 / 255;
const DIV_255_8 = 255.0 / 8;
const DIV_255_4 = 255.0 / 4;
const DIV_1_16 = 1.0 / 16

// Strip any 0x we may have at the start of hexadecimal strings

const no0x = maybe0x => {
  if (maybe0x.startsWith('0x') || maybe0x.startsWith('0X')) {
    return maybe0x.substring(2)
  } else {
    return maybe0x
  }
}

// This is different from the one in blockchain-aesthetics

const nibbleValues = hash => no0x(hash).split('').map(hex => parseInt(hex, 16))

const byteValues = hash => {
  hash = no0x(hash)
  const values = Array()
  for (let i = 0; i < hash.length; i += 2) {
    const element = parseInt(hash.substring(i, i + 2), 16)
    values.push(element)
  }
  return values
}

const wordValues = hash => {
  hash = no0x(hash)
  const values = Array()
  for (let i = 0; i < hash.length; i += 4) {
    const element = parseInt(hash.substring(i, i + 4), 16)
    values.push(element)
  }
  return values
}

// The original, white/pale-avoiding 8-bit palette
// 8-8-4 256 colour RGB palette
const COLOUR_PALETTE_256 = Array();
for(let r = 0; r < 256; r += 32) {
  for(let g = 0; g < 256; g += 32) {
    for(let b = 0; b < 256; b += 64) {
      //const rgb = b | (g << 8) | (r << 16);
      //COLOUR_PALETTE_256.push('#' + rgb.toString(16));
      COLOUR_PALETTE_256.push([r, g, b])
    }
  }
}

// White/pale-including 8-bit palette
// 3-3-2 bit colour RGB palette
// https://en.wikipedia.org/wiki/List_of_monochrome_and_RGB_palettes#3-3-2_bit_RGB
const mul255div7 = 255.0 / 7;
const mul255div3 = 255.0 / 3;
const COLOUR_PALETTE_8BIT = Array();
for(let r = 0; r < 8; r++) {
    for(let g = 0; g < 8; g ++) {
	for(let b = 0; b < 4; b ++) {
	    COLOUR_PALETTE_8BIT.push([r * mul255div7, g * mul255div7, b * mul255div3])
    }
  }
}

const COLOUR_PALETTE_CGA = [
  "#000000", "#0000AA", "#00AA00", "#00AAAA",
  "#AA0000", "#AA00AA", "#AA5500", "#AAAAAA",
  "#555555", "#5555FF", "#55FF55", "#55FFFF",
  "#55FFFF", "#FF55FF", "#FFFF55", "#FFFFFF"
]

const hashBytesToPaletteColours = (hash, palette) => {
  const values = byteValues(hash)
  const colours = Array()
  values.forEach( value => {
    colours.push(palette[Math.floor(value)])
  })
  return colours
}

const hashNibblesToPaletteColours = (hash, palette) => {
  const values = nibbleValues(hash)
  const colours = Array()
  values.forEach( value => {
    colours.push(palette[Math.floor(value)])
  })
  return colours
}

const eightBitPaletteColours = hash => {
  return hashBytesToPaletteColours(hash, COLOUR_PALETTE_8BIT)
}

const eightBitDarkPaletteColours = hash => {
  return hashBytesToPaletteColours(hash, COLOUR_PALETTE_256)
}

// Hang on. We can get 2 of these out of each byte...

const cgaPaletteColours = hash => {
  return hashNibblesToPaletteColours(hash, COLOUR_PALETTE_CGA)
}

const rgbPaletteColours = hash => {
  const values = wordValues(hash)
  const colours = Array()
  values.forEach(function(value){
    const red = (value & 0xF800) >> 11
    const green = (value & 0x7E0) >> 5
    const blue = (value & 0x1F)
    colours.push([red << 3, green << 2, blue << 3])
  })
  return colours
}

const cmykPaletteColours = hash => {
  hash = no0x(hash)
  const colours = Array()
  for (let i = 0; i < hash.length; i += 8) {
    // In range 0..1
    const cyan = DIV_1_255 * parseInt(hash.substring(i, i + 2), 16) * 255
    const magenta = DIV_1_255 * parseInt(hash.substring(i + 2, i + 4), 16) * 255
    const yellow = DIV_1_255 * parseInt(hash.substring(i + 4, i + 6), 16) * 255
    // NOTE THE SCALE! Otherwise things end up too dark a lot of the time
    const key = DIV_1_255 * parseInt(hash.substring(i + 6, i + 8), 16) * 32
    colours.push([cyan, magenta, yellow, key])
  }
  return colours
}

const hashPaletteFunc = identifier => {
  let func = rgbPaletteColours
  switch (identifier) {
  case '8bit':
    func = eightBitPaletteColours
    break;
  case '8bitdark':
    func = eightBitDarkPaletteColours
    break;
  case 'cga':
    func = cgaPaletteColours
    break
  case 'cmyk':
    func = cmykPaletteColours
    break
  }
  return func
}

const hashPaletteFuncNames = [
    'rgb', '8bit', '8bitdark', 'cga', 'cmyk'
]

const hashPaletteFuncMods = {
    'rgb': 4,
    '8bit': 2,
    '8bitdark': 2,
    'cga': 2,
    'cmyk': 8
}

///////////////////////////////////////////////////////////////////////////////
// Elements
///////////////////////////////////////////////////////////////////////////////

const rectElement = (doc, x, y, width, height) => {
  return doc.rect(x, y, width, height)
}

const circleElement = (doc, x, y, width, height) => {
  return doc.circle(x + (width / 2.0),
                    y + (height / 2.0),
                    Math.min(width, height) / 2.0)
}

const elementDrawingFunc = (identifier) => {
  let func = rectElement
  switch (identifier) {
  case 'circle':
    func = circleElement
    break;
  }
  return func
}

// Note the cheat with square, this will just be a rect
const elementDrawingFuncNames = ['square', 'circle']

const outlineWhiteCircle = (
  doc, shapeX, shapeY, width, height, column, row, strokeWidth, strokeColour,
  colours, colourIndex, columnCount, rowCount, cellMargin
) => {
  const halfStrokeWidth = strokeWidth / 2.0
  doc.circle(shapeX + (width / 2.0),
             shapeY + (height / 2.0),
             (width / 2.0) - halfStrokeWidth)
    .lineWidth(strokeWidth)
    .stroke(strokeColour)
}

// Carefully outline only what we need to.
// We place lines inside the rect's bounds at the edge of the grid,
// and between adjacent white cells within the grid.
// The lineCap is correct for how we place lines.

const RECT_OUTLINE_INTERNAL = false

const outlineWhiteRect = (
  doc, x, y, width, height, column, row, strokeWidth, strokeColour, colours,
  colourIndex, columnCount, rowCount, cellMargin
) => {
  const halfStrokeWidth = strokeWidth / 2.0
  if (cellMargin > 0.0) {
    // The rect is inset, so stroke it all
    doc.rect(x + halfStrokeWidth, y + halfStrokeWidth,
             width - strokeWidth, height - strokeWidth)
      .lineWidth(strokeWidth)
      .stroke(strokeColour)
  } else {
    // Note implicit "column > 0" in the else
    if (column == 0) {
      // The cell is on the left edge
      doc.moveTo(x + halfStrokeWidth, y)
        .lineTo(x  + halfStrokeWidth, y + height)
        .lineWidth(strokeWidth)
        .lineCap('butt')
        .stroke(strokeColour)
    } else if (RECT_OUTLINE_INTERNAL
               && colourIsWhite(colours[colourIndex - 1])) {
      // The cell follows another white cell
      // Draw line between them
      doc.moveTo(x, y)
        .lineTo(x, y + height)
        .lineWidth(strokeWidth)
        .lineCap('butt')
        .stroke(strokeColour)
    }
    if ((column % columnCount) == (columnCount - 1)
        || colourIndex == (colours.length - 1)) {
      // If cell is on right edge or is the last cell with a colour
      // Draw line on right
      doc.moveTo((x + width) - halfStrokeWidth, y)
        .lineTo((x + width) - halfStrokeWidth, y + height)
        .lineWidth(strokeWidth)
        .lineCap('butt')
        .stroke(strokeColour)
    }
    // Note implicit "row > 0" in else
    if (row == 0) {
      // If cell is on the top edge
      // Draw line at top
      doc.moveTo(x, y + halfStrokeWidth)
        .lineTo(x + width, y + halfStrokeWidth)
        .lineWidth(strokeWidth)
        .lineCap('butt')
        .stroke(strokeColour)
    } else if (RECT_OUTLINE_INTERNAL
               && colourIsWhite(colours[colourIndex - columnCount])) {
      // If cell is below another white cell
      // Draw line between them
      doc.moveTo(x, y)
        .lineTo(x + width, y)
        .lineWidth(strokeWidth)
        .lineCap('butt')
        .stroke(strokeColour)
    }
    if ((row == (rowCount - 1))
        || (((colourIndex + columnCount) - colours.length) >= 0)) {
      // If cell is on the bottom edge or above an empty cell
      // Draw line at bottom
      doc.moveTo(x, (y + height) - halfStrokeWidth)
        .lineTo(x + width, (y + height) - halfStrokeWidth)
        .lineWidth(strokeWidth)
        .lineCap('butt')
        .stroke(strokeColour)

    }
  }
}

const elementOutlineWhiteFunc = (identifier) => {
  let func = outlineWhiteRect
  switch (identifier) {
  case 'circle':
    func = outlineWhiteCircle
    break;
  }
  return func
}

///////////////////////////////////////////////////////////////////////////////
// PDFs
////////////////////////////////////////////////////////////////////////////////

exports.pts100cm = 2834.6457
exports.pts10cm = 283.4646
exports.pts20cm = 566.9291
exports.pts80cm = 2267.716535433

const PDFDocument = require('pdfkit')
const fs = require('fs')

const newPDFSizedPoints = (width, height) => {
   return new PDFDocument({
     size: [width, height]
  })
}

const colourIsWhite = colour => (colour == '#FFFFFF')
      || ((colour.length == 3) && (colour.reduce((a, b) => a + b, 0) == 765))
      || ((colour.length == 4) && (colour.reduce((a, b) => a + b, 0) == 0))

//FIXME: Margin should be *internal* spacing - the name is accurate for now
// but we want a gap between elements, not a border around the composition.

const WHITE_SHAPE_STROKE_WIDTH = 0.1 // pts
const WHITE_SHAPE_STROKE_COLOUR = '#BBBBBB'

const rectGrid = (
  doc,
  numX,
  numY,
  cellWidth,
  cellHeight,
  cellMargin,
  margin,
  colours,
  elementName
) => {
  const elementFunc = elementDrawingFunc(elementName)
  const outlineWhiteElementFunc = elementOutlineWhiteFunc(elementName)
  let colourIndex = 0
  // Break point to escape inner loop
  finishColouring:
  for(let y = 0; y < numY; y++) {
    for(let x = 0; x< numX; x++) {
      const shapeX = margin + (x * cellWidth) + (cellMargin / 2.0)
      const shapeY = margin + (y * cellHeight)  + (cellMargin / 2.0)
      const shapeWidth = cellWidth - cellMargin
      const shapeHeight = cellHeight - cellMargin
      const shape = elementFunc(doc, shapeX, shapeY, shapeWidth, shapeHeight)
      const colour = colours[colourIndex]
      shape.fill(colour)
      if (colourIsWhite(colour)) {
        outlineWhiteElementFunc(doc, shapeX, shapeY, shapeWidth, shapeHeight,
                                x, y,
                                WHITE_SHAPE_STROKE_WIDTH,
                                WHITE_SHAPE_STROKE_COLOUR,
                                colours, colourIndex, numX, numY, cellMargin)
      }
      colourIndex++
      if (colourIndex == colours.length) {
        break finishColouring
      }
    }
  }
}

const translateForGridMargins = (doc, cellSize, cellsX, cellsY) => {
  const xOffset = (doc.page.width - (cellSize * cellsX)) /2.0
  const yOffset = (doc.page.height - (cellSize * cellsY)) /2.0
  doc.translate(xOffset, yOffset)
}

const renderColours = (
  doc, drawingSizePts, cellPadding, colours, elementFunc
) => {
  //FIXME: Generalize this to handle portrait and simplify the code in obvious
  // ways.
  if (colours.length <= 8) {
    let cellSize = drawingSizePts /  4.0
    translateForGridMargins(doc, cellSize, 4, 2)
    rectGrid(doc, 4, 2, cellSize, cellSize, cellSize * cellPadding, 0, colours,
             elementFunc)

  } else if (colours.length <= 16) {
    let cellSize = drawingSizePts /  4.0
    translateForGridMargins(doc, cellSize, 4, 4)
    rectGrid(doc, 4, 4, cellSize, cellSize, cellSize * cellPadding, 0, colours,
             elementFunc)
  } else if (colours.length <= 20) {
    let cellSize = drawingSizePts /  5.0
    translateForGridMargins(doc, cellSize, 5, 4)
    rectGrid(doc, 5, 4, cellSize, cellSize, cellSize * cellPadding, 0, colours,
             elementFunc)
  }else if (colours.length <= 32) {
    cellSize = drawingSizePts / 8.0
    translateForGridMargins(doc, cellSize, 8, 4)
    rectGrid(doc, 8, 4, cellSize, cellSize, cellSize * cellPadding, 0, colours,
             elementFunc)
  } else if (colours.length <= 64) {
    cellSize = drawingSizePts / 8.0
    translateForGridMargins(doc, cellSize, 8, 8)
    rectGrid(doc, 8, 8, cellSize, cellSize, cellSize * cellPadding, 0, colours,
             elementFunc)
  } else if (colours.length <= 70) {
    cellSize = drawingSizePts / 10.0
    translateForGridMargins(doc, cellSize, 10, 7)
    rectGrid(doc, 10, 7, cellSize, cellSize, cellSize * cellPadding, 0, colours,
             elementFunc)
  } else if (colours.length <= 64) {
    cellSize = drawingSizePts / 8.0
    translateForGridMargins(doc, cellSize, 8, 8)
    rectGrid(doc, 8, 8, cellSize, cellSize, cellSize * cellPadding, 0, colours,
             elementFunc)
  } else if (colours.length <= 70) {
    cellSize = drawingSizePts / 10.0
    translateForGridMargins(doc, cellSize, 10, 7)
    rectGrid(doc, 10, 7, cellSize, cellSize, cellSize * cellPadding, 0, colours,
             elementFunc)
      // DELIBERATELY SO 80-BYTE HEADER HAS 4 EMPTY CELLS AT END
      // THIS IS TO RESEMBLE THE RAW GENESIS BLOCK/DIFFERENTIATE FROM A REGULAR
      // GRID OF HASHES
  } else if (colours.length <= 84) {
    cellSize = drawingSizePts / 14.0
    translateForGridMargins(doc, cellSize, 14, 6)
    rectGrid(doc, 14, 6, cellSize, cellSize, cellSize * cellPadding, 0, colours,
             elementFunc)
  } else if (colours.length <= 140) {
    cellSize = drawingSizePts / 14.0
    translateForGridMargins(doc, cellSize, 14, 10)
    rectGrid(doc, 14, 10, cellSize, cellSize, cellSize * cellPadding, 0,
             colours, elementFunc)
  } else if (colours.length <= 280){
    cellSize = drawingSizePts / 20
    translateForGridMargins(doc, cellSize, 20, 14)
    rectGrid(doc, 20, 14, cellSize, cellSize, cellSize * cellPadding, 0,
             colours, elementFunc)

  } else if (colours.length <= 289){
    cellSize = drawingSizePts / 17
    translateForGridMargins(doc, cellSize, 17, 17)
    rectGrid(doc, 17, 17, cellSize, cellSize, cellSize * cellPadding, 0,
             colours, elementFunc)
  } else if (colours.length <= 576){
    cellSize = drawingSizePts / 24
    translateForGridMargins(doc, cellSize, 24, 24)
    rectGrid(doc, 24, 24, cellSize, cellSize, cellSize * cellPadding, 0,
             colours, elementFunc)
  } else if (colours.length < 13200) {
    cellSize = drawingSizePts / 118
    translateForGridMargins(doc, cellSize, 118, 112)
      rectGrid(doc, 118, 112, cellSize, cellSize, cellSize * cellPadding, 0,
             colours, elementFunc)
  } else if (colours.length < 26400) {
    cellSize = drawingSizePts / 165
    translateForGridMargins(doc, cellSize, 165, 160)
      rectGrid(doc, 165, 160, cellSize, cellSize, cellSize * cellPadding, 0,
             colours, elementFunc)
  } else if (colours.length <= 399424){
    cellSize = drawingSizePts / 632
    translateForGridMargins(doc, cellSize, 632, 632)
      rectGrid(doc, 632, 632, cellSize, cellSize, cellSize * cellPadding, 0,
             colours, elementFunc)
  } else {
    console.log("I don't know how to render a colour array of length "
                + colours.length)
  }
}

///////////////////////////////////////////////////////////////////////////////
// Drawing particular kinds of things
////////////////////////////////////////////////////////////////////////////////

exports.renderData = (
  data, nameBase, docWidthPts, docHeightPts, drawingSizePts,
  cellMarginsForElements = []
) => {
  hashPaletteFuncNames.forEach(palette => {
    if ((data.length % hashPaletteFuncMods[palette]) == 0) {
      const tx_hash_colours = hashPaletteFunc(palette)(data)
      elementDrawingFuncNames.forEach(element => {
        const cellPadding = cellMarginsForElements[element] || 0.0
        const doc_filename = nameBase + '-' + palette + '-' + element + 's.pdf'
        console.log(doc_filename)
        const tx_hash_pdf = newPDFSizedPoints(docWidthPts, docHeightPts)
        renderColours(tx_hash_pdf, drawingSizePts, cellPadding, tx_hash_colours,
                      element)
        tx_hash_pdf.pipe(fs.createWriteStream(doc_filename))
        tx_hash_pdf.end()
      })
    }
  })
}
