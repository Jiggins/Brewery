class Product < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged

  # https://github.com/thoughtbot/paperclip/wiki/Thumbnail-Generation
  has_attached_file :image,
    styles: {
      tiny:  '64x64#',
      thumb: '128x128#',
      small: '256x256>'
    },
    default_url: "logo/:style.png"

  validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/

  def self.types
    [['Hot Drink Sit In', 'Product::HotDrinkSitIn'],
     ['Hot Drink Take Out', "Product::HotDrinkTakeOut"],
     ['Cold Drink', "Product::ColdDrink"],
     ['Food', "Product::Food"],
     ['Retail', "Product::Retail"]]
  end
end
