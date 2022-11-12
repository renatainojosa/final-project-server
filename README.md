Auth User Routes:

| METHOD  | Endpoint      | Response  | Action                        |
|:-------:|:-------------:|:---------:|:-----------------------------:|
| GET     | /auth/users   | [users]   | Get all the users from the DB |
| POST    | /auth/signup  |  {user}   | Create a new user             |
| POST    | /auth/login   |  {token}  | Login and create a token      |
| PUT     | /auth/:userId/edit | { message: "User updated"} | Update the user |

Auth ONG Routes:

