import mta from 'nyc/mta'

test('mta', () => {
  expect.assertions(1)
  expect(mta).toEqual({})
})