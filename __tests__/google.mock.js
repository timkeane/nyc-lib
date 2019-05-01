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
        InfoWindow: jest.fn().mockImplementation(() => {
          return {
            open: jest.fn(),
            setContent: jest.fn()
          }
        }),
        Marker: jest.fn().mockImplementation((options) => {
          return {
            setMap: jest.fn(),
            addListener: jest.fn(),
            position: options.position,
            map: options.map,
            label: options.label
          }
        }),
        Map: jest.fn().mockImplementation(() => {
          return {
            type: 'mock-map',
            getZoom: jest.fn(() => {return 10}),
            setZoom: jest.fn(),
            setCenter: jest.fn()
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