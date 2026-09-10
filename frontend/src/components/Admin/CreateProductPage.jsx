import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { createProduct } from '../../redux/slices/adminProductSlice';

const CreateProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: 0,
        countInStock: 0,
        sku: '',
        category: '',
        brand: '',
        sizes: [],
        colors: [],
        collections: '',
        material: '',
        gender: '',
        images: [],
    });

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true);

            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData
            );

            setProductData((prevData) => ({
                ...prevData,
                images: [
                    ...prevData.images,
                    { url: data.imageUrl, altText: productData.name },
                ],
            }));
        } catch (uploadError) {
            toast.error("Image upload failed");
            console.error(uploadError);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await dispatch(createProduct({
                ...productData,
                isPublished: true,
            })).unwrap();
            toast.success("Product created");
            navigate("/admin/products");
        } catch (submitError) {
            toast.error(submitError?.message || "Failed to create product");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6">
                Create Product
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Description</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Price</label>
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

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Count In Stock</label>
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

                <div className="mb-6">
                    <label className="block font-semibold mb-2">SKU</label>
                    <input
                        type="text"
                        name="sku"
                        value={productData.sku}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={productData.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Collections</label>
                    <input
                        type="text"
                        name="collections"
                        value={productData.collections}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Gender</label>
                    <select
                        name="gender"
                        value={productData.gender}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Select gender</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Brand</label>
                    <input
                        type="text"
                        name="brand"
                        value={productData.brand}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Material</label>
                    <input
                        type="text"
                        name="material"
                        value={productData.material}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
                    <input
                        type="text"
                        name="sizes"
                        value={productData.sizes.join(', ')}
                        onChange={(e) => setProductData({ ...productData, sizes: e.target.value.split(',').map((size) => size.trim()).filter(Boolean) })}
                        placeholder="S, M, L, XL"
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Colors (comma-separated)</label>
                    <input
                        type="text"
                        name="colors"
                        value={productData.colors.join(', ')}
                        onChange={(e) => setProductData({ ...productData, colors: e.target.value.split(',').map((color) => color.trim()).filter(Boolean) })}
                        placeholder="Black, White, Red"
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Upload Image</label>
                    <input type="file" onChange={handleImageUpload} />
                    {uploading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}
                    <div className="flex gap-4 mt-4">
                        {productData.images.map((image, index) => (
                            <div key={index} className="w-24 h-24 border border-gray-300 rounded-md overflow-hidden">
                                <img src={image.url} alt={image.altText || 'Product Image'} className="w-full h-full object-cover rounded-md shadow" />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-green-500 text-white w-full py-2 rounded-md hover:bg-green-600 transition-colors">
                    {saving ? "Creating..." : "Create Product"}
                </button>
            </form>
        </div>
    );
};

export default CreateProductPage;
