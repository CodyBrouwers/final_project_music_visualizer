# Homepage (Root path)

#   headers 'Access-Control-Allow-Origin' => '*'
#           # 'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST']
get '/' do
  erb :index
end

get '/visualizations' do 
  content_type :json
  visualizations = Visualization.all
  visualizations.to_json
end

post '/visualizations' do 
  content_type :json
  visualization = Visualization.create!(
    id: params[:id],
    path: params[:path],
    name: params[:name],
    image: params[:image]
  )
  visualization.to_json
end

put '/visualizations/:viz_id/edit' do
  content_type :json
  visualization = Visualization.find(params[:viz_id])
  if visualization
    visualization.update(path: params[:path], name: params[:name], image: params[:image])
  end
  visualization.to_json
end

get '/visualizations/:viz_id/transitions' do
  content_type :json
  visualization = Visualization.find(params[:viz_id])
  transitions = visualization ? visualization.transitions : '';
  transitions.to_json;
end

post '/visualizations/:viz_id/transitions' do
  content_type :json
  visualization = Visualization.includes(:transitions).find(params[:viz_id])
  if visualization
    transition = visualization.transitions.create!(
      id: params[:id],
      time: params[:time],
      params: params[:params]
    );
    return transition.to_json
  end
end

put '/visualizations/:viz_id/transitions/:transition_id' do
  content_type :json
  transition = Transition.find(params[:transition_id])
  if transition
    transition.update_attribute(:params, params[:params])
  end
  transition.to_json
end

delete '/visualizations/:viz_id/transitions/:transition_id' do
  content_type :json
  transition = Transition.find(params[:transition_id])
  if transition
    transition.delete
  end
  transition.to_json
end

delete '/visualizations/:viz_id/transitions' do
  content_type :json
  visualization = Visualization.find(params[:viz_id])
  if visualization
    visualization.transitions.destroy_all
  end
  visualization.to_json
end