#!/bin/bash

# Exit if any error occur
set -e

git pull

bundle install

set -x

# Rake tasks
rake db:migrate
rake db:fixtures:load
rake assets:clean
rake assets:precompile
CLASS=Product rake paperclip:clean
rake generate_systemd_unit
