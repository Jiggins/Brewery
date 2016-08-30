class Sale < ApplicationRecord
  has_and_belongs_to_many :products

  def create_from_products(products)
    @sale = Sale.new
    @sale.products

  end
end
