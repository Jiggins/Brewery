json.extract! product, :id, :name, :type, :slug, :price, :vat_rate, :visible, :image, :created_at, :updated_at
json.url product_url(product, format: :json)