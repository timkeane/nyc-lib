import ReplaceTokens from '../../src/nyc/ReplaceTokens';

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
                notUsed: 'not used'
            })
        ).toBe('the quick brown fox jumped over the lazy dog')
    expect(
        replace.replace('the ${speed} ${color} ${animal} ${action} the ${otherThing}',
            {
                speed: 'slow',
                color: 'green',
                animal: 'turtle',
                action: 'crawled under',
                otherThing: 'rock',
                notUsed: 'not used'
            })
        ).toBe('the slow green turtle crawled under the rock')
})