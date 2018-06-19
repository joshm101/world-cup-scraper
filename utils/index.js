const generateLogBlock = (message) => {
  console.log(
    `
    -------------------------
    |
    | ${message}
    |
    -------------------------
    `
  )
}

module.exports = {
  generateLogBlock
}