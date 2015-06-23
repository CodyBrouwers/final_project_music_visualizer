require 'rubygems'
require 'bundler/setup'

require 'active_support/all'
require 'rspec'
require 'rake'
require 'sinatra/activerecord/rake'
require './app/models/visualization.rb'

require 'active_record'
require 'database_cleaner'

require 'rack/test'
require 'capybara/poltergeist'
require 'capybara/rspec'
Capybara.javascript_driver = :poltergeist
Capybara.default_driver = :poltergeist
Capybara.app_host = "http://localhost:3000"

# Connect to the DB
ActiveRecord::Base.establish_connection(
  :adapter => 'sqlite3',
  :database => "db/db.sqlite3"
)

def table_exists? name
  ActiveRecord::Base.connection.table_exists? name
end

# Recreate the database
ActiveRecord::Migration.suppress_messages do
  require './db/schema.rb'
  Rake::Task["db:seed"].invoke
end

# spec/support/factory_girl.rb
RSpec.configure do |config|
  # additional factory_girl configuration

  config.include Capybara::DSL

  # config.include Rack::Test::Methods

  config.color = true
  # config.formatter = :documentation

  config.before(:each) do
    DatabaseCleaner.start
    visit '/'
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end

  config.before(:all) do 
    load '../db/seeds.rb'
  end
end
