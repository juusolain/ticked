class NetworkError extends Error {
  constructor (message) {
    super(message)
    this.name = 'NetworkError'
  }
}

class ServerError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ServerError'
  }
}

class CredentialError extends Error {
  constructor (message) {
    super(message)
    this.name = 'CredentialError'
  }
}

class QueryError extends Error {
  constructor (message) {
    super(message)
    this.name = 'QueryError'
  }
}

export { NetworkError, ServerError, CredentialError, QueryError }
