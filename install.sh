#/bin/bash

export RAILS_ENV=beta

# Checks if a command is installed
function commandExists {
  command -v $1 > /dev/null
  return $?
}

dependencies=(
  curl
  git
  imagemagick
  nodejs
)

for i in ${dependencies[*]}; do
  if ! commandExists $i; then
    dependenciesNotFound="${dependenciesNotFound}$i "
  fi
done

if [ ${dependenciesNotFound+x} ]; then
  echo 'The following dependencies are not installed on this system:'
  echo "\t${dependenciesNotFound}" | sed 's/ /\n\t/g'

  case `uname` in
    'Darwin')
      echo 'These can be installed using brew'

      if commandExists brew; then
        echo "\n\tbrew install ${dependenciesNotFound}\n"
      else
        echo 'brew is not installed on this system, consider installing brew and running this script again'
        echo 'http://brew.sh'
      fi
      ;;

    *)
      if commandExists apt-get; then
        echo -e "These can be installed using\n\n\tsudo apt-get install ${dependenciesNotFound}\n"
      elif commandExists yum; then
        echo -e "These can be installed using\n\n\tsudo yum install ${dependenciesNotFound}\n"
      else
        echo -e "These can be installed using your package manager to install: ${dependenciesNotFound}\n"
      fi
      ;;
  esac
  exit 1
fi

if ! commandExists ruby; then
  echo 'Installing Ruby Version Manager (RVM)'
  gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
  curl -sSL https://get.rvm.io | bash -s stable
fi

# Exit if any error occur
set -e

gem install bundler
bundle install

set -x

# Rake tasks
rake db:migrate
rake db:fixtures:load
rake assets:clean
rake assets:precompile
rake generate_systemd_unit
