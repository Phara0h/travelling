#!/bin/bash
LC_ALL=C tr -dc 'A-Za-z0-9!#$%&''()*+,-./:;<>?@[\]^_{|}~' </dev/urandom | dd bs=128 count=1 2>/dev/null
