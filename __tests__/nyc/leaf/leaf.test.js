
import leaf from 'nyc/leaf/leaf'

test('leaf', () => {
  expect.assertions(1)
  expect(leaf).toEqual({})
})