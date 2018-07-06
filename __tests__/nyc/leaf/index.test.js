
import leaf from 'nyc/leaf'

test('leaf', () => {
  expect.assertions(1)
  expect(leaf).toEqual({TILE_HOSTS: 'maps{s}.nyc.gov'})
})