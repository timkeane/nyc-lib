import { nyc } from '../../src/nyc/index.js'

test('inherits', () => {
  const parentCtor = function(){}
  parentCtor.prototype.parentMethod = function(){}
  parentCtor.prototype.methodToOverride = function(){}

  const childCtor = function(){}
  childCtor.prototype.childMethod = function(){}

  const overrideMethod = function(){}
  childCtor.prototype.methodToOverride = overrideMethod

  nyc.inherits(childCtor, parentCtor)

  expect(childCtor.prototype.parentMethod).toBe(parentCtor.prototype.parentMethod)
  expect(childCtor.prototype.methodToOverride).not.toBe(parentCtor.prototype.methodToOverride)
  expect(childCtor.prototype.methodToOverride).toBe(overrideMethod)
})
