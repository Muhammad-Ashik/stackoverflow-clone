import app from './app'
import AppDataSource from './config/databaseConfig'
import { envConfig } from './config/env.config'
import { isProduction } from './utils'

const PORT = envConfig.PORT

async function startServer() {
  try {
    console.log('Connecting to database...')
    await AppDataSource.initialize()
    console.log('✅ Database connected successfully!')

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`)
      console.log(`📦 Environment: ${envConfig.NODE_ENV}`)

      if (isProduction()) {
        const renderUrl = process.env.RENDER_EXTERNAL_URL
        if (renderUrl) {
          console.log(`🌐 App URL: ${renderUrl}`)
          console.log(`🌐 Health check: ${renderUrl}/health`)
        } else {
          console.log(`🌐 Server is ready to accept connections`)
        }
      } else {
        console.log(
          `🌐 Server is ready to accept connections http://localhost:${PORT}`,
        )
        console.log(`🌐 Health check: http://localhost:${PORT}/health`)
      }
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

async function gracefulShutdown(signal: string) {
  console.log(`${signal} signal received: closing HTTP server`)
  await AppDataSource.destroy()
  process.exit(0)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

startServer()
