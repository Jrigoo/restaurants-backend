import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

let restaurants;
class RestaurantsDAO {
  /* 
    Con este metodo estatico le pasamos el cliente ya conectado que hace
    referencia a la base de datos. de ahi ingresamos a la base de datos 
    y la colección de restaurante
  */
  static async injectDB(client) {
    if (restaurants) {
      return;
    }
    try {
      restaurants = await client
        .db(process.env.RESTREVIEWS_NS)
        .collection("restaurants");
    } catch (e) {
      throw new Error(
        `Unable to establish a collection handle in restaurantsDAO: ${e}`
      );
    }
  }

  static async getRestaurants({ page = 0, restaurantsPerPage = 8 } = {}) {
    try {
      const restaurantsList = await restaurants
        .find()
        .limit(restaurantsPerPage)
        .skip(restaurantsPerPage * page)
        .toArray();

      return { restaurantsList };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { restaurantsList: [] };
    }
  }

  static async getRestaurantById(restaurant_id) {
    const restaurant = await restaurants.findOne({
      restaurant_id: restaurant_id,
    });
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    return { restaurant };
  }

  static async addReview(username, restaurant_id, body, stars) {
    const restaurant = await restaurants.findOne({
      _id: ObjectId(restaurant_id),
    });
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const newReview = {
      _id: ObjectId(),
      restaurant_id: ObjectId(restaurant_id),
      username: username,
      body: body,
      stars: stars,
      date: new Date(),
    };

    /* Si ya hay reviews, los traigo y añado el nuevo
      Si no hay ningun review lo añado directamente
    */
    console.log(Object.keys(restaurant));

    if (Object.keys(restaurant).includes("reviews")) {
      let newReviews = restaurant.reviews;
      newReviews.push(newReview);
      let response = await restaurants.updateOne(
        { _id: ObjectId(restaurant_id) },
        { $set: { reviews: newReviews } }
      );
      return response;
    } else {
      let response = await restaurants.updateOne(
        { _id: ObjectId(restaurant_id) },
        { $set: { reviews: [newReview] } }
      );
      return response;
    }
  }

  static async updateReview(username, restaurant_id, body, stars, review_id) {
    /* Debo buscar el restaurante y verificar si tiene reviews, luego veo sus reviews, para luego
      evaluar cual review es y luego evaluar si el id del usuario coincide
      como para ejecutar esa acción
      */

    const restaurant = await restaurants.findOne({
      _id: ObjectId(restaurant_id),
    });

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    //vemos si tiene o no reviews
    if (Object.keys(restaurant).includes("reviews")) {
      let myReview = restaurant.reviews.filter(
        (review) => review._id == review_id
      );
      //Si la lista esta vacia
      if (!myReview[0]) {
        throw new Error("Review not found");
      }

      if (myReview[0].username !== username) {
        throw new Error("Not allowed");
      }

      //Si todo esta cool, borra el review viejo y añade el nuevo
      let idx = restaurant.reviews.indexOf(myReview);
      restaurant.reviews.splice(idx, 1);

      let allReviews = restaurant.reviews;
      allReviews.splice(idx, 0, {
        _id: ObjectId(review_id),
        restaurant_id: ObjectId(restaurant_id),
        username: username,
        body: body,
        stars: stars,
        date: new Date(),
      });

      let response = await restaurants.updateOne(
        { _id: ObjectId(restaurant_id) },
        { $set: { reviews: allReviews } }
      );

      return { response, restaurant };
    } else {
      throw new Error("This restaurant doesn't have any review");
    }
  }

  static async deleteReview(username, restaurant_id, review_id) {}
}

export { RestaurantsDAO };
