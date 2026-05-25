require "test_helper"

class ResidenceTest < ActiveSupport::TestCase
  test "is valid with residence attributes" do
    residence = Residence.new(
      user: users(:one),
      name: "候補A",
      rent: 80_000,
      prefecture: "東京都",
      city: "品川区"
    )

    assert residence.valid?
  end

  test "requires user" do
    residence = Residence.new(name: "候補A", rent: 80_000, prefecture: "東京都", city: "品川区")

    assert_not residence.valid?
    assert_includes residence.errors[:user], "must exist"
  end

  test "requires residence attributes" do
    residence = Residence.new(user: users(:one), name: "", rent: nil, prefecture: "", city: "")

    assert_not residence.valid?
    assert_includes residence.errors[:name], "can't be blank"
    assert_includes residence.errors[:rent], "can't be blank"
    assert_includes residence.errors[:prefecture], "can't be blank"
    assert_includes residence.errors[:city], "can't be blank"
  end

  test "requires non-negative rent" do
    residence = Residence.new(
      user: users(:one),
      name: "候補A",
      rent: -1,
      prefecture: "東京都",
      city: "品川区"
    )

    assert_not residence.valid?
    assert_includes residence.errors[:rent], "must be greater than or equal to 0"
  end
end
