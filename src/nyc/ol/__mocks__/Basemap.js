/* global jest */
import OlProjProjection from 'ol/proj/Projection'

const mockView = {
  fit: jest.fn(),
  animate: jest.fn(),
  getProjection: jest.fn(() => {
    return new OlProjProjection({code: 'EPSG:3857'})
  })
}

const mock = jest.fn().mockImplementation(() => {
  return {
    getView: jest.fn().mockImplementation(() => {
      return mockView
    }),
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

mock.EXTENT = [1, 2, 3, 4]

export default mock
