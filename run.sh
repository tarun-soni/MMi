#! /usr/bin/env bash
echo "- - - - - RUNNING COMPILE - - - - -"

truffle compile --all

echo "- - - - - RUNNING MIGRATE - - - - -"

truffle migrate --reset

echo "- - - - - RUNNING SERVER - - - - -"

npm run start