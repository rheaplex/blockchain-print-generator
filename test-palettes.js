const utils = require('./utils.js')

const NAME_BASE = './tests/palettes-test'

let TEST = '0x'
for (let i = 0; i < 256; i++) {
    TEST = TEST + i.toString(16).padStart(2, '0')
}

utils.renderData(TEST, NAME_BASE,
                 utils.pts100cm, utils.pts100cm,
                 utils.pts80cm, {'circle': 0.1})
