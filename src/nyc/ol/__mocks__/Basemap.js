import OlProjProjection from 'ol/proj/Projection'

const mock = jest.fn().mockImplementation(() => {
  return {
    getView: () => {
      return {
        fit: jest.fn(),
        animate: jest.fn(),
        getProjection: jest.fn(() => {
          return new OlProjProjection({code: 'EPSG:3857'})
        })
      }
    },
    addLayer: jest.fn(),
    getSize: jest.fn(() => {
      return [100, 100]
    }),
    setSize: jest.fn(),
    once: jest.fn().mockImplementation((eventType, callback) => {
      callback()
    })
  }
})

export default mock
