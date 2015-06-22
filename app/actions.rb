# Homepage (Root path)
get '/' do
  erb :index
end

get '/visualizations' do 
  content_type :json
  visualizations = Visualization.all
  visualizations.to_json
end

post '/visualizations/:viz_id/transitions' do
  content_type :json
  transition = Transition.create!(
    visualization_id: params[:viz_id],
    time: params[:time],
    params: params[:parameters]
    );
  transition.to_json
end

get '/visualizations/:viz_id/transitions' do
  content_type :json
  visualization = Visualization.find(params[:viz_id]).includes(:transitions)
  visualization.to_json;
end
