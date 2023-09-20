#!/bin/bash

docker rm -f phish-server
docker run -d -p 80:3000 --name phish-server phish-server:latest
