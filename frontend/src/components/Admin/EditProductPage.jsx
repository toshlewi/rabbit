import { useState } from 'react';

const EditProductPage = () => {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: 0,
        countInStock: 0,
        sku: '',
        category: '',
        brand: '',
        sizes: [],
        color: [],
        collections: '',
        materials: '',
        gender: '',
        images: [
            {
                url: 'https://picsum.photos/150?random=1',
                alt: 'Product Image 1',
            },
            {
                url: 'https://picsum.photos/150?random=2',
                alt: 'Product Image 2',
            },
        ],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        console.log(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(productData);
        // Here you would typically make an API call to update the product in the backend.
    }



    return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6">
                Edit Product
            </h2>

            <form onSubmit={handleSubmit}>

                {/* Product Name */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">
                        Product Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">
                        Product Description
                    </label>

                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                {/* Price */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">
                        Price
                    </label>

                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                price: Number(e.target.value),
                            })
                        }
                        className="w-full border border-gray-300 rounded-md p-2"
                        min="0"
                        required
                    />
                </div>

                {/* Count In Stock */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">
                        Count In Stock
                    </label>

                    <input
                        type="number"
                        name="countInStock"
                        value={productData.countInStock}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                countInStock: Number(e.target.value),
                            })
                        }
                        className="w-full border border-gray-300 rounded-md p-2"
                        min="0"
                        required
                    />
                </div>

                {/* SKU */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">
                        SKU
                    </label>

                    <input
                        type="text"
                        name="sku"
                        value={productData.sku}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                {/* Sizes */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">
                        Sizes (comma-separated)
                    </label>

                    <input
                        type="text"
                        name="sizes"
                        value={productData.sizes.join(', ')}
                        onChange={(e) => setProductData({ ...productData, sizes: e.target.value.split(',').map((size) => size.trim()) })}
                        placeholder="S, M, L, XL"
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">
                        Colors (comma-separated)
                    </label>

                    <input
                        type="text"
                        name="color"
                        value={productData.color.join(', ')}
                        onChange={(e) => setProductData({ ...productData, color: e.target.value.split(',').map((color) => color.trim()) })}
                        placeholder="Black, White, Red"
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                {/* Images */}
                <div className=" mb-6">
                    <label className="block font-semibold mb-2">Upload Image</label>
                    <input type="file" onChange={handleImageUpload} />
                    <div className="flex gap-4 mt-4">
                        {productData.images.map((image, index) => (
                            <div key={index} className="w-24 h-24 border border-gray-300 rounded-md overflow-hidden">
                                <img src={image.url} alt={image.alt || 'Product Image'} className="w-full h-full object-cover rounded-md shadow" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-green-500 text-white w-full py-2 rounded-md hover:bg-green-600 transition-colors">
                    Update Product
                </button>


            </form>
        </div>
    );
};

export default EditProductPage;