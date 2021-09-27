module.exports = {
  sleep: (howLong) => {
    return new Promise((resolve) => {
      setTimeout(resolve, howLong)
    })
  },
  randomInRange: (min, max, wholeNumber) => {
    const num = Math.random() * (max - min) + min;
    return wholeNumber ? Math.floor(num) : Math.round(num * 10) / 10;
  }
};