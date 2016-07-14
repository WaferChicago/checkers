#!/bin/bash

cat ../data/players.json >> /Users/localadmin/workspace/checkers/logs/populate.log
mongoimport --jsonArray --drop --db $DB --collection players --file ../data/players.json
