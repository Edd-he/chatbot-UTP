import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  export interface JWT {
    user: {
      id: number
      role: string
      roleId: number
      email: string
      name: string
    }
    Tokens: {
      access: string
      refresh: string
    }
  }
}

declare module 'next-auth' {
  export interface Session {
    user: {
      id: number
      role: string
      roleId: number
      email: string
      name: string
    }
    Tokens: {
      access: string
      refresh: string
    }
  }
}
