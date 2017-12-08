# Image Server
This stores images on disk and on ipfs.
Images are then content addressable by either sha256 or ipfs hash

## Routes
### POST /images "store image"
### GET /images/<sha256> "get image"
### GET /images "list images"

### POST /cards "store card"
### GET /cards/<key> "get card"
### GET /cards "list images"

## Install & Setup
```sh
git clone git@github.com:rgruesbeck/ttc-server.git; cd ttc-server
docker-compose run server npm install
```

## Run Development Server
### start
```sh
docker-compose up
```

### urls
- Images: [localhost:5000/images](http://localhost:5000/images)
- Cards: [localhost:5000/cards](http://localhost:5000/cards)
- Ipfs Web Console: [localhost:5001/webui](http://localhost:5001/webui)

## Todo
- Bitmark needs work: possibly do this as a scheduled job, where images are marked as registered after success?
- Validation & working well with react client.
