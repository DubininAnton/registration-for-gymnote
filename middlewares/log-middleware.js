module.exports = (req, res, next) => {
  const date = new Date(Date.now())
  console.log(
    `- - - - - ${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} - - - - -`,
  )
  console.log(
    `HTTP ${req.method} Request ${req.protocol}://${req.get('host')}${
      req.originalUrl
    }`,
  )
  console.log(`Body: ${JSON.stringify(req.body)}`)
  console.log(
    `Header.authorization: ${req.headers.authorization ? ' ok' : ' empty'}`,
  )
  console.log(`Cookie: ${JSON.stringify(req.cookies).slice(0, 30)}`)
  next()
}
