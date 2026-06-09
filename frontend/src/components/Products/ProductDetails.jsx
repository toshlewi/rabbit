import { useState, useEffect } from 'react';

const selectedProduct = {
    name: "Stylish Jacket",
    price: 1000,
    originalPrice: 1500,
    description: "This is a stylish jacket perfect for any occasion",
    brand:"Gucci",
    material:"Leather",
    sizes:["S","M","L","XL"],
    colors:["Black","White","Red"],
    images: [
        {
            url:"https://picsum.photos/500/500?random=1",
            altText:"Stylish Jacket 1"
        },
        {
            url:"https://picsum.photos/500/500?random=2",
            altText:"Stylish Jacket 2"
        }
    ]
}
const ProductDetails = () => {
    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);


    useEffect(()=>{
        if (selectedProduct?.images?.length > 0){
            setMainImage(selectedProduct.images[0]?.url);
        }
        
    },[selectedProduct]);

    const handleQuantityChange = (action) => {
    if (action === "plus") {
        setQuantity(prev => prev + 1);
    } else if (action === "minus" && quantity > 1) {
        setQuantity(prev => prev - 1);
    }
};

  return (
    <div className="p-6">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
            <div className="flex flex-col md:flex-row">
                {/*Left Thumbnails*/}
                <div className="hidden md:flex flex-col space-y-4 mr-6">
                    {selectedProduct.images.map((image, index) => (
                        <img key={index} 
                        src={image.url} 
                        alt={image.altText || `Thumbnail ${index}`} 
                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? 'border-black' : 'border-gray-300'}`}
                        onClick={() => setMainImage(image.url)} />
                    ))}
                </div>
                {/*Main Image*/}
                <div className="md:w-1/2">
                    <div className="mb-4">
                        <img src={mainImage} 
                        alt="Main Product"
                        className="w-full h-auto object-cover rounded-lg" />

                    </div>
                    {/*Mobile Thumbnails*/}
                    <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
                        {selectedProduct.images.map((image, index) => (
                            <img key={index} 
                            src={image.url} 
                            alt={image.altText || `Thumbnail ${index}`} 
                            className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? 'border-black' : 'border-gray-300'}`} 
                            onClick={() => setMainImage(image.url)} />
                        ))}
                    </div>

                </div>
                <div className="md:w-1/2 md:ml-10">
                <h1 className="text-2xl font-semibold mb-2">{selectedProduct.name}</h1>
                <p className="text-gray-600 text-lg mb-4 line-through">
                    {selectedProduct.originalPrice && `ksh${selectedProduct.originalPrice}`}
                </p>
                <p className="text-xl text-gray-500 mb-2">
                    {selectedProduct.price && `ksh${selectedProduct.price}`}
                </p>
                <p className="text-gray-600 mb-4">
                    {selectedProduct.description}
                </p>
                <div className="mb-4">
                    <p className="text-gray-700">color</p>
                    <div className="flex gap-2 mt-2">
                        {selectedProduct.colors.map((color) => (
                            <button key={color} 
                            className={`w-8 h-8 rounded-full border ${selectedColor === color ? 'border-4 border-black' : 'border-gray-300'}`} 
                            style={{ backgroundColor: color.toLowerCase(), filter: 'brightness(0.8)' }}
                            onClick={() => setSelectedColor(color)}
                            disabled={isButtonDisabled}
                            ></button>
                        ))}
                    </div>

                </div>
                <div className="mb-4">
                    <p className="text-gray-700">size</p>
                    <div className="flex gap-2 mt-2">
                        {selectedProduct.sizes.map((size) => (
                            <button key={size} className={`px-4 py-2 rounded border ${selectedSize === size ? 'bg-black text-white' : 'border-gray-300'}`} onClick={() => setSelectedSize(size)}>{size}</button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-gray-700">Quantity:</p>
                    <div className="flex items-center space-x-4 gap-2">
                        <button className="px-2 py-1 bg-gray-200 text-lg rounded" onClick={() => {handleQuantityChange("minus")}}>-</button>
                        <span className="text-lg">{quantity}</span>
                        <button className="px-2 py-1 bg-gray-200 text-lg rounded" onClick={() => {handleQuantityChange("plus")}}>+</button>
                    </div>
                </div>

                <button className="bg-black text-white py-2 px-6 rounded w-full mb-4">ADD TO CART</button>

                <div className="mt-10 text-gray-700">
                    <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                    <table className="w-full text-left text-sm text-gray-600">
                        <tbody>
                            <tr>
                                <td className="py-1">Brand</td>
                                <td className="py-1">{selectedProduct.brand}</td>
                            </tr>
                            <tr>
                                <td className="py-1">Material</td>
                                <td className="py-1">{selectedProduct.material}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
            
        </div>
     
    </div>
  )
}

export default ProductDetails