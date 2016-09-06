class CreateSales < ActiveRecord::Migration[5.0]
  def change
    create_table :sales do |t|
      t.decimal :total,     precision: 4, scale: 2
      t.decimal :net_total, precision: 4, scale: 2
      t.decimal :vat,       precision: 4, scale: 2
      t.integer :cash_or_credit, default: 0
      t.boolean :loyalty_card, default: false

      t.timestamps
    end

    create_table :products_sales, id: false do |t|
      t.belongs_to :product, index: true
      t.belongs_to :sale,    index: true
    end
  end
end
