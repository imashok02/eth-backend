enum Status {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

class ResponseDto {
  status: Status;

  message?: string = '';

  error?: string = '';

  setStatus(status: Status): ResponseDto {
    this.status = status;

    return this;
  }

  setMessage(message: string): ResponseDto {
    this.message = message;

    return this;
  }

  setError(error: string): ResponseDto {
    this.error = error;

    return this;
  }
}

export { Status, ResponseDto };
