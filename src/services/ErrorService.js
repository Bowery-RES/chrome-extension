class ErrorService {
  static serialize(error) {
    if (!error) {
      return error
    }
    const serializedError = {
      message: error.message,
      stack: error.stack,
      cause: error.cause && this.serialize(error.cause),
    }
    return serializedError
  }

  static deserialize(serializedError) {
    const error = new Error(serializedError.message, { cause: this.deserialize(serializedError.cause) })
    error.stack = serializedError.stack
    return error
  }

  static isSerializedError(error) {
    return error && error.message && error.stack && !(error instanceof Error)
  }

  static formatMessageFromError(error) {
    const message = error.message || error
    const recognizedErrors = Object.values(ErrorService.messages())
    const isRecognizedError = recognizedErrors.includes(message)
    if (isRecognizedError) {
      return message
    }

    console.warn('unrecognized error message', error)
    return ErrorService.messages().GENERIC
  }

  // Current webpack config doesn't allow static properties
  static messages() {
    return {
      GENERIC: 'Sorry, an error has occurred. Please try again.',
      AUTH: "We're having trouble with your extension authorization. Please contact support.",
      PARSING: "We're having trouble getting the data. Please refresh and try again.",
      GOOGLE: "We're having trouble connecting to Google. Please try again later.",
      WEBAPP: "We're having trouble connecting to WebApp. Please try again later.",
      COMPPLEX: "We're having trouble sending data to CompPlex. Please try again.",
      WEBAPP_SUBMIT: "We're having trouble sending data to WebApp. Please manually search and add the comp in WebApp.",
    }
  }
}

export default ErrorService
