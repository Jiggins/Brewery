module SalesHelper
  def day_chart(date = Date.today)
    sales = Sale.where(created_at: date .. date.tomorrow)
    sales.group_by_hour(:created_at, :sum, :total).map  do |hour, total|
      [Time.parse(hour).strftime('%H:%M'), total]
    end
  end

  # week_chart, month_chart, year_chart:
  # Generates three methods to display a mapping from time to total sales
  [:week, :month, :year].map do |time_period|
    define_method(:"#{time_period}_chart") do |date = Date.today|
      sales = Sale.where(created_at: date.send(:"beginning_of_#{time_period}") .. date.send(:"end_of_#{time_period}"))
      sales.group_by_day(:created_at, :sum, :total).map do |day, total|
        [Date.parse(day).strftime('%A %b %Y'), total]
      end
    end
  end

  # format: {name: product.name, data: }

  def product_count
    product_hash = {}
    Sale.take(100).each do |sale|
      sale.products.each do |product|
        if product_hash[product.slug]
          product_hash[product.slug] += 1
        else
          product_hash[product.slug] = 1
        end
      end
    end
  end
end
