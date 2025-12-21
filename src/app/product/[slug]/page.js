'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGallery from '@/components/ProductGallery';
import ProductReviews from '@/components/ProductReviews';

export default function ProductPage() {
    const { slug } = useParams();
    const { addItem } = useCart();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // ALWAYS define hooks first
    const handleAddToCart = useCallback(() => {
        if (!product) return;

        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity,
        });

        setQuantity(1);
    }, [product, selectedSize, quantity, addItem]);

    const handleReviewSubmitted = useCallback(() => {
        // Trigger product refresh by updating the key
        setRefreshKey(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (!slug) return;

        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const res = await fetch(`/api/products/${slug}`);
                const json = await res.json();

                if (!json.success || !json.data) {
                    throw new Error(json.error || 'Product not found');
                }

                // Handle nested data structure from backendService
                const products = Array.isArray(json.data.data) ? json.data.data :
                                Array.isArray(json.data) ? json.data : [json.data];

                if (products.length === 0) {
                    throw new Error('Product not found');
                }

                const p = products[0];

                // Ensure attributes is always an array
                const productAttributes = Array.isArray(p.attributes) ? p.attributes : [];

                // Extract sizes/variations from attributes
                const sizeAttribute = productAttributes.find(attr =>
                    attr.name && (
                        attr.name.toLowerCase().includes('size') ||
                        attr.name.toLowerCase().includes('variant')
                    )
                );
                const availableSizes = sizeAttribute?.terms?.map(term => term.name) ||
                                      (p.variations && p.variations.length > 0 ? ['Default'] : []);

                setProduct({
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    sku: p.sku || null,
                    category: p.categories?.[0]?.name || 'Uncategorized',
                    price: parseFloat(p.prices?.price) / 100 || 0,
                    originalPrice: p.prices?.regular_price
                        ? parseFloat(p.prices.regular_price) / 100
                        : null,
                    currencySymbol: p.prices?.currency_symbol || '$',
                    rating: parseFloat(p.average_rating) || 0,
                    reviewCount: p.review_count || 0,
                    image: p.images?.[0]?.src || '/placeholder.jpg',
                    images: p.images?.map(i => i.src) || [],
                    description:
                        p.description?.replace(/<[^>]*>/g, '') ||
                        p.short_description?.replace(/<[^>]*>/g, '') ||
                        'No description available.',
                    shortDescription: p.short_description?.replace(/<[^>]*>/g, '') || '',
                    sale: p.on_sale || false,
                    inStock: p.is_in_stock || false,
                    isPurchasable: p.is_purchasable || false,
                    stockStatus: p.stock_availability?.text || (p.is_in_stock ? 'In Stock' : 'Out of Stock'),
                    minQuantity: p.add_to_cart?.minimum || 1,
                    maxQuantity: p.add_to_cart?.maximum || 9999,
                    attributes: productAttributes,
                    tags: Array.isArray(p.tags) ? p.tags : [],
                    sizes: availableSizes,
                });

                // Set initial selectedSize if sizes are available
                if (availableSizes.length > 0) {
                    setSelectedSize(availableSizes[0]);
                }

                // Set initial quantity to minimum
                setQuantity(p.add_to_cart?.minimum || 1);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [slug, refreshKey]);

    // ONLY rendering logic below this point
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading product…
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Product not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <ProductGallery
                            images={product.images.length ? product.images : [product.image]}
                        />
                    </motion.div>

                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h1 className="text-3xl font-semibold">
                                {product.name}
                            </h1>

                            <div className="mt-2 flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 ${i < Math.floor(product.rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {product.rating > 0 ? `${product.rating} rating` : 'No ratings yet'}
                                        {product.reviewCount > 0 && ` (${product.reviewCount} reviews)`}
                                    </span>
                                </div>

                                {product.sku && (
                                    <span className="text-sm text-gray-500">
                                        SKU: <span className="font-medium">{product.sku}</span>
                                    </span>
                                )}

                                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stockStatus}
                                </span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            {product.originalPrice > product.price && (
                                <span className="text-xl line-through text-gray-500">
                                    {product.currencySymbol}{product.originalPrice.toFixed(2)}
                                </span>
                            )}
                            <span className="text-2xl font-bold">
                                {product.currencySymbol}{product.price.toFixed(2)}
                            </span>
                        </motion.div>

                        {product.sizes && product.sizes.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <h3 className="text-sm font-medium">
                                    {product.sizes.length === 1 ? 'Option' : 'Size'}
                                </h3>
                                <div className={`grid gap-4 mt-2 ${product.sizes.length > 3 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                                    {product.sizes.map(size => (
                                        <Button
                                            key={size}
                                            variant={selectedSize === size ? 'default' : 'outline'}
                                            onClick={() => setSelectedSize(size)}
                                            className="capitalize"
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        <motion.div
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <div className="flex items-center border rounded">
                                <button
                                    onClick={() => setQuantity(q => Math.max(product.minQuantity, q - 1))}
                                    disabled={quantity <= product.minQuantity}
                                    className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => Math.min(product.maxQuantity, q + 1))}
                                    disabled={quantity >= product.maxQuantity}
                                    className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <span className="text-sm text-gray-500">
                                {product.maxQuantity < 9999 ? `Max: ${product.maxQuantity}` : ''}
                            </span>
                        </motion.div>

                        <motion.div
                            className="flex gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            <Button
                                className="flex-1 gap-2"
                                onClick={handleAddToCart}
                                disabled={!product.isPurchasable || !product.inStock}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {!product.inStock ? 'Out of Stock' : 'Add to Cart'}
                            </Button>
                            <Button variant="outline" size="icon">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <Tabs defaultValue="description">
                            <TabsList className={`grid ${(product.attributes?.length > 0 || product.tags?.length > 0) ? 'grid-cols-4' : 'grid-cols-3'}`}>
                                <TabsTrigger value="description">Description</TabsTrigger>
                                {(product.attributes?.length > 0 || product.tags?.length > 0) && (
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                )}
                                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                            </TabsList>

                            <TabsContent value="description">
                                <Card className="p-6">
                                    <p className="text-gray-600 whitespace-pre-line">
                                        {product.description}
                                    </p>
                                    {product.shortDescription && product.shortDescription !== product.description && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-sm text-gray-500">
                                                {product.shortDescription}
                                            </p>
                                        </div>
                                    )}
                                </Card>
                            </TabsContent>

                            {(product.attributes?.length > 0 || product.tags?.length > 0) && (
                                <TabsContent value="details">
                                    <Card className="p-6 space-y-4">
                                        {product.attributes?.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold mb-3">Product Attributes</h4>
                                                <div className="space-y-2">
                                                    {product.attributes.map((attr, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <span className="font-medium text-gray-700">{attr.name}:</span>
                                                            <span className="text-gray-600">
                                                                {attr.terms?.map(t => t.name).join(', ') || 'N/A'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {product.tags?.length > 0 && (
                                            <div className="pt-4 border-t">
                                                <h4 className="font-semibold mb-3">Tags</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.tags?.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                </TabsContent>
                            )}

                            <TabsContent value="reviews">
                                <ProductReviews
                                    productSlug={slug}
                                    onReviewSubmitted={handleReviewSubmitted}
                                />
                            </TabsContent>

                            <TabsContent value="shipping">
                                <Card className="p-6">
                                    <div className="space-y-3 text-gray-600">
                                        <p>
                                            <span className="font-semibold">Delivery:</span> Standard shipping (3-5 business days)
                                        </p>
                                        <p>
                                            <span className="font-semibold">Free Shipping:</span> On orders over $50
                                        </p>
                                        {!product.inStock && (
                                            <p className="text-red-600 font-medium">
                                                This item is currently out of stock
                                            </p>
                                        )}
                                        {product.isPurchasable && product.inStock && (
                                            <p className="text-green-600">
                                                ✓ Available for immediate purchase
                                            </p>
                                        )}
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
