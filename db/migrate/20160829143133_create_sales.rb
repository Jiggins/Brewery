class CreateSales < ActiveRecord::Migration[5.0]
  def change
    create_table :sales do |t|
      t.float :total
      t.float :net_total
      t.float :vat

      t.timestamps
    end

    create_table :products_sales, id: false do |t|
      t.belongs_to :product, index: true
      t.belongs_to :sale,    index: true
    end
  end
end
