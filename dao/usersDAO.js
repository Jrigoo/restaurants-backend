/* MongoDB */
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

/* Hash and JWT */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* dotenv */
import dotenv from "dotenv";
dotenv.config();

/* Generate token -> genera un token con la info del usuario*/
function generateToken(user) {
  return jwt.sign(
    {
      username: user.username,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
}

let users;
class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.RESTREVIEWS_NS).collection("users");
    } catch (e) {
      throw new Error(
        `Unable to establish collection handles in userDAO: ${e}`
      );
    }
  }
  static async registerAccount({ username, email, password }) {
    try {
      const user = await users.findOne({ username: username });
      if (user) {
        throw new Error("Username is already taken");
      }

      password = await bcrypt.hash(password, 12);
      const newUser = {
        username: username,
        email: email,
        password: password,
        createdAt: new Date(),
      };

      const res = await users.insertOne(newUser);
      const token = generateToken(newUser);

      return {
        ...res,
        token,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  static async loginAccount({ username, password }) {
    const user = await users.findOne({ username: username });
    if (!user) {
      throw new Error("User not found");
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Wrong credentials");
    }

    const token = generateToken(user);
    return {
      ...user,
      token,
    };
  }
  static async deleteAccount({ username }) {
    const findedUser = await users.findOne({
      username: username,
    });
    if (!findedUser) {
      throw new Error("User not found");
    }
    const deleteResult = await users.deleteOne({
      username: username,
    });
    return deleteResult;
  }
  static async updateAccount(currentUser, updateUser) {
    /* 
    El current user es la información que brinda el jwt
    El update user es el request.body, osea la información que el
    usuario quiso actualizar {username, email}
    */

    /* En caso tal de que no haya cambiado su username
      obviamos esta parte. En caso tal de que si, hacemos
      esto para evitar usernames repetidos
    */
    if (currentUser.username !== updateUser.username) {
      const findedUser = await users.findOne({
        username: updateUser.username,
      });

      if (findedUser) {
        throw new Error("Username is already taken");
      }
    }

    const updateResult = await users.updateOne(
      { username: currentUser.username },
      { $set: { username: updateUser.username, email: updateUser.email } }
    );

    return updateResult;
  }
}

export { UsersDAO };
