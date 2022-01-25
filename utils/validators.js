/* Validation Middleware */
const regEx =
  /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

const validateRegister = (req, res, next) => {
  const { username, email, password, confirm_password } = req.body;
  let error = false;
  if (username.trim() === "") {
    error = true;
    res.status(400).json("Username must not be empty");
  }
  if (email.trim() === "") {
    error = true;
    res.status(400).json("Email must not be empty");
  } else {
    if (!email.match(regEx)) {
      error = true;
      res.status(400).json("Email must be a valid email address");
    }
    if (password === "") {
      error = true;
      res.status(400).json("Password must not be empty");
    } else if (password !== confirm_password) {
      error = true;
      res.status(400).json("Passwords must match");
    }
  }
  if (!error) {
    next();
  }
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  let error = false;
  if (username.trim() === "") {
    error = true;
    res.status(400).json("Username must not be empty");
  }
  if (password === "") {
    error = true;
    res.status(400).json("Password must not be empty");
  }
  if (!error) {
    next();
  }
};

const validateUpdate = (req, res, next) => {
  const { username, email } = req.body;
  let error = false;
  if (username.trim() === "") {
    error = true;
    res.status(400).json("Username must not be empty");
  }
  if (email.trim() === "") {
    error = true;
    res.status(400).json("Email must not be empty");
  } else {
    if (!email.match(regEx)) {
      error = true;
      res.status(400).json("Email must be a valid email address");
    }
  }
  if (!error) {
    next();
  }
};

const validateReview = (req, res, next) => {
  /* 
    id:ID
    username:"Juanito ALimaña"
    body:"..."
    stars:Int  0<stars<5
  */
  let error = false;
  const { body, stars, restaurant_id } = req.body;

  if (body.trim() === "") {
    error = true;
    res.status(400).json("Body must not be empty");
  }

  if (restaurant_id.trim() === "") {
    error = true;
    res.status(400).json("Restaurant id must not be empty");
  }

  if (typeof stars == "number") {
    if (stars < 0) {
      error = true;
      res.status(400).json("Stars minimum is 0");
    }

    if (stars > 5) {
      error = true;
      res.status(400).json("Stars maximum is 5");
    }
  } else {
    error = true;
    res.status(400).json("Stars must be number type");
  }

  if (!error) {
    next();
  }
};

const validateUpdateReview = (req, res, next) => {
  let error = false;
  const { review_id } = req.body;

  if (review_id.trim() === "") {
    error = true;
    res.status(400).json("Review id must not be empty");
  }

  if (!error) {
    next();
  }
};

export {
  validateRegister,
  validateLogin,
  validateUpdate,
  validateReview,
  validateUpdateReview,
};
