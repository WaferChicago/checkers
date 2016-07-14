#!/bin/bash

cat ../data/games.json >> /Users/localadmin/workspace/checkers/logs/populate.log
mongoimport --jsonArray --drop --db $DB --collection games --file ../data/games.json
