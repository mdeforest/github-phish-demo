#!/bin/bash

docker rm -f phish-server
docker run -d -p 3000:3000 --name phish-server phish-server:latest
