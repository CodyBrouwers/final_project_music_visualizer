class CreateTransitions < ActiveRecord::Migration
  def change
    create_table :transitions do |t|
      t.belongs_to :visualization
      t.string :time
      t.string :params
      t.timestamps null: false
    end
  end
end
