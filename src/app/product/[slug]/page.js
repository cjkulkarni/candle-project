'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { candleProducts } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { fadeUp, imageReveal, textReveal, slideIn } from '@/utils/motionVariants';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGallery from '@/components/ProductGallery';

export default function ProductPage() {
    const params = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('medium');
    const { addItem } = useCart();

    // Find product by slug
    const product = candleProducts.find(p => p.name.toLowerCase().replace(/ /g, '-') === params.slug);

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
    }

    const handleQuantityChange = (action) => {

        if (action === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = useCallback(() => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: quantity
        });
        // Reset quantity immediately after adding
        setQuantity(1);
    }, [product, selectedSize, quantity, addItem]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image Section */}
                    <motion.div
                        variants={imageReveal}
                        initial="hidden"
                        animate="visible"
                    >
                        <ProductGallery
                            images={product.images || [product.image]}
                        />
                    </motion.div>

                    {/* Product Details Section */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col space-y-6"
                    >
                        <div>
                            <motion.h1
                                variants={textReveal}
                                className="text-3xl font-semibold text-gray-900"
                            >
                                {product.name}
                            </motion.h1>
                            <motion.div
                                variants={slideIn}
                                className="mt-2 flex items-center space-x-2"
                            >
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">({product.rating} rating)</span>
                            </motion.div>
                        </div>

                        <motion.div
                            variants={fadeUp}
                            className="text-2xl font-bold text-gray-900"
                        >
                            ${product.price.toFixed(2)}
                            {product.originalPrice && (
                                <span className="ml-2 text-lg line-through text-gray-500">
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                            )}
                        </motion.div>

                        {/* Size Selection */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-900">Size</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {['small', 'medium', 'large'].map((size) => (
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
                        </div>

                        {/* Quantity Selection */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => handleQuantityChange('decrease')}
                                    className="p-2 hover:bg-gray-50"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 text-gray-900">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange('increase')}
                                    className="p-2 hover:bg-gray-50"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="flex space-x-4">
                            <Button
                                className="flex-1 gap-2"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Add to Cart
                            </Button>
                            <Button variant="outline" size="icon">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Product Information Tabs */}
                        <Tabs defaultValue="description" className="mt-8">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                            </TabsList>
                            <TabsContent value="description" className="mt-4">
                                <Card className="p-6">
                                    <p className="text-gray-600">{product.description}</p>
                                </Card>
                            </TabsContent>
                            <TabsContent value="ingredients" className="mt-4">
                                <Card className="p-6">
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        <li>Natural soy wax</li>
                                        <li>Premium fragrance oils</li>
                                        <li>Cotton wick</li>
                                        <li>Essential oils blend</li>
                                    </ul>
                                </Card>
                            </TabsContent>
                            <TabsContent value="shipping" className="mt-4">
                                <Card className="p-6">
                                    <p className="text-gray-600">
                                        Free shipping on orders over $50. Standard delivery takes 3-5 business days.
                                        Express shipping available at checkout.
                                    </p>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
