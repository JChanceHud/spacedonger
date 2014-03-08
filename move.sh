#! /bin/bash

IP=192.168.1.112
REPODIR=$(dirname $0)

ssh Chance@$IP rm -rf ~/JCHDev/spacedonger
scp -qr $REPODIR Chance@$IP:~/JCHDev/spacedonger
