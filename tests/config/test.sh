#!/usr/bin/env bash

./tests/config/createdata.sh voting-app-test
mocha ./tests/api/* --compilers js:babel-core/register --recursive --timeout 10000