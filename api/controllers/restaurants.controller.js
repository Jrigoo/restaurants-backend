import { RestaurantsDAO } from "../../dao/restaurantsDAO.js";

class RestaurantsController {
  static async apiGetRestaurants(req, res, next) {
    const restaurantsPerPage = req.query.restaurantsPerPage
      ? parseInt(req.query.restaurantsPerPage, 10)
      : 8;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    const { restaurantsList } = await RestaurantsDAO.getRestaurants({
      page,
      restaurantsPerPage,
    });

    let response = {
      restaurants: restaurantsList,
      page: page,
      entries_per_page: restaurantsPerPage,
    };

    res.json(response);
  }

  static async apiGetRestaurantsById(req, res, next) {
    try {
      let id = req.params.id;
      let restaurant = await RestaurantsDAO.getRestaurantById(id);
      res.json(restaurant);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiPostRestaurantReview(req, res, next) {
    try {
      const username = req.jwt.username;
      const { body, stars, restaurant_id } = req.body;

      const response = await RestaurantsDAO.addReview(
        username,
        restaurant_id,
        body,
        stars
      );

      res.json(response);
    } catch (e) {
      res.status(500).json({ Error: e.message });
    }
  }

  static async apiUpdateRestaurantReview(req, res, next) {
    try {
      const username = req.jwt.username;
      const { body, stars, restaurant_id, review_id } = req.body;

      const { response, restaurant } = await RestaurantsDAO.updateReview(
        username,
        restaurant_id,
        body,
        stars,
        review_id
      );

      res.json({ Response: response, Restaurant: restaurant });
    } catch (e) {
      res.status(500).json({ Error: e.message });
    }
  }

  static async apiDeleteRestaurantReview(req, res, next) {
    let id = "5eb3d668b31de5d588f4292a";
    try {
      let restaurant = await RestaurantsDAO.getRestaurant(id);
      res.json(restaurant);
    } catch (e) {
      console.log(`api ${e}`);
      res.status(500).json({ error: e });
    }
  }
}

export { RestaurantsController };
