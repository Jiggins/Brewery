class User < ApplicationRecord
  has_many :sales
  has_attached_file :image
  validates_attachment :image, content_type: { content_type: ["image/jpg", "image/jpeg", "image/png", "image/gif"] }

  has_attached_file :image,
    styles: {
      tiny:  '64x64>',
      large: '720x720>'
    },
    default_url: "logo/:style.png"
end
