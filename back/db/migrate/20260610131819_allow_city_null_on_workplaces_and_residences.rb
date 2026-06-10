class AllowCityNullOnWorkplacesAndResidences < ActiveRecord::Migration[8.1]
  def change
    change_column_null :workplaces, :city, true
    change_column_null :residences, :city, true
  end
end
