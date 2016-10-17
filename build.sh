echo BUILDING $1
app=$1 PROD=1 node index.js; 
echo COPYING CONFIG
sleep 2
node lib/tasks/generateReleaseConfig.js;
echo COPYING RESOURCES
sh install-prod.sh $1