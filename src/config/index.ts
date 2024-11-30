interface Config {
  baseURL: string
  timeout: number
}

const config: Record<string, Config> = {
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 5000
  },
  production: {
    baseURL: 'https://api.example.com',
    timeout: 10000
  }
}

const mode = import.meta.env.MODE || 'development'
export default config[mode]
