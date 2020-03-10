import Stats from 'nyc/Stats'
import * as ss from 'simple-statistics'


const randomData = () => {
  return [...Array(100)].map(() => Math.floor(Math.random() * 100))
}

test('constructor', () => {
  expect.assertions(1)
  
  const data = randomData()

  const stats = new Stats(data)

  expect(stats.data).toBe(data)
})

test('min', () => {
  expect.assertions(1)
  
  const data = randomData()

  const stats = new Stats(data)

  expect(stats.min()).toBe(ss.min(data))
})

test('max', () => {
  expect.assertions(1)
  
  const data = randomData()

  const stats = new Stats(data)

  expect(stats.max()).toBe(ss.max(data))
})

test('mean', () => {
  expect.assertions(1)
  
  const data = randomData()

  const stats = new Stats(data)

  expect(stats.mean()).toBe(ss.mean(data))
})

test('median', () => {
  expect.assertions(1)
  
  const data = randomData()

  const stats = new Stats(data)

  expect(stats.median()).toBe(ss.median(data))
})

test('std', () => {
  expect.assertions(1)
  
  const data = randomData()

  const stats = new Stats(data)

  expect(stats.std()).toBe(ss.standardDeviation(data))
})

test('ckmeansClasses', () => {
  expect.assertions(27)

  const data = randomData()
  const min = ss.min(data)
  const max = ss.max(data)

  const stats = new Stats(data)

  for (let numClasses = 7; numClasses > 1; numClasses--) {
    let ckmeans = ss.ckmeans(data, numClasses)
    let classes = stats.ckmeansClasses(numClasses)
    expect(classes[0]).toBe(min)
    expect(classes[classes.length - 1]).toBe(max)
    for (let i = 1; i < numClasses - 1; i++) {
      const cluster = ckmeans[i - 1]
      expect(classes[i]).toBe(cluster[cluster.length - 1])
    }
  }
})

test('equalIntervalClasses', () => {
  expect.assertions(33)

  const data = randomData()

  const stats = new Stats(data)

  for (let numClasses = 7; numClasses > 1; numClasses--) {
    let equalInterval = ss.equalIntervalBreaks(data, numClasses)
    let classes = stats.equalIntervalClasses(numClasses)
    classes.forEach((c, i) => {
      expect(c).toBe(equalInterval[i])
    })
  }
})

test('stdClasses', () => {
  expect.assertions(22)

  const data = randomData()
  const min = ss.min(data)
  const max = ss.max(data)
  const mean = ss.mean(data)

  const stats = new Stats(data)

  new Array(7, 5, 3).forEach(numClasses => {
    let std = ss.standardDeviation(data, numClasses)
    let classes = stats.stdClasses(numClasses)
    const mid = Math.ceil(numClasses / 2) - 1
    expect(classes[mid]).toBe(mean + 2 * std)
    for (let i = 0; i < mid; i++) {
      expect(classes[mid - i]).toBe(classes[mid] - (i * std))
      expect(classes[mid + i]).toBe(classes[mid] + (i * std))
    }
    expect(classes[0]).toBe(min)
    expect(classes[classes.length - 1]).toBe(max)
  })

  try {
    stats.stdClasses(6)
  } catch (err) {
    expect(err).toBe("Invalid argument 6: 3, 5, 7 are the only valid arguments for 'Stats.stdClasses'")
  }
})

