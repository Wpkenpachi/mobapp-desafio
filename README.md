# Setup
<b>Installing dependencies</b>
```
$ npm i
```

<b>Setting enviroment variables<b>
First rename .env_example for .env
```
# example
API_URL=http://localhost:1337               # Api Url
SERVER_URL=http://localhost:1337/parse      # ParseServer Url
SECRET=mobapp                               # Jwt Secret
APPLICATION_ID=appid                        # ParseServer APPLICATION_ID
MASTER_KEY=masterkey                        # ParseServer MASTER_KEY
DATABASE_URI=mongodb://localhost/mobapp     # ParseServer DATABASE_URI
PORT=1337                                   # Api Port
```

# Interfaces
```
# User
{
    username: "wesley@gmail.com",
    password: "123"
}

# Movie
{
    title: "",
    description: "",
    poster: "",
    release_date: "YYYY-MM-DD"
}
```

# REST Api Endpoints

## Auth
Url: API_URL/auth <br/>
Data: { username, password } <br/>
Response:
```
{
  "auth": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDMwMDI0Mzl9.5kPUnUwUPlpxiUs9CZRKWka7Vwa0kUg8yq98Oe7ilH8"
}
```

## Get Movies
Url: API_URL/get/movies <br/>
Headers:
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDMwMDI0Mzl9.5kPUnUwUPlpxiUs9CZRKWka7Vwa0kUg8yq98Oe7ilH8
```
Response:
```
[
    {
        "title": "Um Sonho de Liberdade",
        "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        "poster": "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX182_CR0,0,182,268_AL_.jpg",
        "release_date": "1994-03-17",
        "createdAt": "2020-10-18T09:01:26.399Z",
        "updatedAt": "2020-10-18T09:01:26.399Z",
        "objectId": "Ie4LdB5D4H"
    }
]
```

## Story Movies
Url: API_URL/store/movies <br/>
Headers:
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDMwMDI0Mzl9.5kPUnUwUPlpxiUs9CZRKWka7Vwa0kUg8yq98Oe7ilH8
```
Data: [..., { title, description, poster, release_date }]
Response:
```
[
  {
    "title": "A espera de um milagre",
    "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    "poster": "https://www.imdb.com/title/tt0111161/mediaviewer/rm10105600",
    "release_date": "1995-03-17",
    "createdAt": "2020-10-18T10:08:17.909Z",
    "updatedAt": "2020-10-18T10:08:17.909Z",
    "objectId": "Ccy6M5JVSe"
  }
]
```

## Update Movie
Url: API_URL/update/movie/Ccy6M5JVSe <br/>
Headers:
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDMwMDI0Mzl9.5kPUnUwUPlpxiUs9CZRKWka7Vwa0kUg8yq98Oe7ilH8
```
Data: { title, description, ... }
Response:
```
{
  "title": "Freedom 2",
  "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  "poster": "https://www.imdb.com/title/tt0111161/mediaviewer/rm10105600",
  "release_date": "1995-03-17",
  "createdAt": "2020-10-18T10:08:17.909Z",
  "updatedAt": "2020-10-18T10:08:25.100Z",
  "objectId": "Ccy6M5JVSe"
}
```

## Search Movies By Release Date
Url: API_URL/fetch/movies?release_date=1995-03-17 <br/>
Headers:
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDMwMDI0Mzl9.5kPUnUwUPlpxiUs9CZRKWka7Vwa0kUg8yq98Oe7ilH8
```
Response:
```
[
  {
    "title": "The Dark Knight",
    "release_date": "1994-03-17",
    "createdAt": "2020-10-18T10:56:40.975Z",
    "updatedAt": "2020-10-18T10:56:41.084Z",
    "objectId": "yFAm6pJq6G"
  },
  {
    "title": "Batman: O Cavaleiro das Trevas",
    "release_date": "1994-03-17",
    "createdAt": "2020-10-18T10:56:41.068Z",
    "updatedAt": "2020-10-18T10:56:41.068Z",
    "objectId": "fXKpA8sXdG"
  }
]
```

## Seach Movies by Title
Url: API_URL/fetch/movies?title=The Dark Knight <br/>
Headers:
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDMwMDI0Mzl9.5kPUnUwUPlpxiUs9CZRKWka7Vwa0kUg8yq98Oe7ilH8
```
Response:
```
[
  {
    "title": "The Dark Knight",
    "release_date": "1994-03-17",
    "createdAt": "2020-10-18T10:56:40.975Z",
    "updatedAt": "2020-10-18T10:56:41.084Z",
    "objectId": "yFAm6pJq6G"
  }
]
```

# Test
```
$ npm test
```