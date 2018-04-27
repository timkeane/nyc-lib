import ReplaceTokens from 'nyc/ReplaceTokens';

test('replace', () => {
    const replace = new ReplaceTokens()
    expect(
      replace.replace('the ${speed} ${color} ${animal} ${action} the ${otherThing}',
          {
              speed: 'quick',
              color: 'brown',
              animal: 'fox',
              action: 'jumped over',
              otherThing: 'lazy dog',
              notNeeded: 'not used',
              notDefined: undefined
          })
      ).toBe('the quick brown fox jumped over the lazy dog')
})
