#!/bin/bash
declare -a collections=("users" "polls")

databaseName=$1

if [ "$1" ]
then
    echo "$1"
    for i in "${collections[@]}"
    do
        echo "Import $i"
        mongoimport --db $1 --collection $i --drop --file ./tests/data/$i.json
    done
else
    echo "Missing database name!"
fi
