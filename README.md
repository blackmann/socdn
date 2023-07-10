# Self hOsted CDN

Simply a self-hosted cdn

![Screenshot](/assets/screenshot.png)

Run the following to build a docker image:

```sh
docker build -t socdn:latest --build-arg api_url=http://localhost:3000
```

The API url should match where you host this project.

🌵 Supports file revisions too.
