require('jest-canvas-mock')
global.nyc = require('nyc').default
global.bindMock = require('./bind.mock').default
global.nyc.bind = global.bindMock.bind
global.fetch = require('jest-fetch-mock')
global.$ = require('./jquery.mock').default