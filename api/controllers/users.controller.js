import { UsersDAO } from "../../dao/usersDAO.js";

class UsersController {
  static async apiRegisterUser(req, res, next) {
    try {
      let response = await UsersDAO.registerAccount(req.body);
      res.json(response);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
  static async apiLoginUser(req, res, next) {
    try {
      let response = await UsersDAO.loginAccount(req.body);
      res.json(response);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
  static async apiDeleteUser(req, res, next) {
    try {
      let response = await UsersDAO.deleteAccount(req.jwt);
      res.json(response);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
  static async apiUpdateUser(req, res, next) {
    /* El usuario si quiere actualizar su profile siempre tendra sus valores default
      y solo se activará el boton cuando haya modificado algo. Para evitar no saber que 
      puede llegar en el request
    */
    try {
      let response = await UsersDAO.updateAccount(req.jwt, req.body);
      res.json(response);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
}

export { UsersController };
