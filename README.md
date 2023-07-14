# Self hOsted CDN

Simply a self-hosted cdn/file server.

![Screenshot](/assets/screenshot.png)

Run the following to build a docker image:

```sh
docker build -t socdn:latest --build-arg api_url=http://localhost:3000
```

The API URL should match where you host this project.

MongoDB is required to run this project. When hosting, you need to supply the following env:

```
MONGO_URL=<mongodb URL> // you can use a free tier from Atlas
```

When testing locally using docker, you can set `MONGO_URL` as `mongodb://host.docker.internal:271017/socdn`; given that you have MongoDB locally installed.

🌵 Supports file revisions too.

### Deployment

If you're using a docker based deployment like Heroku or [Dokku](https://dokku.com), note that redeploys will spin new instances and files will get lost. To keeps files persistent between deploys, you should mount a folder on the file system to `/app/socdn_files`.

When using dokku, the command is:

```sh
# running from /root
mkdir socdn_files
dokku storage:mount <app-name> /root/socdn_files:/app/socdn_files
```

Here's a guide on how to do this with vanilla docker: https://docs.docker.com/storage/bind-mounts/#start-a-container-with-a-bind-mount


### CLI

This project includes a CLI to help automate integrations with projects. Install the CLI with the following command:

```sh
npm install --save-dev @socdn/cli
yarn add -D  @socdn/cli
```

Run `npx @socdn/cli init` to create a default configuration file `sync.meta.json` and setup git hooks that will automatically run syncs on commit. Remember to edit this file with the correct values. Don't ignore this file from version control. Rather you should add folders you intend to sync to `.gitignore`.

Whenever you make a commit, `npx @socdn/cli sync` is automatically run.


### Story time 📖

I created this project to _self_-host [glb](https://en.wikipedia.org/wiki/GlTF) and other media files that I add to projects I work on. For example, when working on threejs projects, I may start with a glb containing cubes as placeholders. But as time goes on, I may update some cubes in the glb to their actual forms. This means, eventually the git size of the respective repository will grow huge.

I wouldn't want people (and myself) to wait when downloading repos - which will include unnecessary revisions in the repo.

### Features (lacking)

There's no security on the admin interface at the moment. Will add that shortly.
