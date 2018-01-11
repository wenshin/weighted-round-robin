class WeightedRoundRobin {
  /**
   *
   * @define TypeScript
   *
   *  interface WeightedValue {
   *    weight: number,
   *    value: any,
   *  }
   *
   *  declare function createWeightedValue(value: any): WeightedValue
   *
   * @param {Array<any>}    wlist
   * @param {Object}        options
   *    {
   *      isSmooth?: boolean,  // http://blog.csdn.net/yangbodong22011/article/details/73369426
   *      createWeightedValue?: createWeightedValue
   *    }
   */
  constructor(wlist, options) {
    const {isSmooth, createWeightedValue} = options || {};
    this.list = wlist;
    this.createWeightedValue = createWeightedValue;
    this.length = wlist.length;
    this.isSmooth = isSmooth !== false;
    this.weights = [];
    this.weightSum = 0;

    this.initWeight();
  }

  initWeight() {
    let weightSum = 0;
    const weights = [];
    for (let i = 0; i < this.length; i++) {
      const weight = this.getItem(i).weight;
      weightSum += weight;
      weights[i] = weight;
    }
    this.weightSum = weightSum;
    this.weights = weights;
  }

  get value() {
    const idx = this.findMaxWeightIndex();
    this.genNextWeights(idx);
    return this.getItem(idx).value;
  }

  findMaxWeightIndex() {
    let max = null;
    let maxIdx;
    for (let i = 0; i < this.length; i++) {
      if (max === null || max < this.weights[i]) {
        max = this.weights[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  }

  genNextWeights(maxIdx) {
    if (this.isSmooth) {
      this.weights[maxIdx] = this.length - this.weights[maxIdx];
      for (let i = 0; i < this.length; i++) {
        const initialWeight = this.getItem(i).weight;
        this.weights[i] = this.weights[i] + initialWeight;
      }
    } else {
      this.weights[maxIdx] -= 1;
    }
  }

  getItem(idx) {
    const item = this.list[idx];
    const isWeightedValue = item !== null && typeof item === 'object' && 'weight' in item;
    if (this.createWeightedValue) {
      return this.createWeightedValue(item);
    } else if (!isWeightedValue) {
      return {
        weight: 0,
        value: item,
      };
    }
    return item;
  }
}

module.exports = WeightedRoundRobin;
