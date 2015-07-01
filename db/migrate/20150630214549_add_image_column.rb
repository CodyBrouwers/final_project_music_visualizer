class AddImageColumn < ActiveRecord::Migration
  def change

    change_table :visualizations do |t|
      t.string :image
    end

  end
end
