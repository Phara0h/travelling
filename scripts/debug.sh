#!/bin/bash
export $(sed -e '/^#/d' .env | xargs)

node --inspect-brk index.js
