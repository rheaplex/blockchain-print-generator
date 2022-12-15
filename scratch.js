
///////////////////////////////////////////////////////////////////////////////
// Layout Calculation
///////////////////////////////////////////////////////////////////////////////

const gridWidthAndHeight = (numX, numY, cellWidth, cellHeight, margin) => {
  return [(numX * cellWidth)  + (margin * 2),
          (numY * cellHeight) + (margin * 2)]
}



const newGridPDF = (numX, numY, cellWidth, cellHeight, margin) => {
  return new PDFDocument({
    size: gridWidthAndHeight(numX, numY, cellWidth, cellHeight, margin)
  })
}

exports.createGridPDF = (
  numX,
  numY,
  cellWidth,
  cellHeight,
  cellMargin,
  margin,
  colours,
  elementFunc
) => {
  const doc = newGridPDF(numX, numY, cellWidth, cellHeight, margin)
  exports.rectGrid(doc, numX, numY, cellWidth, cellHeight, cellMargin, margin,
                   colours, elementFunc)
  return doc
}




/*const renderBitcoinTxHash = (
  nameBase, docSizePts, txHash, cellMarginsForElements = []
) => {
  utils.hashPaletteFuncNames.forEach(palette => {
    const tx_hash_colours = utils.hashPaletteFunc(palette)(txHash)
    utils.elementDrawingFuncNames.forEach(element => {
    const doc_filename =
          './' + nameBase + '-tx-hash-'
          + palette + '-'
          + element + '.pdf'
    const tx_hash_pdf = utils.newPDFSizedPoints(utils.pts100cm, utils.pts100cm)
    tx_hash_pdf.translate(utils.pts10cm, TX_HASH_TOP_PADDING)
    utils.rectGrid(tx_hash_pdf, 8, 4, TX_HASH_CELLSIZE, TX_HASH_CELLSIZE,
                   cellMarginsForElements[element], 0, tx_hash_colours,
                   utils.elementDrawingFunc(element))

    tx_hash_pdf.pipe(fs.createWriteStream(doc_filename))
    tx_hash_pdf.end()
  })
})*/
