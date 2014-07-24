### Environment Setup
You should never have to pull this repository unless you're planning on making changes to the core image.
In most cases you want to pull the Docker Staging/Production/Latest image to setup your environment.

`docker run -tdP discodonniepresents/www.discodonniepresents.com`

The above will pull the "latest" tag, which should be very similar to what is on production. To pull the staging image:
`docker run -tdP discodonniepresents/www.discodonniepresents.com:staging`

### Modular Development
To start container and expose wp-festival and wp-veneer for development, run the following.

```sh
docker run -tdP \
  -v ~/dev/wp-festival:/var/www/vendor/themes/wp-festival \
  -v ~/dev/wp-veneer:/var/www/vendor/modules/wp-veneer \
  discodonniepresents/www.discodonniepresents.com \
  /usr/bin/supervisord -n
```

This will mount the ~/dev/wp-festival and ~/dev/wp-veneer directories on your host machine.
If those directories don't exist they will be created.
You will need to run "git clone" within those directories to begin development.

### Container Development

Clone GitHub Project.
`composer create-project discodonniepresents/www.discodonniepresents.com`

Run Temporary Environment with bash. Generally you should run a seperate terminal that can be used to commit and push the running container.
```
docker run -tiP --rm --privileged \
  --name=ddp.wip \
  -v /storage/storage.discodonniepresents.com:/var/storage \
  -v /root/.ssh:/root/.ssh \
  discodonniepresents/www.discodonniepresents.com \
  /bin/bash
```

`docker commit --message="wip" ddp.wip discodonniepresents/www.discodonniepresents.com`
`docker push discodonniepresents/www.discodonniepresents.com`

```bash
docker run -tiP --rm \
  --name=ddp.wip \
  --privileged \
  -v /media/storage.discodonniepresents.com:/var/storage \
  discodonniepresents/www.discodonniepresents.com /home/blackbox/startServer
```

### Production Deployment
On production, to start a daemonized container, run the following command.

```bash
docker run -tiP --rm \
  --name=ddp.wip \
  --privileged \
  -v /media/storage.discodonniepresents.com:/var/storage \
  discodonniepresents/www.discodonniepresents.com /home/blackbox/startServer
```

This command assumes that "storage" must reside on the host machine in /media/storage.discodonniepresents.com.

### Composer Configuration
Composer is the authority on dependency management for latest-related services. NPM is also used, but almost entirely for development tools.

* Unlike before, composer.json does not require plugins and themes. Plugins and themes are installed by WordPress, not composer.
* That being said, composer.json can require plugins absoltely essential for operation, such as WP-Veneer or for a multisite network WP-Network.
* As a rule of thumb, Composer is used to manage "must-use", and above, level dependencies. Anything below should be controlled by WordPress state.

### Image Commands
Aside from /bin/bash and /bin/supervisord commands there are several helper commands.

* /home/blackbox/startServices
* /home/blackbox/stopServices

* /home/blackbox/util/createDB
* /home/blackbox/util/createMySQLAdminUser
* /home/blackbox/util/importSQL
* /home/blackbox/util/runMySQL
* /home/blackbox/util/startApache2
* /home/blackbox//utilstartMySQL

### Application Structure
There is a change to the way "storage" works.

* /storage/assets - Domain-specific asset files, such as styles and scripts, that are generated based on domain settings.
* /storage/media  - Uploads.
* /storage/static - Any static files that are served before WordPress by .htaccess.

### GitHub vs Docker

* Things that should not be stored in GitHub repository: w3tc-config, plugins, themes, storage, node_modules, vendor, cache
* Things that should be stored in Docker Image: w3tc-config, plugins, themes, storage, node_modules, vendor. In case of DDP storage/media will not be stored on host due to its size.
