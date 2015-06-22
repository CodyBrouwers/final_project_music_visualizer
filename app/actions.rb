# Homepage (Root path)
get '/' do
  erb :index
end

get '/visualizations' do 
  content_type :json
  visualizations = Visualization.all
  visualizations.to_json
end

post '/visualizations/new' do
  content_type :json
  visualization = Visualization.create
  visualization.to_json
end