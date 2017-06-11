#!/bin/bash

### rawr
set -x
###
## pull new images
docker-compose -f docker-compose.prod.yml pull
## start new containers
docker-compose -f docker-compose.prod.yml up -d --force-recreate
