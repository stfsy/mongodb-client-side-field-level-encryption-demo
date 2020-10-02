#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

declare -r mongoContainer=$(docker ps | grep mongo | awk '{print $1}')

if [ -n "$mongoContainer" ]; then
    docker stop $mongoContainer
fi

declare -r newContainerId=$(docker run -d -p 27017:27017 mongo:4)

sleep 3

docker cp $DIR/mongodb-setup.js $newContainerId:/setup.js
docker exec -it $newContainerId bash -c "mongo /setup.js"