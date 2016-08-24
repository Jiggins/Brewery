class Product < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged
  has_attached_file :image
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/

  def self.types
    [['Hot Drink Sit In', 'Product::HotDrinkSitIn'],
    ['Hot Drink Take Out', "Product::HotDrinkTakeOut"],
    ['Cold Drink', "Product::ColdDrink"],
    ['Food', "Product::Food"],
    ['Retail', "Product::Retail"]]
  end
end
