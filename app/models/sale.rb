class Sale < ApplicationRecord
  has_and_belongs_to_many :products
  before_save :set_totals
  enum cash_or_credit: [:cash, :credit]
  Time.include CoreExtensions::Time

  def self.create_from_products(products)
    raise ArgumentError 'Product list should not be null' if products.nil?

    @sale = Sale.new
    @sale.products << products

    @sale.save
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
      where(created_at: time.send(:"beginning_of_#{time_period}") .. time.send(:"end_of_#{time_period}")).order(:created_at)
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

  # Returns a hash mapping product to total number sold
  def self.product_count
    product_hash = {}
    find_each do |sale|
      sale.products.find_each do |product|
        if product_hash[product.slug]
          product_hash[product.slug] += 1
        else
          product_hash[product.slug] = 1
        end
      end
    end
    product_hash
  end

  private

  def set_totals
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
