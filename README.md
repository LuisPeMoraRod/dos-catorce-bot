# @doscatorce_bot

Telegram Bot implemented with Node.js and Mongoose to manage To-Do Lists. Uses FaaS approach with [Netlify Functions](https://www.netlify.com/products/functions/).

## How to deploy changes to Netlify:

## How to run locally:

1. Install dependencies:

```
npm install -g netlify-cli localtunnel
```

2. Use netlify-cli to login to site. A new web browser window will appear. Then, press on **Authorize** .

```
netlify login
```

3. Link local code to Netlify site. Choose **Use current git remote origin** option:

```
netlify link
```

4. Start the local dev server:

```
netlify dev
```

The local server will spin up and the function will be located at http://localhost:8888/.netlify/functions/update

You can use a REST client to test this connection by sending a dummy POST request with a body like the following (the chat ID must be valid)

```
{
  "update_id": 808635599,
  "message": {
    "chat": {
      "id": 808440364
    },
    "text": "/start"
  }
}
```

5. Expose port with **localtunnel**:

```
lt --port 8888
```

Copy the assigned url.

6. Set the webhook to tell Telegram bot where to send updates:

```
curl -F "url=<localtunnel URL from above>" https://api.telegram.org/bot<bot token>/setWebhook
```
