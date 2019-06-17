/* global jest */
import $ from 'jquery'
import OlProjProjection from 'ol/proj/Projection'
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom'


const mockView = {
  fit: jest.fn(),
  animate: jest.fn(),
  getProjection: jest.fn(() => {
    return new OlProjProjection({code: 'EPSG:3857'})
  })
}

let target
const mockInteractions = [new MouseWheelZoom(), new MouseWheelZoom()]

const mock = jest.fn().mockImplementation(options => {
  target = $(options.target).get(0)
  target = target || $(`#${options.target}`).get(0)
  return {
    getTargetElement: jest.fn().mockImplementation(() => {
      return target
    }),
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
    }),
    getInteractions: jest.fn().mockImplementation(() => {
      return mockInteractions
    }),
    removeInteraction: jest.fn().mockImplementation((interaction) => {
      return ''
    })
  }
})

mock.EXTENT = [1, 2, 3, 4]

mock.resetMocks = () => {
  mock.mockClear()
  mockView.fit.mockClear()
  mockView.animate.mockClear()
  mockView.getProjection.mockClear()
}

export default mock
