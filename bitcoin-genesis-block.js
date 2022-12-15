const utils = require('./utils.js')

const BLOCK_HEIGHT = '0'

// https://www.blockchain.info/block/000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f

// 32 bytes

const BLOCK_HASH = '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f'

// https://blockchain.info/block/000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f?format=hex

const BLOCK_RAW = '0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c0101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000'

const NAME_BASE = './drawings/btc-genesis-block'

utils.renderData(BLOCK_HASH, NAME_BASE + '-block-hash',
                 utils.pts100cm, utils.pts100cm,
                 utils.pts80cm, {'circle': 0.1})

utils.renderData(BLOCK_RAW, NAME_BASE + '-block-raw',
                 utils.pts100cm, utils.pts100cm,
                 utils.pts80cm, {'circle': 0.1})
