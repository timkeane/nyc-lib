import TripPlanHack from 'nyc/mta/TripPlanHack'

const open = window.open
beforeEach(() => {
  window.open = jest.fn().mockImplementation(() => {
    return {
      document: {
        write: jest.fn()
      }
    }
  })
})
afterEach(() => {
  window.open = open
})

test('directions', () => {
  expect.assertions(3)

  const request = {
    origin: {
      name: 'from addr',
      coordinate: [0, 1]
    },
    destination: {
      name: 'to addr',
      coordinate: [2, 3],
      projection: 'EPSG:4326'
    }
  }

  const tripPlanHack = new TripPlanHack()

  tripPlanHack.randomParamCopiedFromMtaCode = () => {return 1}
  const args = {
    jsonpacket: tripPlanHack.jsonpacket(request),
    rand: tripPlanHack.randomParamCopiedFromMtaCode()
  }
  const qstr = $.param(args)

  tripPlanHack.directions(request)

  expect(window.open).toHaveBeenCalledTimes(1)
  expect(tripPlanHack.window.document.write).toHaveBeenCalledTimes(1)
  expect(tripPlanHack.window.document.write.mock.calls[0][0]).toBe(TripPlanHack.JUMP_PAGE.replace(/%QSTR%/, qstr))
})

test('accessible directions', () => {
  expect.assertions(3)

  const request = {
    accessible: true,
    origin: {
      name: 'from addr',
      coordinate: [0, 1]
    },
    destination: {
      name: 'to addr',
      coordinate: [2, 3],
      projection: 'EPSG:4326'
    }
  }

  const tripPlanHack = new TripPlanHack()

  tripPlanHack.randomParamCopiedFromMtaCode = () => {return 1}
  const args = {
    jsonpacket: tripPlanHack.jsonpacket(request),
    rand: tripPlanHack.randomParamCopiedFromMtaCode()
  }
  const qstr = $.param(args)

  tripPlanHack.directions(request)

  expect(window.open).toHaveBeenCalledTimes(1)
  expect(tripPlanHack.window.document.write).toHaveBeenCalledTimes(1)
  expect(tripPlanHack.window.document.write.mock.calls[0][0]).toBe(TripPlanHack.JUMP_PAGE.replace(/%QSTR%/, qstr))
})

test('randomParamCopiedFromMtaCode', () => {
  expect.assertions(2)

  const tripPlanHack = new TripPlanHack()

  const random = tripPlanHack.randomParamCopiedFromMtaCode()

  expect(random > -1).toBe(true)
  expect(random < 11).toBe(true)
})

describe('now', () => {
  const date = Date
  let hours = 6
  beforeEach(() => {
    Date = jest.fn().mockImplementation(() => {
      return {
        getMonth: () => {return 6},
        getDate: () => {return 15},
        getFullYear: () => {return 2018},
        getHours: () => {return hours},
        getMinutes: () => {return 30}
      }
    })
  })
  afterEach(() => {
    Date = date
  })

  test('am', () => {
    expect.assertions(4)

    const tripPlanHack = new TripPlanHack()

    const now = tripPlanHack.now()

    expect(now.date).toBe('7/15/2018')
    expect(now.hour).toBe(6)
    expect(now.minute).toBe(30)
    expect(now.ampm).toBe('am')
  })

  test('pm', () => {
    expect.assertions(4)

    const tripPlanHack = new TripPlanHack()

    hours = 14

    const now = tripPlanHack.now()

    expect(now.date).toBe('7/15/2018')
    expect(now.hour).toBe(2)
    expect(now.minute).toBe(30)
    expect(now.ampm).toBe('pm')
  })
})