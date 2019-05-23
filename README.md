## To Start

```
npm run dev
```

### How it works

When the endpoint is reached, it checks to see if that game is in the redis cache
If it is not in the cache, it will check the mongoDB.
If the game status is 'completed', it will return the game info from the DB.
Otherwise it will send a fetch request for new data for the game, update the DB and set the cache with the new info.
The cache will expire every 15 seconds.
