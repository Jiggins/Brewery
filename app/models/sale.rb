class Sale < ApplicationRecord
  has_and_belongs_to_many :products
  before_save :set_totals
  enum cash_or_credit: [:cash, :credit]

  scope :today,  -> { where(created_at: Date.today) }
  scope :week,   -> { where(created_at: 1.week.ago .. Date.today) }
  scope :month,  -> { where(created_at: 1.month.ago .. Date.today) }
  scope :year,   -> { where(created_at: 1.year.ago .. Date.today) }

  def self.create_from_products(products)
    raise ArgumentError 'Product list should not be null' if products.nil?

    @sale = Sale.new
    @sale.products << products

    @sale.save
  end

  def week_chart
    week.map do |s|
      {name: s.created_at.day, data: s.created_at}
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
