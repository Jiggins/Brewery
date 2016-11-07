require 'bigdecimal'
require 'bigdecimal/util'

class Product < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged
  has_and_belongs_to_many :sales

  # https://github.com/thoughtbot/paperclip/wiki/Thumbnail-Generation
  has_attached_file :image,
    styles: {
      tiny:  '64x64#',
      thumb: '128x128#',
      small: '256x256>'
    },
    url: "/system/:class/:style/:slug.:extension",
    default_url: "logo/:style.png"

  validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/

  def self.types
    [['Coffee Sit In',   'Product::CoffeeSitIn'],
     ['Coffee Take Out', 'Product::CoffeeTakeOut'],
     ['Tea Sit In',      'Product::TeaSitIn'],
     ['Tea Take Out',    'Product::TeaTakeOut'],
     ['Cold Drink',      "Product::ColdDrink"],
     ['Food',            "Product::Food"],
     ['Retail',          "Product::Retail"]]
  end

  def self.type_map
    types.map(&:reverse).to_h
  end

  def vat
    (price.to_d * (vat_rate / 100)).to_f
  end

  private

  # Use friendly_id slug for image name
  Paperclip.interpolates :slug  do |attachment, style|
    attachment.instance.slug
  end
end
