#!/bin/bash
export $(sed -e '/^#/d' .env | xargs)

node index.js
