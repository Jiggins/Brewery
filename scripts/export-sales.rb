#! bin/rails runner

require 'csv'

include Util

CSV.open "/tmp/sales-export-#{Date.today.strftime '%B'}.csv", "wb" do |csv|
  csv << "id, sale id, Date, Sales @9%, Sales @13.5%, Sales @23%, Sales@Other, Cost @9%, Cost @23%".split(', ')

  i = 1
  totals = [0]*4

  # merge_enum_by(:created_at, Sale.month, Purchase.month).each_with_index do |sale, sale_id|
  Sale.month.each_with_index do |sale, sale_id|
    sale.products.each do |product|
      i += 1
      row = [i, sale_id, sale.created_at.to_date.strftime('%a %d-%m-%Y')]

      row += case product.vat_rate
      when 9.0
        totals[0] += product.vat
        [product.vat.round(2), nil, nil, nil]
      when 13.5
        totals[1] += product.vat
        [nil, product.vat.round(2), nil, nil]
      when 23.0
        totals[2] += product.vat
        [nil, nil, product.vat.round(2),nil]
      else
        totals[3] += product.vat
        [nil, nil, nil, "#{product.name}@#{vat_rate}: #{product.vat.round(2)}"]
      end

      csv << row
    end
  end
  csv << ["TOTAL", nil, nil] + totals.map {|x| x.round 2 }
end
