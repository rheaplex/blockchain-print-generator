const fs = require('fs')

const blockexplorer = require('blockchain.info/blockexplorer')

const utils = require('./utils.js')

///////////////////////////////////////////////////////////////////////////////
// Config
////////////////////////////////////////////////////////////////////////////////

const args = require('minimist')(process.argv.slice(2), {string: ['address']})
const paletteFunc = utils.hashPaletteFunc(args['palette'])
const elementFunc = utils.elementDrawingFunc(args['element'])
const cellWidth = parseInt(args['cellWidth'] || '20')
const cellHeight = parseInt(args['cellHeight'] || '20')
const cellMargin = parseInt(args['cellMargin'] || '0')
const docMargin = parseInt(args['docMargin'] || '45')
/*const addLegend = args['legend']
const fontSize = 8.0*/

const addr = args['address']
if (! addr) {
  console.log("You must pass --address")
  process.exit(1)
}

blockexplorer.getAddress(addr)
  .then(addressInfo => {
    const hashesColours = addressInfo.txs.map(tx => paletteFunc(tx.hash))
    const rowCount = hashesColours.length
    const pdf = utils.createGridPDF(16, rowCount,
                                    cellWidth, cellHeight,
                                    cellMargin, docMargin,
                                    Array.prototype.concat.apply([],
                                                                 hashesColours),
                                    elementFunc)
/*     if (addLegend) {
      pdf.fillColor('black')
        .fontSize(fontSize)
        .text('transactions from ' + addr + ' as of today',
              docMargin,
              (rowCount * cellHeight) + 9.0)
    }*/
    pdf.pipe(fs.createWriteStream('./' + addr + '-txes.pdf'))
    pdf.end()
  })

//const hash = '4c85469cc3aab17172ef9680338ec4a989830bea8449da2aaed594ccf1c7920e'
