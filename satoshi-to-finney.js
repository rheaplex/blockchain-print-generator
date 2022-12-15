const utils = require('./utils.js')

// https://bitcointalk.org/index.php?topic=1448212.0

const BLOCK_HEIGHT = '170'

// https://www.blockchain.com/btc/block/00000000d1145790a8694403d4063f323d499e655c83426834d4ce2f8dd4a2ee

// 32 bytes

const BLOCK_HASH = '00000000d1145790a8694403d4063f323d499e655c83426834d4ce2f8dd4a2ee'

// https://blockchain.info/tx/f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16

// 32 Bytes

const TX_HASH = 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16'

// https://blockchain.info/tx/f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16?format=hex

// 275 bytes. 280 = 14 x 20

const TX_RAW = '0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000'

const NAME_BASE = './drawings/btc-first-send-satoshi-finney'

utils.renderData(BLOCK_HASH, NAME_BASE + '-block-hash',
                 utils.pts100cm, utils.pts100cm,
                 utils.pts80cm, {'circle': 0.1})

utils.renderData(TX_HASH, NAME_BASE + '-tx-hash',
                 utils.pts100cm, utils.pts100cm,
                 utils.pts80cm, {'circle': 0.1})

utils.renderData(TX_RAW, NAME_BASE + '-tx-raw',
                 utils.pts100cm, utils.pts100cm,
                 utils.pts80cm, {'circle': 0.1})
