require "test_helper"

class WorkplaceTest < ActiveSupport::TestCase
  test "is valid with required attributes" do
    workplace = Workplace.new(
      user: users(:one),
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )

    assert workplace.valid?
  end

  test "requires a user" do
    workplace = Workplace.new(name: "候補A", salary: 220_000, prefecture: "東京都", city: "品川区")

    assert_not workplace.valid?
    assert_includes workplace.errors[:user], "must exist"
  end

  test "requires workplace attributes" do
    workplace = Workplace.new(user: users(:one), name: "", salary: nil, prefecture: "", city: "")

    assert_not workplace.valid?
    assert_includes workplace.errors[:name], "can't be blank"
    assert_includes workplace.errors[:salary], "can't be blank"
    assert_includes workplace.errors[:prefecture], "can't be blank"
    assert_empty workplace.errors[:city]
  end

  test "allows blank city" do
    workplace = Workplace.new(user: users(:one), name: "候補A", salary: 220_000, prefecture: "東京都", city: "")

    assert workplace.valid?
  end

  test "requires non negative salary" do
    workplace = Workplace.new(
      user: users(:one),
      name: "候補A",
      salary: -1,
      prefecture: "東京都",
      city: "品川区"
    )

    assert_not workplace.valid?
    assert_includes workplace.errors[:salary], "must be greater than or equal to 0"
  end

  test "requires salary within maximum" do
    workplace = Workplace.new(
      user: users(:one),
      name: "候補A",
      salary: Workplace::MAX_SALARY + 1,
      prefecture: "東京都",
      city: "品川区"
    )

    assert_not workplace.valid?
    assert_includes workplace.errors[:salary], "must be less than or equal to #{Workplace::MAX_SALARY}"
  end

  test "requires prefecture from prefecture list" do
    workplace = Workplace.new(
      user: users(:one),
      name: "候補A",
      salary: 220_000,
      prefecture: "不正県",
      city: "品川区"
    )

    assert_not workplace.valid?
    assert_includes workplace.errors[:prefecture], "is not included in the list"
  end
end
