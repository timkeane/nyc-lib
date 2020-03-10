/**
 * @module nyc/Stats
 */

import * as ss from 'simple-statistics'

/**
 * @desc  A class to simple statistics and classifications for choropleth maps
 * @public
 * @class
 */
class Stats {
  /**
   * @desc Create an instance of Stats
   * @constructor
   * @param {Array<Number>} data The data on which to perfom statisitcal operations
   */
  constructor(data) {
    this.data = data
    this.ss = ss
  }
  /**
   * @desc Get the minimum value from the data
   * @public
   * @method
   * @return {number} The minimum value from the data
   */
  min() {
    return ss.min(this.data)
  }
  /**
   * @desc Get the maximum value from the data
   * @public
   * @method
   * @return {number} The maximum value from the data
   */
  max() {
    return ss.max(this.data)
  }
  /**
   * @desc Get the mean value from the data
   * @public
   * @method
   * @return {number} The mean value from the data
   */
  mean() {
    return ss.mean(this.data)
  }
  /**
   * @desc Get the median value from the data
   * @public
   * @method
   * @return {number} The median value from the data
   */
  median() {
    return ss.median(this.data)
  }
  /**
   * @desc Get the standard deviation of the data
   * @public
   * @method
   * @return {number} The standard deviation of the data
   */
  std() {
    return ss.standardDeviation(this.data)
  }
  /**
   * @desc Get ckmeans clustered intervals from the data
   * @public
   * @method
   * @param numClasses The number of classes
   * @return {Array<number>} An Array of numbers starting with the minimum value and incemented to the maximum value by ckmeans clustered intevrals
   */
  ckmeansClasses(numClasses) {
    const classes = []
    const clusters = ss.ckmeans(this.data, numClasses)
    classes.push(clusters[0][0])
    clusters.forEach(cluster => {
      classes.push(cluster[cluster.length - 1])
    })
    return classes
  }
  /**
   * @desc Get equal intervals from the data
   * @public
   * @method
   * @param numClasses The number of classes
   * @return {Array<number>} An Array of numbers starting with the minimum value and incemented to the maximum value by equal intevrals
   */
  equalIntervalClasses(numClasses) {
    return ss.equalIntervalBreaks(this.data, numClasses)
  }
  /**
   * @desc Get standard deviation intervals from the data
   * @public
   * @method
   * @param numClasses The number of classes (3, 5 or 7 only)
   * @return {Array<number>} An Array of numbers centered around the mean and distributed to the left and right by the standard deviation of the data
   */
  stdClasses(numClasses) {
    if (numClasses % 2) {
      const classes = new Array(numClasses + 1)
      const mid = Math.ceil(numClasses / 2) -1
      const std = ss.standardDeviation(this.data)
      const mean = this.mean()
      classes[mid] = mean + 2 * std
      let i = 0
      while (i < mid) {
        i++
        classes[mid - i] = classes[mid] - (i * std)
        classes[mid + i] = classes[mid] + (i * std)
      }
      classes[0] = this.min()
      classes[classes.length - 1] = this.max()
      return classes
    }
    throw `Invalid argument ${numClasses}: 3, 5, 7 are the only valid arguments for 'Stats.stdClasses'`
  }
}

/**
 * @desc The available methods for generating intervals for a dataset
 * @public
 * @const
 * @type {Object}
 */
Stats.METHODS = {
  equalInterval: {label: 'Equal intervals', name: 'equalIntervalClasses'},
  stdDeviation: {label: 'Standard deviation intervals', name: 'stdClasses'},
  ckmeans: {label: 'Ckmeans clustered intervals', name: 'ckmeansClasses'}
}

export default Stats