#!/bin/bash
declare -a collections=("user" "poll")

databaseName=$1

if [ "$1" ]
then
    echo "$1"
    for i in "${collections[@]}"
    do
        echo "Import $i"
        mongoimport --drop --db $1 --collection $i --file ./tests/data/$i.json
    done
else
    echo "Missing database name!"
fi
