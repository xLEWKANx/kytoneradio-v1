
apt-get update
curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
apt-get install --yes nodejs
apt-get install --yes --silent icecast2 liquidsoap

npm install npm -g
mkdir ~/npm-global
npm config set prefix '~/npm-global'
echo 'export PATH=~/npm-global/bin:$PATH' >>  ~/.profile
source ~/.profile
# npm config set prefix ~/npm
# npm install -g npm
# npm install -g --no-bin-links gulp nodemon forever node-gyp
# PATH="$PATH:$HOME/npm/bin"
# cd /vagrant/web
# npm install --no-bin-links