echo building $1
app=$1 PROD=1 node index.js; 
sh install-prod.sh $1