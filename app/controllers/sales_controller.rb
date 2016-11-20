class SalesController < ApplicationController
  before_action :set_sale, only: [:show, :edit, :update, :destroy]
  before_action :set_date, only: [:index]
  skip_before_action :verify_authenticity_token, only: [:create]

  # GET /sales
  # GET /sales.json
  def index
  end

  def export
    start_date  = Date.parse params[:start_date]
    ending_date = Date.parse params[:end_date]
    file = Sale.export(start_date, ending_date)

    send_file file.path, filename: file.path.split('/').last, type: 'text/csv'
  end

  # GET /sales/1
  # GET /sales/1.json
  def show
    respond_to do |format|
      format.html
      format.js
      format.json
    end
  end

  # GET /sales/new
  def new
    @sale = Sale.new
  end

  # GET /sales/1/edit
  def edit
    respond_to do |format|
      format.html
      format.js
      format.json
    end
  end

  # POST /sales
  # POST /sales.json
  def create
    products = Product.find(params[:sale][:ids])
    payment_method = params[:sale][:payment_method]

    respond_to do |format|
      if @sale = Sale.create_from_products(products, payment_method)
        format.html { redirect_to @sale, notice: 'Sale was successfully created.' }
        format.json { render json: @sale.to_json, status: :ok }
      else
        format.html { render :new }
        format.json { render json: @sale.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /sales/1
  # PATCH/PUT /sales/1.json
  def update
    product_ids = params[:sale][:products].values.map(&:to_i)
    @sale.products = Product.find product_ids

    respond_to do |format|
      if @sale.update(sale_params)
        format.html { redirect_to @sale, notice: 'Sale was successfully updated.' }
        format.json { render :show, status: :ok, location: @sale }
        format.js   { render :show, status: :ok, location: @sale }
      else
        format.html { render :edit }
        format.json { render json: @sale.errors, status: :unprocessable_entity }
        format.js   { render :error, status: :unprocessable_entity, location: @sale }
      end
    end
  end

  # DELETE /sales/1
  # DELETE /sales/1.json
  def destroy
    @sale.destroy
    respond_to do |format|
      format.html { redirect_to sales_url, notice: 'Sale was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sale
      @sale = Sale.includes(:products).find(params[:id])
    end

    def set_date
      if params[:date]
        @date = DateTime.parse params[:date]
      else
        @date = DateTime.now
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def sale_params
      params.require(:sale).permit(:loyalty_card, :net_total, :payment_method, :products, :total, :vat)
    end
end

