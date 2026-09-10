import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100000,
  });

  const [priceRange, setPriceRange] = useState([0, 100000]);

  const categories = ["Top Wear", "Bottom Wear"];

  const colors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Black",
    "White",
    "Gray",
    "Pink",
    "Purple",
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const materials = [
    "Cotton",
    "Polyester",
    "Wool",
    "Silk",
    "Leather",
    "Denim",
    "Linen",
    "Viscose",
    "Fleece",
  ];

  const brands = [
    "Nike",
    "Adidas",
    "Puma",
    "Reebok",
    "Under Armour",
    "Decathlon",
    "H&M",
    "Zara",
    "Uniqlo",
    "Gucci",
  ];

  const genders = ["Men", "Women"];

  useEffect(() => {
    const category = searchParams.get("category") || "";
    const gender = searchParams.get("gender") || "";
    const color = searchParams.get("color") || "";

    const sizeParam = searchParams.get("size");
    const materialParam = searchParams.get("material");
    const brandParam = searchParams.get("brand");

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    const minPrice = minPriceParam
      ? Number(minPriceParam)
      : 0;

    const maxPrice = maxPriceParam
      ? Number(maxPriceParam)
      : 100000;

    const newFilters = {
      category,
      gender,
      color,
      size: sizeParam ? sizeParam.split(",") : [],
      material: materialParam
        ? materialParam.split(",")
        : [],
      brand: brandParam
        ? brandParam.split(",")
        : [],
      minPrice: Number.isNaN(minPrice) ? 0 : minPrice,
      maxPrice: Number.isNaN(maxPrice)
        ? 100000
        : maxPrice,
    };

    setFilters(newFilters);

    setPriceRange([
      newFilters.minPrice,
      newFilters.maxPrice,
    ]);
  }, [searchParams]);

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        }
        return;
      }

      if (
        value !== "" &&
        value !== null &&
        value !== undefined
      ) {
        if (
          key === "minPrice" &&
          Number(value) === 0
        ) {
          return;
        }

        if (
          key === "maxPrice" &&
          Number(value) === 100000
        ) {
          return;
        }

        params.set(key, value);
      }
    });

    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");

    if (search) {
      params.set("search", search);
    }

    if (sortBy) {
      params.set("sortBy", sortBy);
    }

    setSearchParams(params);
  };

  const handleFilterChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    const newFilters = {
      ...filters,
    };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [
          ...(newFilters[name] || []),
          value,
        ];
      } else {
        newFilters[name] = (
          newFilters[name] || []
        ).filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handlePriceChange = (e) => {
    const newPrice = Number(e.target.value);

    setPriceRange([0, newPrice]);

    const newFilters = {
      ...filters,
      minPrice: 0,
      maxPrice: newPrice,
    };

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  return (
    <div className="p-4">
      <h3 className="mb-4 text-xl font-medium text-gray-800">
        Filter
      </h3>

      {/* Category */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-600">
          Category
        </label>

        {categories.map((category) => (
          <div
            key={category}
            className="flex items-center mb-1"
          >
            <input
              type="radio"
              id={`category-${category}`}
              name="category"
              value={category}
              onChange={handleFilterChange}
              checked={filters.category === category}
              className="w-4 h-4 mr-2 text-blue-500 border-gray-300 cursor-pointer focus:ring-blue-400"
            />

            <label
              htmlFor={`category-${category}`}
              className="text-gray-700 cursor-pointer"
            >
              {category}
            </label>
          </div>
        ))}
      </div>

      {/* Gender */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-600">
          Gender
        </label>

        {genders.map((gender) => (
          <div
            key={gender}
            className="flex items-center mb-1"
          >
            <input
              type="radio"
              id={`gender-${gender}`}
              name="gender"
              value={gender}
              onChange={handleFilterChange}
              checked={filters.gender === gender}
              className="w-4 h-4 mr-2 text-blue-500 border-gray-300 cursor-pointer focus:ring-blue-400"
            />

            <label
              htmlFor={`gender-${gender}`}
              className="text-gray-700 cursor-pointer"
            >
              {gender}
            </label>
          </div>
        ))}
      </div>

      {/* Color */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-600">
          Color
        </label>

        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              name="color"
              value={color}
              onClick={handleFilterChange}
              title={color}
              aria-label={`Filter by ${color}`}
              className={`
                w-8
                h-8
                rounded-full
                border
                border-gray-300
                cursor-pointer
                transition
                hover:scale-105
                focus:outline-none
                focus:ring-2
                focus:ring-blue-400
                ${
                  filters.color === color
                    ? "ring-2 ring-blue-500"
                    : ""
                }
              `}
              style={{
                backgroundColor: color.toLowerCase(),
              }}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-600">
          Size
        </label>

        {sizes.map((size) => (
          <div
            key={size}
            className="flex items-center mb-1"
          >
            <input
              type="checkbox"
              name="size"
              value={size}
              onChange={handleFilterChange}
              checked={filters.size.includes(size)}
              className="w-4 h-4 mr-2 text-blue-500 border-gray-300 rounded cursor-pointer focus:ring-blue-400"
            />

            <label className="text-gray-700 cursor-pointer">
              {size}
            </label>
          </div>
        ))}
      </div>

      {/* Material */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-600">
          Material
        </label>

        {materials.map((material) => (
          <div
            key={material}
            className="flex items-center mb-1"
          >
            <input
              type="checkbox"
              name="material"
              value={material}
              onChange={handleFilterChange}
              checked={filters.material.includes(material)}
              className="w-4 h-4 mr-2 text-blue-500 border-gray-300 rounded cursor-pointer focus:ring-blue-400"
            />

            <label className="text-gray-700 cursor-pointer">
              {material}
            </label>
          </div>
        ))}
      </div>

      {/* Brand */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-600">
          Brand
        </label>

        {brands.map((brand) => (
          <div
            key={brand}
            className="flex items-center mb-1"
          >
            <input
              type="checkbox"
              name="brand"
              value={brand}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand)}
              className="w-4 h-4 mr-2 text-blue-500 border-gray-300 rounded cursor-pointer focus:ring-blue-400"
            />

            <label className="text-gray-700 cursor-pointer">
              {brand}
            </label>
          </div>
        ))}
      </div>

      {/* Price */}
      <div className="mb-8">
        <label className="block mb-2 font-medium text-gray-600">
          Price Range
        </label>

        <input
          type="range"
          name="priceRange"
          min={0}
          max={100000}
          step={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between mt-2 text-gray-600">
          <span>Ksh 0</span>

          <span>
            Ksh{" "}
            {Number(priceRange[1]).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;