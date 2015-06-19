class CreateVisualizations < ActiveRecord::Migration
  def change
    create_table :visualizations do |t|
      t.string :song_path
      t.string :song_name
      t.timestamps null: false
    end
  end
end
