# ADOPT A JOSE - API
### Final Project - Web Development - IRONHACK 

## Description:

That's an API (server) deployed on _cyclic_ and the root fo the API is:
"https://puce-super-dalmatian.cyclic.app/" 

The available endpoints are the following:

### Auth User Routes:

| METHOD  | Endpoint      | Response  | Action                        |
|:-------:|:-------------:|:---------:|:-----------------------------:|
| GET     | /auth/users   | [users]   | Get all the users from the DB |
| GET     | /auth/user    |  {user}   | Get a specific user from the DB |
| POST    | /auth/signup  |  {user}   | Create a new user             |
| POST    | /auth/login   |  { message: "User logged" }  | Login and create a token      |
| PUT     | /auth/edit    | { message: "User updated"} | Update a specific user |

### Auth ONG Routes:

| METHOD  | Endpoint      | Response  | Action                        |
|:-------:|:-------------:|:---------:|:-----------------------------:|
| GET     | /auth-ongs    | [ongs]    | Get all the ONGs from the DB  |
| GET     | /auth-ongs/ong    | {ongs}    | Get a specific ONG from the DB  |
| POST    | /auth-ongs/signup  |  {ong}   | Create a new ONG             |
| POST    | /auth-ongs/login   |  {message: "ONG logged"}  | Login and create a token      |
| PUT     | /auth-ongs/edit | { message: "ONG updated"} | Update a specific ONG |

### Pets Routes:

| METHOD  | Endpoint      | Response  | Action                        |
|:-------:|:-------------:|:---------:|:-----------------------------:|
| GET     | /pets    | [pets]    | Get all the pets from the DB  |
| GET     | /pets/:petId  | {pet}    | Get a specific pet from the DB  |
| GET     | /pets/user-pets  | [{pets}]    | Get the pets of a specific user from the DB  |
| POST    | /pets/new-pet  |  {pet}   | Create a new pet             |
| PUT     | /pets/:petId | { message: "Pet updated"} | Update the pet |
| DEL     | /pets/:petId | { message: "Pet removed" } | Delete a specific pet

## Colaboradores:

<a href="https://github.com/renatainojosa">
    <sub><b>Renata Inojosa</b></sub>
</a>
<br />
<a href="https://github.com/walisonabram">
    <sub><b>Walison Abram</b></sub>
</a>