const Base = require('./base');
class Todos extends Base {
  constructor(props = 'todos') {
    super(props)
  }
}

module.exports = new Todos()