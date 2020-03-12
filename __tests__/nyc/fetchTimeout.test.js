import fetchTimeout from 'nyc/fetchTimeout'

const actualFetch = global.fetch

afterEach(() => {
  jest.setTimeout(5000)
  global.fetch = actualFetch
})

describe('fetchTimeout times out', () => {
  let promise
  beforeEach(() => {
    promise = new Promise((resolve, reject) => {})
    jest.setTimeout(20000)
    global.fetch = url => {
      return promise
    }
  })
  
  test('fetchTimeout default timeout', done => {
    expect.assertions(2)
  
    const start = new Date().getTime()
  
    fetchTimeout('http://whatev').then(resp => {
      expect(true).toBe(false) //fail
    }).catch(err => {
      const end = new Date().getTime()
      expect(err.message).toBe('Request timeout for http://whatev')
      expect(end - start >= 15000).toBe(true)
      done()
    })
  })
  
  test('fetchTimeout timeout provided', done => {
    expect.assertions(2)
  
    const start = new Date().getTime()
  
    fetchTimeout('http://whatev', 15).then(resp => {
      expect(true).toBe(false) //fail
    }).catch(err => {
      const end = new Date().getTime()
      expect(err.message).toBe('Request timeout for http://whatev')
      expect(end - start >= 15).toBe(true)
      done()
    })
  })

  test('fetchTimeout fails after timeout', done => {
    expect.assertions(2)
  
    promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('late'))
        done()
      }, 10)
    })
    const start = new Date().getTime()
  
    fetchTimeout('http://whatev', 5).then(resp => {
      expect(true).toBe(false) //fail
    }).catch(err => {
      const end = new Date().getTime()
      expect(err.message).toBe('Request timeout for http://whatev')
      expect(end - start >= 5).toBe(true)
    })
  })

  test('fetchTimeout succeeds after timeout', done => {
    expect.assertions(2)
  
    promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('late')
        done()
      }, 10)
    })
    const start = new Date().getTime()
  
    fetchTimeout('http://whatev', 5).then(resp => {
      expect(true).toBe(false) //fail
    }).catch(err => {
      const end = new Date().getTime()
      expect(err.message).toBe('Request timeout for http://whatev')
      expect(end - start >= 5).toBe(true)
    })
  })
})

describe('fetchTimeout failed response', () => {
  beforeEach(() => {
    global.fetch = url => {
      return new Promise((resolve, reject) => {
        reject(new Error('fail'))
      })
    }
  })
  
  test('fetchTimeout failed response', done => {
    expect.assertions(1)
    
    fetchTimeout('http://whatev').then(resp => {
      expect(true).toBe(false) //fail
    }).catch(err => {
        expect(err.message).toBe('fail')
      done()
    })
  })
})

describe('fetchTimeout good response', () => {
  beforeEach(() => {
    global.fetch = url => {
      return new Promise((resolve, reject) => {
        resolve('mock-response')
      })
    }
  })
  
  test('fetchTimeout good response', done => {
    expect.assertions(1)
    
    fetchTimeout('http://whatev').then(resp => {
      expect(resp).toBe('mock-response')
      done()
    }).catch(err => {
      expect(true).toBe(false) //fail
      expect(err.message).toBe('fail')
    })
  })
})
