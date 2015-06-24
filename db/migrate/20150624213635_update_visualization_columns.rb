class UpdateVisualizationColumns < ActiveRecord::Migration
  def change
    
    change_table :visualizations do |t|
      t.rename :song_path, :path
      t.rename :song_name, :name
    end

  end
end
