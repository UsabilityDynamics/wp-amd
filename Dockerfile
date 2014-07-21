#################################################################
## DiscoDonniePresents.com Application Container
##
## * Select paths are exposed that are safe to be mounted for developemnt purposes.
## * Only essential files and directories added to container that allow Grunt tasks and web-based file serving.
##
##
## @ver 0.2.1
## @author potanin@UD
##
#################################################################

FROM          andypotanin/devbox:0.1.1
MAINTAINER    UsabilityDynamics, Inc. <info@usabilitydynamics.com>
USER          root

RUN           mkdir -p /var/storage
RUN           mkdir -p /tmp

ENV           PHP_ENV               development
ENV           NODE_ENV              development

ADD           application           /var/www/application
ADD           vendor                /var/www/vendor
ADD           storage               /var/www/storage
ADD           .htaccess             /var/www/.htaccess
ADD           wp-cli.yml            /var/www/wp-cli.yml
ADD           index.php             /var/www/index.php
ADD           package.json          /var/www/package.json
ADD           composer.json         /var/www/composer.json
ADD           gruntfile.js          /var/www/gruntfile.js
ADD           sunrise.php           /var/www/sunrise.php
ADD           db.php                /var/www/db.php


EXPOSE        80
EXPOSE        443
EXPOSE        1134
EXPOSE        22

WORKDIR       /var/www
CMD           --help
ENTRYPOINT    grunt