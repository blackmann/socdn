# Self hOsted CDN

Simply a self-hosted cdn/file server.

![Screenshot](/assets/screenshot.png)

Run the following to build a docker image:

```sh
docker build -t socdn:latest --build-arg api_url=http://localhost:3000
```

The API URL should match where you host this project.

🌵 Supports file revisions too.

### Story time 📖

I created this project to _self_-host [glb](https://en.wikipedia.org/wiki/GlTF) and other media files that I add to projects I work on. For example, when working on threejs projects, I may start with a glb containing cubes as placeholders. But as time goes on, I may update some cubes in the glb to their actual forms. This means, eventually the git size of the respective repository will grow huge.

I wouldn't want people (and myself) to wait when downloading repos - which will include unnecessary revisions in the repo.

### Features (lacking)

There's no security on the admin interface at the moment. Will add that shortly.
