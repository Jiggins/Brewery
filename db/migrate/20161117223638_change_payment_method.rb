class ChangePaymentMethod < ActiveRecord::Migration[5.0]
  def change
    rename_column :sales, :cash_or_credit, :payment_method
    remove_column :sales, :loyalty_card
  end
end
