const app = require("./app")
const config = require("./utils/config")
const mongoose = require("mongoose")

const PORT = config.PORT


const start = async () => {
  try {
    await mongoose.connect(config.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
    console.log(
      `Settings ${process.env.NODE_ENV} environment variables : `,
      config
    )
  } catch (e) {
    console.log(e)
  }
}

start()

