################################################################################################
## Build DDP Network
##
## export ACCOUNT_NAME=ddp
## export CIRCLE_PROJECT_USERNAME=UsabilityDynamics
## export CIRCLE_PROJECT_REPONAME=www.usabilitydynamics.com
## export CURRENT_BRANCH=$(git describe --contains --all HEAD)
## export CURRENT_TAG=$(git describe --always --tag)
## export CURRENT_COMMIT=$(git rev-list -1 HEAD)
## export UPLOADS_BUCKET=gs://storage.usabilitydynamics.com/uploads
## export UPLOADS_DIR=/home/ddp/storage/uploads/
##
## @git reset --hard HEAD
## @git pull origin ${CURRENT_BRANCH}
##
################################################################################################

CIRCLE_PROJECT_USERNAME	      ?=DiscoDonniePresents
CIRCLE_PROJECT_REPONAME	      ?=www.discodonniepresents.com
CURRENT_BRANCH                ?=$(shell git describe --contains --all HEAD)
CURRENT_COMMIT                ?=$(shell git rev-list -1 HEAD)
CURRENT_TAG                   ?=$(shell git describe --always --tag)
ACCOUNT_NAME		              ?=ddp
UPLOADS_DIR		                ?=/home/ddp/storage/uploads/
UPLOADS_BUCKET		            ?=gs://storage.usabilitydynamics.com/uploads
RDS_BUCKET		                ?=s3://rds.uds.io/UsabilityDynamics/www.usabilitydynamics.com

#
#
#
default: install

# Create MySQL Snapshot
#
#
snapshot:
	@echo "Creating MySQL snapshot for <${CURRENT_BRANCH}> database branch."
	@wp db export ${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql
	@tar cvzf ${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz ${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql
	@s3cmd put --no-check-md5 --reduced-redundancy ${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz s3://rds.uds.io/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz
	@echo "MySQL snapshot available at s3://rds.uds.io/DiscoDonniePresents/${CIRCLE_PROJECT_REPONAME}/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz."

#
# - Import MySQL Snapshot
#
staging:
	@echo "Setting up staging environment from RDS data snapshot, <${CURRENT_BRANCH}> database branch, using s3://rds.uds.io/${CIRCLE_PROJECT_USERNAME}/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz for MySQL data."
	@rm -rf composer.lock wp-vendor/composer/installed.json wp-vendor/composer/installers
	@s3cmd get --no-check-md5 --skip-existing s3://rds.uds.io/${CIRCLE_PROJECT_USERNAME}/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz ~/tmp/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz
	@tar -xvf ~/tmp/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz -C ~/tmp
	@wp db import ~/tmp/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql
	@wp option update upload_url_path https://storage.googleapis.com/storage.usabilitydynamics.com/uploads
	@wp option update git:branch ${CURRENT_BRANCH}
	@wp option update git:build ${CIRCLE_BUILD_NUM}
	@wp option update git:organization ${CIRCLE_PROJECT_USERNAME}
	@wp option update git:repository ${CIRCLE_PROJECT_REPONAME}
	@wp transient delete-all
	@wp cache flush

#
# - Import MySQL Snapshot
#
develop:
	@echo "Installing ${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}:${CURRENT_TAG} for development."
	@npm install --silent
	@rm -rf composer.lock wp-vendor/composer/installed.json wp-vendor/composer/installers
	@composer update --dev --prefer-source --no-interaction --no-progress
	@s3cmd get --no-check-md5 --skip-existing s3://rds.uds.io/${CIRCLE_PROJECT_USERNAME}/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz ~/tmp/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz
	@tar -xvf ~/tmp/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz -C ~/tmp
	@wp db import ~/tmp/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql
	@wp plugin deactivate w3-total-cache google-sitemap-generator
	@wp option update upload_url_path https://storage.googleapis.com/storage.usabilitydynamics.com/uploads
	@wp option update git:branch ${CURRENT_BRANCH}
	@wp option update git:build ${CIRCLE_BUILD_NUM}
	@wp option update git:organization ${CIRCLE_PROJECT_USERNAME}
	@wp option update git:repository ${CIRCLE_PROJECT_REPONAME}
	@wp transient delete-all
	@wp cache flush

#
#
#
production:
	@echo "Installing ${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}:${CURRENT_TAG} for development."
	@wp option update git:branch ${CURRENT_BRANCH}
	@wp option update git:organization ${CIRCLE_PROJECT_USERNAME}
	@wp option update git:repository ${CIRCLE_PROJECT_REPONAME}

#
#
# s3-cli sync --no-delete-removed --acl-public --no-check-md5 --skip-existing s3://rds.uds.io/DiscoDonniePresents/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz ~/tmp/${ACCOUNT_NAME}_${CURRENT_BRANCH}.sql.tgz
#
# @gsutil -m acl -R set public-read ${UPLOADS_BUCKET}
storageSync:
	@echo "Synchornizing files with <${UPLOADS_BUCKET}> bucket."
	@gsutil -m rsync -dpr ${UPLOADS_DIR} ${UPLOADS_BUCKET}

# Prepare for Git Push and push
#
#
release:
	@echo "Running application install ${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}:${CURRENT_TAG}."
	@rm -rf composer.lock
	@rm -rf wp-vendor/composer/installed.json
	@rm -rf wp-vendor/composer/installers
	@rm -rf wp-vendor/composer/installers/.gitignore
	@rm -rf wp-vendor/**/.git
	@composer update --optimize-autoloader --no-dev --prefer-dist --no-interaction
	@git add . --all && git commit -m '[ci skip]' && git push

# Prepare for Git Push and push
#
#
snapshotRelease:
	make snapshot
	make release

# Dangerous command. Will dump any local changes.
#
#
reset:
	@echo "Resetting current branch <${CURRENT_BRANCH}> to origin."
	@git fetch --force --quiet origin
	@git clean --force -d --quiet
	@git reset --hard origin/${CURRENT_BRANCH}
	@git pull --force --quiet

#
#
#
merge:
	@echo "Merging current <${CURRENT_BRANCH}> branch with origin/production."
	@git fetch origin
	@git merge --no-ff origin/production -m "Merging with production"

# Install for Staging/Development
#
# - We always dump /wp-vendor/composer/installers* to avoid any issues with installers.
# - Composer install Will delete any unused depds.
# - Composer update will fix anything missing. If "dist" is unavailable, will fall back to source.
#
install:
	@echo "Installing ${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}:${CURRENT_TAG}."
	@npm install --silent
	@rm -rf wp-vendor/composer/installed.json wp-vendor/composer/installers
	@composer update --prefer-source --dev --no-interaction --no-progress
