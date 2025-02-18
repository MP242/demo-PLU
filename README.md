# CallCenter

## Prerequis

next.config.js

```config
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        serverActionsBodySizeLimit: '10mb',
    },
    output: 'standalone'
}

module.exports = nextConfig;

```

.env

```
MONGO_URI="mongodb://admin:87Y92iSnVBuQQV@db-cc.austral-energie.re:27030"
NEXTAUTH_SECRET=FweA1X4H5KmuyBMevGetE7etAhjXC81UCQNzDRmTVic=
NEXTAUTH_URL=http://localhost:3000
```
