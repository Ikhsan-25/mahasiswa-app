const response = (statusCode, data = [], message, res) => {
  res.status(statusCode).json([
    {
      payLoad: data,
      message,
      metadata: {
        prev: "",
        next: "",
        current: "",
      },
    },
  ])
}

module.exports = response