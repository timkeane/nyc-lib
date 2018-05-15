import nyc from 'nyc/nyc'

beforeEach(() => {
  $.resetMocks()
})

test('proj4', () => {
  expect.assertions(3)
  expect(typeof proj4).toBe('function')
  expect(typeof proj4('EPSG:2263')).toBe('object')
  expect(typeof proj4('EPSG:6539')).toBe('object')
})

test('inherits', () => {
  expect.assertions(5)

  const parentCtor = () => {}
  parentCtor.prototype.parentProperty = 'parentProperty'
  parentCtor.prototype.propertyToOverride = 'propertyToOverride'
  parentCtor.prototype.parentMethod = () => {}
  parentCtor.prototype.methodToOverride = () => {}

  const overrideProperty = 'overrideProperty'
  const overrideMethod = () => {}

  const childCtor = () => {}
  childCtor.prototype.childMethod = () => {}
  childCtor.prototype.propertyToOverride = overrideProperty
  childCtor.prototype.methodToOverride = overrideMethod

  nyc.inherits(childCtor, parentCtor)

  expect(childCtor.prototype.parentProperty).toBe('parentProperty')
  expect(childCtor.prototype.propertyToOverride).toBe('overrideProperty')
  expect(childCtor.prototype.parentMethod).toBe(parentCtor.prototype.parentMethod)
  expect(childCtor.prototype.methodToOverride).not.toBe(parentCtor.prototype.methodToOverride)
  expect(childCtor.prototype.methodToOverride).toBe(overrideMethod)
})

test('subclass', () => {
  expect.assertions(3)

  class SuperClass {
    constructor(name) {
  		this.name = name
  		this.parent = true
  	}
  	getFamily() {
  		return 'Flinstone'
  	}
  	getNeighborhood() {
  		return 'nyc'
  	}
  }

  function SubClass(name) {
    this.superClass = new SuperClass(name);
    nyc.subclass(this, this.superClass);
    this.parent = false
  }
  SubClass.prototype.getFamily = () => {
      return 'Rubble'
  }

  const subClass = new SubClass('Bam Bam')

  expect(subClass.name).toBe('Bam Bam')
  expect(subClass.getFamily()).toBe('Rubble')
  expect(subClass.getNeighborhood()).toBe('nyc')
})

test('mixin', () => {
  expect.assertions(24)

  const obj = {
    foo: 'bar',
    bar: 'foo',
    getFooBar() {
      return this.foo + this.bar
    }
  }

  const mixin0 = {
    foo: 'foo',
    bar: 'bar',
    wtf: 'wtf',
    getFooBar() {
      return this.foo + this.bar
    },
    getBarFoo() {
      return this.bar + this.foo
    },
    getWtf() {
      return this.wtf + '!'
    }
  }

  const mixin1 = {
    getWtf() {
      return this.wtf + '?'
    }
  }

  expect(obj.foo).toBe('bar')
  expect(obj.bar).toBe('foo')
  expect(obj.getFooBar()).toBe('barfoo')
  expect(obj.getBarFoo).toBe(undefined)
  expect(obj.getWtf).toBe(undefined)

  expect(mixin0.foo).toBe('foo')
  expect(mixin0.bar).toBe('bar')
  expect(mixin0.wtf).toBe('wtf')
  expect(mixin0.getFooBar()).toBe('foobar')
  expect(mixin0.getBarFoo()).toBe('barfoo')
  expect(mixin0.getWtf()).toBe('wtf!')

  expect(mixin1.foo).toBe(undefined)
  expect(mixin1.bar).toBe(undefined)
  expect(mixin1.wtf).toBe(undefined)
  expect(mixin1.getFooBar).toBe(undefined)
  expect(mixin1.getBarFoo).toBe(undefined)
  expect(mixin1.getWtf()).toBe('undefined?')

  nyc.mixin(obj, [mixin0, mixin1])

  expect(obj.foo).toBe('foo')
  expect(obj.bar).toBe('bar')
  expect(obj.getBarFoo).toBe(mixin0.getBarFoo)
  expect(obj.getWtf).toBe(mixin1.getWtf)
  expect(obj.getFooBar()).toBe('foobar')
  expect(obj.getBarFoo()).toBe('barfoo')
  expect(obj.getWtf()).toBe('wtf?')
});

test('copyFromParentProperties', () => {
  expect.assertions(9)

  const parentObj = {
    foo: 'foo',
    bar: 'bar',
    wtf: 'wtf',
    getFooBar() {
      return this.foo + this.bar
    },
    getBarFoo() {
      return this.bar + this.foo
    },
    getWtf() {
      return this.wtf + '!'
    }
  }

  const childObj = {
    foo: 'bar',
    bar: 'foo',
    getFooBar() {
      return this.foo + this.bar
    }
  }

  nyc.copyFromParentProperties(childObj, parentObj)

  expect(childObj.foo).toBe('bar')
  expect(childObj.bar).toBe('foo')
  expect(childObj.wtf).toBe('wtf')
  expect(childObj.getFooBar).not.toBe(parentObj.getFooBar)
  expect(childObj.getBarFoo).toBe(parentObj.getBarFoo)
  expect(childObj.getWtf).toBe(parentObj.getWtf)
  expect(childObj.getFooBar()).toBe('barfoo')
  expect(childObj.getBarFoo()).toBe('foobar')
  expect(childObj.getWtf()).toBe('wtf!')
});

test('copyFromParentKeys', () => {
  expect.assertions(9)

  const parentObj = {
    foo: 'foo',
    bar: 'bar',
    wtf: 'wtf',
    getFooBar() {
      return this.foo + this.bar
    },
    getBarFoo() {
      return this.bar + this.foo
    },
    getWtf() {
      return this.wtf + '!'
    }
  }

  const childObj = {
    foo: 'bar',
    bar: 'foo',
    getFooBar() {
      return this.foo + this.bar
    }
  }

  nyc.copyFromParentKeys(childObj, parentObj)

  expect(childObj.foo).toBe('bar')
  expect(childObj.bar).toBe('foo')
  expect(childObj.wtf).toBe('wtf')
  expect(childObj.getFooBar).not.toBe(parentObj.getFooBar)
  expect(childObj.getBarFoo).toBe(parentObj.getBarFoo)
  expect(childObj.getWtf).toBe(parentObj.getWtf)
  expect(childObj.getFooBar()).toBe('barfoo')
  expect(childObj.getBarFoo()).toBe('foobar')
  expect(childObj.getWtf()).toBe('wtf!')
})

test('capitalize', () => {
  expect.assertions(2)

  let words = 'the quick brown fox jumped over the lazy dog'
  expect(nyc.capitalize(words)).toBe('The Quick Brown Fox Jumped Over The Lazy Dog')

  words = 'THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG'
  expect(nyc.capitalize(words)).toBe('The Quick Brown Fox Jumped Over The Lazy Dog')
})

test('nextId', () => {
  expect.assertions(6)

  const prefix1 = 'foo'
  const prefix2 = 'bar'
  expect(nyc.nextId(prefix1)).toBe('foo-0')
  expect(nyc.nextId(prefix2)).toBe('bar-0')
  expect(nyc.nextId(prefix1)).toBe('foo-1')
  expect(nyc.nextId(prefix2)).toBe('bar-1')
  expect(nyc.nextId(prefix1)).toBe('foo-2')
  expect(nyc.nextId(prefix2)).toBe('bar-2')
})

test('html has htm method', () => {
  expect.assertions(2)

  const object = {
    html() {
      return '<div>Some HTML</div>'
    }
  }

  expect(nyc.html(object).get(0).tagName).toBe('DIV')
  expect(nyc.html(object).html()).toBe('Some HTML')
})

test('html has getProperties method', () => {
  expect.assertions(6)

  const object = {
    getProperties() {
      return {
        foo: 'bar',
        bar: 'foo',
        doo: 'fus'
      }
    }
  }

  expect(nyc.html(object).get(0).tagName).toBe('DIV')
  expect(nyc.html(object).hasClass('nyc-html')).toBe(true)
  expect(nyc.html(object).children().length).toBe(3)
  expect($(nyc.html(object).children().get(0)).html()).toBe('<span class="fld">foo</span><span class="val">bar</span>')
  expect($(nyc.html(object).children().get(1)).html()).toBe('<span class="fld">bar</span><span class="val">foo</span>')
  expect($(nyc.html(object).children().get(2)).html()).toBe('<span class="fld">doo</span><span class="val">fus</span>')
})

test('html has properties field', () => {
  expect.assertions(6)

  const object = {
    properties: {
      foo: 'bar',
      bar: 'foo',
      doo: 'fus'
    }
  }

  expect(nyc.html(object).get(0).tagName).toBe('DIV')
  expect(nyc.html(object).hasClass('nyc-html')).toBe(true)
  expect(nyc.html(object).children().length).toBe(3)
  expect($(nyc.html(object).children().get(0)).html()).toBe('<span class="fld">foo</span><span class="val">bar</span>')
  expect($(nyc.html(object).children().get(1)).html()).toBe('<span class="fld">bar</span><span class="val">foo</span>')
  expect($(nyc.html(object).children().get(2)).html()).toBe('<span class="fld">doo</span><span class="val">fus</span>')
})

test('html plain object', () => {
  expect.assertions(6)

  const object = {
    foo: 'bar',
    bar: 'foo',
    doo: 'fus'
  }

  expect(nyc.html(object).get(0).tagName).toBe('DIV')
  expect(nyc.html(object).hasClass('nyc-html')).toBe(true)
  expect(nyc.html(object).children().length).toBe(3)
  expect($(nyc.html(object).children().get(0)).html()).toBe('<span class="fld">foo</span><span class="val">bar</span>')
  expect($(nyc.html(object).children().get(1)).html()).toBe('<span class="fld">bar</span><span class="val">foo</span>')
  expect($(nyc.html(object).children().get(2)).html()).toBe('<span class="fld">doo</span><span class="val">fus</span>')
})

test('loading/loaded', () => {
  expect.assertions(7)

  const body = $('body')
  body.addClass('loading').attr('aria-hidden', true)
  nyc.loading(body)
  expect(body.children().first().attr('id')).toBe('loading')
  expect(body.children().first().css('display')).toBe('block')

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    })
  }

  nyc.ready()

  expect(body.hasClass('loading')).toBe(false)
  expect(body.attr('aria-hidden')).toBe('false')
  expect($.mocks.fadeOut).toHaveBeenCalledTimes(1)
  expect($.mocks.fadeOut.mock.instances[0].get(0)).toBe(body.children().get(0))
  expect(body.children().first().css('display')).toBe('none')
})
