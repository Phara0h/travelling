#!/bin/bash
export $(sed -e '/^#/d' .env | xargs)

node --inspect index.js
