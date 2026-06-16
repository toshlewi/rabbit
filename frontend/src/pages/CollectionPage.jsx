import { useState, useEffect, useRef } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';

const CollectionPage = () => {
    const [products, setProducts] = useState([]);
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (e) => {
        //clise side bar if clicked outside
        if(sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    }

    useEffect(() => {
        //Add Event Listener for clicks
        document.addEventListener("mousedown", handleClickOutside)
        //cleanr event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        setTimeout(() => {

            const fetchedProducts = [
                {
                    _id: 1,
                    name: "Product 1",
                    price: 1000,
                    images: [
                        {
                            url: "https://picsum.photos/500/500?random=3",
                            altText: "Product 1"
                        }
                    ]
                },
                {
                    _id: 2,
                    name: "Product 2",
                    price: 1000,
                    images: [
                        {
                            url: "https://picsum.photos/500/500?random=4",
                            altText: "Product 2"
                        }
                    ]
                },
                {
                    _id: 3,
                    name: "Product 3",
                    price: 1000,
                    images: [
                        {
                            url: "https://picsum.photos/500/500?random=5",
                            altText: "Product 3"
                        }
                    ]
                },
                {
                    _id: 4,
                    name: "Product 4",
                    price: 1000,
                    images: [
                        {
                            url: "https://picsum.photos/500/500?random=6",
                            altText: "Product 4"
                        }
                    ]
                },
                {
                    _id: 5,
                    name: "Product 5",
                    price: 1000,
                    images: [
                        {
                            url: "https://picsum.photos/500/500?random=7",
                            altText: "Product 1"
                        }
                    ]
                },
                {
                    _id: 6,
                    name: "Product 6",
                    price: 1000,
                    images: [
                        {
                            url: "https://picsum.photos/500/500?random=8",
                            altText: "Product 2"
                        }
                    ]
                },
                {
                    _id: 7,
                    name: "Product 7",
                    price: 1000,
                    images: [
                        {
                            url: "https://picsum.photos/500/500?random=9",
                            altText: "Product 3"
                        }
                    ]
                },
                {
                    _id: 8,
                    name: "Product 8",
                    price: 1000,
                    images: [
                        {
                            url: "https://picsum.photos/500/500?random=10",
                            altText: "Product 4"
                        }
                    ]
                }
            ];

            setProducts(fetchedProducts);

        }, 1000);

    }, []);

    return (
        <div className="flex flex-col lg:flex-row">
            {/*Mobile filter button*/}
            <button 
            onClick={toggleSidebar}
            className="lg:hidden border p-2 flex justify-center items-center">
                <FaFilter className="mr-2" />
            </button>

            {/*Filter Sidebar*/}
            <div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}> 
                <FilterSidebar />
            </div>
            <div className="flex-grow p-4">
                <h2 className="text-2xl uppercase mb-4">All Collection</h2>

                {/*sort options*/}
                <SortOptions />

                {/*Product grid*/}
                <ProductGrid products={products} />
            </div>
        </div>
    );
};

export default CollectionPage;