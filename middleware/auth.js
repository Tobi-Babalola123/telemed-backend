const checkAuth = require("./auth");

router.get("/profile", checkAuth, (req, res) => {
  res.json(req.session.user);
});

function checkAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

module.exports = checkAuth;
