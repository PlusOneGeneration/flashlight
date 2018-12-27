FROM ubuntu:precise

RUN mkdir /project
WORKDIR /project

RUN apt-get update
RUN apt-get install -y build-essential python-software-properties git

# node.js
RUN add-apt-repository -y ppa:chris-lea/node.js
RUN apt-get update -y
RUN apt-get -y install nodejs

# npm packages

RUN npm install -g forever nodemon
RUN npm install -g bower
RUN rm -rf node_modules || echo no-node_modules

ADD . /project

RUN bash -c "npm install"
RUN bash -c "bower install --config.interactive=false --allow-root"

EXPOSE 4000
CMD npm start
