require 'csv'

class Sale < ApplicationRecord
  has_and_belongs_to_many :products
  before_save :set_totals
  enum payment_method: [:cash, :credit, :loyalty_card]
  include Util
  Time.include CoreExtensions::Time

  def self.create_from_products(products, payment_method)
    raise ArgumentError 'Product list should not be null' if products.nil?

    @sale = Sale.new

    @sale.products << products
    @sale.payment_method = payment_method

    @sale.save
    return @sale
  end

  def self.time_format
    {
      day: '%H:%M',
      week: '%A %d',
      month: '%b %Y',
      year: '%Y'
    }
  end

  [:hour, :day, :week, :month, :year].map do |time_period|

    # Defines methods: day, week, month, year.
    # Each method returns all sales from the beginning of the time period to the
    # end, for example; Sale.week will return all sales from Monday to Sunday
    # An optional parameter `time` can be given to return the sales for that
    # day/week/month/year.
    define_singleton_method(:"#{time_period}") do |time = Time.now|
      where(created_at: time.send(:"beginning_of_#{time_period}") .. time.send(:"end_of_#{time_period}"))
    end

    # Defines methods: group_by_day, group_by_week, group_by_month, group_by_year.
    # Each returns an Enumerator of Sale::ActiveRecord_Relation.
    define_singleton_method :"group_by_#{time_period}" do
      relation = order(:created_at)

      if relation.empty?
        return [].to_enum
      end

      time = relation.first.created_at.send :"beginning_of_#{time_period}"
      time_end = relation.last.created_at.send :"end_of_#{time_period}"

      Enumerator.new do |enum|
        while time <= time_end do
          sub_relation = where(created_at: time.send(:"beginning_of_#{time_period}") .. time.send(:"end_of_#{time_period}")).order(:created_at)
          enum << sub_relation unless sub_relation.empty?
          time = time.send :"next_#{time_period}"
        end
      end
    end

    define_singleton_method :"product_chart_#{time_period}" do
      chart_data = {}
      send(:"group_by_#{time_period}").map do |time|
        date = time.first.created_at
        time.product_count.each do |k,v|
          if chart_data[k]
            chart_data[k][date] = v
          else
            chart_data[k] = {date => v}
          end
        end
      end
      chart_data.map {|k,v| {name: k, data: v}}.to_a
    end
  end

  def self.product_count
    product_hash = {}
    names = Product.pluck(:id, :name).to_h
    ids = find_each.map(&:id)

    ProductSale.where(sale_id: ids).pluck(:product_id).find_all do |product_id|
      if product_hash[names[product_id]]
        product_hash[names[product_id]] += 1
      else
        product_hash[names[product_id]] = 1
      end
    end
    product_hash
  end

  def self.export(start_date, ending_date)
    raise ArgumentError, 'start date cannot be nil' if start_date.nil?
    raise ArgumentError, 'end date cannot be nil'   if ending_date.nil?

    CSV.open "/tmp/sales-export-#{ending_date.strftime '%Y-%m-%d'}.csv", "wb" do |csv|
      csv << "id, sale id, Date, Sales @9%, Sales @13.5%, Sales @23%, Sales@Other, Cost @9%, Cost @23%".split(', ')

      i = 1
      totals = [0]*4

      relation = where(created_at: (start_date.beginning_of_day .. ending_date.end_of_day))

      # merge_enum_by(:created_at, Sale.month, Purchase.month).each_with_index do |sale, sale_id|
      relation.find_all.each_with_index do |sale, sale_id|
        sale.products.each do |product|
          i += 1
          row = [i, sale_id, sale.created_at.to_date.strftime('%a %d-%m-%Y')]

          row += case product.vat_rate
                 when 0

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
                   [nil, nil, nil, "#{product.name}@#{product.vat_rate}: #{product.vat.round(2)}"]
                 end

          csv << row
        end
      end
      csv << ["TOTAL", nil, nil] + totals.map {|x| x.round 2 }
    end
  end

  private

  def set_totals
    if payment_method == :loyalty_card
      self.net_total = 0
      self.vat = 0
      self.total = 0
      return
    end

    total_gross = 0
    total_vat   = 0

    products.each do |product|
      total_gross += product.price
      total_vat   += product.vat
    end

    self.net_total = total_gross
    self.vat = total_vat
    self.total = total_gross - total_vat
  end
end
