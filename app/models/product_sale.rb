class ProductSale < ApplicationRecord
  self.table_name = 'products_sales'
  belongs_to :product
  belongs_to :sale
end
