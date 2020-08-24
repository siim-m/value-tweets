# Valuetweets

[Valuetweets](https://valuetweets.siim.me) is a simple Next.js application that
showcases random tweets of prolific Twitter accounts from the [Visualize Value](https://www.visualizevalue.com/)
community. Ispired by the [Perell Tweet Generator](https://www.birdybots.com/perell-bot/),
it started off with tweets only by the [@visualizevalue](https://twitter.com/visualizevalue)
handle, but additional accounts have since been added.

It uses the Twitter API to sync all tweets from handles defined in [config.js](config.js)
into a MongoDB database. It then searches for a random tweet by the specified account
that meets the following criteria:

- Is not a retweet or a reply.
- Contains one image.
