const fs = require('fs')
const path = require('path')

try {
  fs.chmodSync(path.resolve(__dirname, 'roll-css.sh'), '+x')
} catch (ignore) {
}
try {
  fs.chmodSync(path.resolve(__dirname, 'push.sh'), '+x')
} catch (ignore) {
}
try {
  fs.chmodSync(path.resolve('css', 'roll-css.sh'), '+x')
} catch (ignore) {
}