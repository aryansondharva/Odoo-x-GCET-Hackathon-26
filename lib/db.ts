import { Pool } from 'pg'

// Check if database configuration is available
const hasDbConfig = !!(process.env.DATABASE_URL || 
  (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD))

// Database connection configuration
const pool = hasDbConfig ? new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'hrms_db',
  user: process.env.DB_USER || 'username',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  min: parseInt(process.env.DB_MIN_CONNECTIONS || '2'),
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}) : null

// Test database connection
if (pool) {
  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database')
  })

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
  })
}

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  if (!pool) {
    throw new Error('Database not configured. Please set up your .env file with database credentials.')
  }
  
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error', { text, error })
    throw error
  }
}

// Helper function for transactions
export async function transaction(callback: (client: any) => Promise<any>) {
  if (!pool) {
    throw new Error('Database not configured. Please set up your .env file with database credentials.')
  }
  
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Database health check
export async function healthCheck() {
  if (!pool) {
    return { status: 'unhealthy', error: 'Database not configured. Please set up your .env file.' }
  }
  
  try {
    const result = await query('SELECT NOW()')
    return { status: 'healthy', timestamp: result.rows[0].now }
  } catch (error: any) {
    return { status: 'unhealthy', error: error.message }
  }
}

// Check if database is available
export function isDatabaseAvailable() {
  return hasDbConfig && pool !== null
}

export default pool
