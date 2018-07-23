import lang from 'nyc/lang'

test('lang', () => {
  expect.assertions(1)
  expect(lang).toEqual({})
})