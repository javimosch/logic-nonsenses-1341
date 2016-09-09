echo BUILDING $1
app=$1 PROD=1 node index.js; 
echo COPING RESOURCES
sh install-prod.sh $1