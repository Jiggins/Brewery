class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.string :type
      t.string :slug
      t.float  :price, null: false
      t.float  :vat_rate, null: false
      t.boolean :visible, default: true
      t.attachment :image

      t.timestamps
    end
    add_index :products, :slug, unique: true
  end
end
