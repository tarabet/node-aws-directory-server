#!/bin/bash

set -ex

nodepids=$(ps aux | grep " node " | grep -v grep | cut -c10-15)

for nodepid in ${nodepids[@]}
do
echo "Stopping PID :"$nodepid
sudo kill -9 $nodepid
done

#check that PM2 lib is present, otherwise install
command -v pm2 >/dev/null 2>&1 || sudo npm i pm2 -g || { echo >&2 "I require PM2 but it's not installed.  Aborting."; exit 1; }

# Check that build file exists and extract it
FILE=./build.zip

if [[ -f "$FILE" ]]; then
    rm -rf dist
    tar -xzvf build.zip
else
    echo "$FILE does not exist"
fi

pm2 start -f dist/index.js > message.out 2> error.out
