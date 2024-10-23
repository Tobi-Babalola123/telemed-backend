// errorMiddleware.js
const handleErrors = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error("Error details:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  });
};

module.exports = { handleErrors };
