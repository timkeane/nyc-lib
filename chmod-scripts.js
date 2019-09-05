const fs = require('fs')

try {
  fs.chmodSync('./etc/push.sh', '777')
} catch (e) {
  /* ignore */
}
try {
  fs.chmodSync('./etc/css/roll-css.sh', '777')
} catch (e) {
  /* ignore */
}
try {
  fs.chmodSync('./css/roll-css.sh', '777')
} catch (e) {
  /* ignore */
}
