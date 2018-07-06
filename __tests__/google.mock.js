const googleMock = {
  resetMocks: () => {
    global.google = {
      maps: {
        DirectionsStatus: {OK: 'OK'},
        MapTypeId: {
          ROADMAP: 'ROADMAP'
        },
        TravelMode: {
          TRANSIT: 'TRANSIT',
          BICYCLING: 'BICYCLING',
          WALKING: 'WALKING',
          DRIVING: 'DRIVING'
        },
        Map: jest.fn().mockImplementation(() => {
          return {
            type: 'mock-map',
            getZoom: jest.fn(() => {return 10}),
            setZoom: jest.fn()
          }
        }),
        DirectionsService: jest.fn().mockImplementation(() => {
          return {
            type: 'mock-service',
            route: jest.fn().mockImplementation((args, callback) => {
              callback()
            })
          }
        }),
        DirectionsRenderer: jest.fn(() => {
          return {
            type: 'mock-renderer',
            setOptions: jest.fn()
          }
        }),
        okResponse: {
          status: 'OK',
          routes: [{
            legs: [{
              start_address: 'from addr, USA',
              start_location: {
                lat: () => {return 0},
                lng: () => {return 1}
              },
              end_address: 'to addr, USA'
            }]
          }]
        },
        badResponse: {status: 'SOL'}
      }
    }
  }
}

export default googleMock