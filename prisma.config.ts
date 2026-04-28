import { defineConfig } from 'prisma'

export default defineConfig({
  datasource: {
    adapter: 'sqlite',
    url: process.env.DATABASE_URL,
  },
})