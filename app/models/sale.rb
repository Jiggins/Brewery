class Sale < ApplicationRecord
  has_and_belongs_to_many :products
  before_save :set_totals
  enum cash_or_credit: [:cash, :credit]

  def self.create_from_products(products)
    raise ArgumentError 'Product list should not be null' if products.nil?

    @sale = Sale.new
    @sale.products << products

    @sale.save
  end

  [:day, :week, :month, :year].map do |time_period|
    method = define_singleton_method(:"#{time_period}") do |time = Time.now|
      where(created_at: time.send(:"beginning_of_#{time_period}") .. time.send(:"end_of_#{time_period}"))
    end
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
