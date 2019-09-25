/**
 * Error which is thrown when an abstract method is not implemented
 *
 * @category Errors
 */
class NotImplementedError extends Error {
  /**
   * @param   {string}  fnName  name of the function, base on which error will
   * print on the output link to the method documentation.
   */
  constructor(fnName) {
    const message = `
    You have to implement the method: ${fnName}
    `;
    super(message);
    this.message = message;
  }
}

module.exports.NotImplementedError = NotImplementedError;
