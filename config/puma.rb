rails_env = ENV['RAILS_ENV'] || 'development'
environment rails_env

pidfile "#{Dir.pwd}/tmp/pids/puma.pid"
state_path "#{Dir.pwd}/tmp/pids/puma.pid.state"

if rails_env == 'production'
  bind "unix://#{Dir.pwd}/tmp/sockets/puma.sock"
else
  port ENV.fetch('RAILS_PORT',3000)
end

activate_control_app

plugin :tmp_restart

on_worker_boot do
  require "active_record"
  ActiveRecord::Base.connection.disconnect! rescue ActiveRecord::ConnectionNotEstablished
  ActiveRecord::Base.establish_connection(YAML.load_file("#{Dir.pwd}/config/database.yml")[rails_env])
end

