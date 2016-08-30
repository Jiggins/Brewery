json.extract! sale, :id, :total, :net_total, :vat, :created_at, :updated_at
json.url sale_url(sale, format: :json)