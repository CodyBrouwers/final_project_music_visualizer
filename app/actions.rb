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
  visualization = Visualization.create!(
    song_path: params[:song_path],
    song_name: params[:song_name]
    )
  visualization.to_json
end

post '/visualizations/:viz_id/transitions' do
  # console.log(params[:viz_id])
  content_type :json
  visualization = Visualization.includes(:transitions).find(params[:viz_id])
  if visualization
    transition = visualization.transitions.create!(
      time: params[:time],
      params: params[:params]
    );
    Visualization.find(params[:viz_id]).transitions.to_json
  end
end

get '/visualizations/:viz_id/transitions' do
  content_type :json
  visualization = Visualization.find(params[:viz_id])
  transitions = visualization ? visualization.transitions : '';
  transitions.to_json;
end

