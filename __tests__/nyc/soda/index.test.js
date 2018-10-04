import soda from 'nyc/soda'

test('soda', () => {
  expect.assertions(1)
  expect(soda).toEqual({})
})