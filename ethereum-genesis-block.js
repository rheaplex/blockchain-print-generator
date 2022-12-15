const utils = require('./utils.js')

// https://etherscan.io/block/0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3

// Note that this was not the first block mined, it is block zero and it
// contains the presale accounts. Block one was the first mined block.

const BLOCK_HASH = '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'

const NAME_BASE = './drawings/ethereum-genesis-block'

utils.renderData(BLOCK_HASH, NAME_BASE + '-block-hash',
                 utils.pts100cm, utils.pts100cm,
                 utils.pts80cm, {'circle': 0.1})
