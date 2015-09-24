#!/usr/bin/env bash

echo "updating"
apt-get update

echo "install node"
curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
apt-get install --yes nodejs
apt-get install --yes --silent liquidsoap

echo "install npm tools"
apt-get install --yes build-essential

echo "configure and update npm"
npm install npm -g
mkdir /home/npm-global
sudo NPM_CONFIG_PREFIX=/home/npm-global npm install gulp node-gyp nodemon forever -g --no-bin-links
echo "finished"
# npm install -g --no-bin-links gulp nodemon forever node-gyp
# PATH="$PATH:$HOME/npm/bin"
# cd /vagrant/web
# npm install --no-bin-links