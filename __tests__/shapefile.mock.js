const shapefile = {
  features: null,
  next: 0,
  result: {
    get value() {
      const value = shapefile.features[shapefile.next++]
      if (shapefile.next === shapefile.features.length) {
        this.done = true
      }
      return value
    }
  },
  open: jest.fn().mockImplementation((shp, dbf) => {
    return new Promise(resolve => {
      resolve(shapefile.result)
    })
  })
}

export default shapefile