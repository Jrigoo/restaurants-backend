import express from "express";
import { RestaurantsController as RestCtrl } from "./controllers/restaurants.controller.js";
import { UsersController as UsersCtrl } from "./controllers/users.controller.js";

const router = express.Router();

/* Middleware */
import { checkAuth } from "../utils/checkAuth.js";
import {
  validateRegister,
  validateLogin,
  validateUpdate,
  validateReview,
  validateUpdateReview,
} from "../utils/validators.js";

/* ROUTESS--------------------------> */

/* Restaurants */
router.route("/restaurants").get(RestCtrl.apiGetRestaurants);
router.route("/restaurants/:id").get(RestCtrl.apiGetRestaurantsById);

/* Restaurant reviews */
router
  .route("/restaurants/review")
  .post(checkAuth, validateReview, RestCtrl.apiPostRestaurantReview)
  .put(
    checkAuth,
    validateReview,
    validateUpdateReview,
    RestCtrl.apiUpdateRestaurantReview
  )
  .delete(checkAuth, RestCtrl.apiDeleteRestaurantReview);

/* User Routes */
router
  .route("/user/register")
  .post(validateRegister, UsersCtrl.apiRegisterUser);

router.route("/user/login").post(validateLogin, UsersCtrl.apiLoginUser);

router
  .route("/user")
  .delete(checkAuth, UsersCtrl.apiDeleteUser)
  .put(checkAuth, validateUpdate, UsersCtrl.apiUpdateUser);

export { router };

/* 
Cada restaurante sera asi:

{
  id:ID
  address:{}
  brough: "Brooklyn"
  cuisine:"American"
  grades:[{},{},{}]
  name:"Riviera Carterer"
  restaurant_id:"12345"

  review:[{
    id:ID
    username:"Juanito ALimaña"
    body:"..."
    stars:Int
  }]
}

Cada usuario será
{
  id:ID
  user_name:{}
  email: "Brooklyn"
  password:"American"
  reviews:[]

}


*/
