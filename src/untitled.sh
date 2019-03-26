#!/bin/bash
echo "Testing Remote Execution" > /home/ubuntu/remote_test.txt
# APIS
cd /home/ubuntu/EZPayReactApp
git reset --hard
git checkout .
git pull origin alpha
npm install
npm run build
cp -rf build/* /var/www/html/
# Website
cd /home/ubuntu/neo_web_build_generator
git reset --hard
git pull origin alpha
npm install
npm run build
# Frontend
sudo cp -rf /home/ubuntu/neo_web_build_generator/build/* /home/ubuntu/neohrm_web_product/build/
sudo cp -rf /home/ubuntu/neo_web_build_generator/build/* /var/www/html/

pm2 reload all
echo "Done"