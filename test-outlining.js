const utils = require('./utils.js')

const NAME_BASE = './drawings/white-outline-test'

const TEST = 'ffffffffffffff'

utils.renderData(TEST, NAME_BASE,
                 utils.pts100cm, utils.pts100cm,
                 utils.pts80cm, {'circle': 0.1})
