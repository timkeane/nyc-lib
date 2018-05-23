class ShapeFileMock {
  constructor() {
    return {
      features: null,
      next: 0,
      result: {
        get value() {
          const value = shapefileMock.features[shapefileMock.mock.next++]
          if (shapefileMock.mock.next === shapefileMock.features.length) {
            this.done = true
          }
          return value
        }
      },
      open: jest.fn().mockImplementation((shp, dbf) => {
        return new Promise((resolve, reject) => {
          if (shapefileMock.reject) {
            reject('mock-error')
          } else {
            resolve({
              read() {
                return new Promise(resolve => {
                  resolve(shapefileMock.mock.result)
                })
              }
            })
          }
        })
      })
    }
  }
}

const shapefileMock = {
  reject: false,
  resetMock: () => {
    shapefileMock.mock = new ShapeFileMock()
  }
}

export default shapefileMock