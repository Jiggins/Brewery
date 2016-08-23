require 'humanize'

namespace :fixture_generator do
  desc "generate fixtures for a given sql query from the current development database"

  task :generate, [:sql, :file_name] => :environment do |t, args|
    args.with_defaults(:sql => nil, :file_name => nil)
    number = 0

    puts "creating fixture - #{args.file_name}"
    File.open("#{Rails.root}/test/fixtures/#{args.file_name}.yml", 'a+') do |file|
      data = ActiveRecord::Base.connection.select_all(args.sql)
      file.write data.inject({}) { |hash, record|
        number += 1
        hash["#{number.humanize}"] = record
        hash
      }.to_yaml
    end
  end
end
