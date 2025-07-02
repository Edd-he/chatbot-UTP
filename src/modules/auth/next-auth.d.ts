import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  export interface JWT {
    user: {
      id: string
      username: string
      email: string
      role: string
      modules: string[]
    }
    tokens: {
      access: string
      refresh: string
    }
  }
}

declare module 'next-auth' {
  export interface Session {
    user: {
      id: string
      username: string
      email: string
      role: string
      modules: string[]
    }
    tokens: {
      access: string
      refresh: string
    }
  }
}
