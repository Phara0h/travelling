#!/bin/bash

#Required
domain=$1
commonname=$domain
echo $1
#Change to your company details
country=US
state=FL
locality=USA
organization=Abeai
organizationalunit=Engineering
email=admin@abe.ai

#Optional
password=1234

if [ -z "$domain" ]
then
    echo "Argument not present."
    echo "Useage $0 [common name]"

    exit 99
fi

echo "Generating key request for $domain"

# #Generate a key
# openssl genrsa -des3 -passout pass:$password -out $domain.key 2048
#
# #Remove passphrase from the key. Comment the line out to keep the passphrase
# echo "Removing passphrase from key"
# openssl rsa -in $domain.key -passin pass:$password -out $domain.key

#Create the request
echo "Creating CSR"
openssl req -new -nodes -x509 -keyout $domain.key -out $domain.csr -passin pass:$password \
    -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/emailAddress=$email"

echo "---------------------------"
echo "-----Below is your CSR-----"
echo "---------------------------"
echo
cat $domain.csr

echo
echo "---------------------------"
echo "-----Below is your Key-----"
echo "---------------------------"
echo
cat $domain.key
