which nginx || sudo apt-get install nginx -y

sudo cp provision/nginx/project.crt /etc/ssl/project.crt
sudo cp provision/nginx/project.key /etc/ssl/project.key

sudo cp provision/nginx/nginx.conf /etc/nginx/nginx.conf
sudo service nginx restart