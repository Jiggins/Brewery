# json.array! @products, partial: 'products/product', as: :product

@products.find_all do |product|
  json.set! product.id do
    json.(product, :name, :price, :slug, :vat)
  end
end
