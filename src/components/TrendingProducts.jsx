import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchAllProductsQuery } from '../redux/features/products/productsApi';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TrendingProducts = () => {
    const { data, isLoading } = useFetchAllProductsQuery({ limit: 10 });
    const products = data?.products || [];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 4,
        slidesToScroll: 1,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    if (isLoading) {
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #ed3849',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    return (
        <section style={{
            padding: '4rem 1rem',
            maxWidth: '1400px',
            margin: '0 auto',
            overflow: 'hidden'
        }}>
            <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                textAlign: 'center',
                marginBottom: '1rem',
                fontFamily: 'Playfair Display, serif',
                color: '#0f172a'
            }}>Trending Products</h2>
            
            <p style={{
                textAlign: 'center',
                color: '#64748b',
                marginBottom: '2rem',
                maxWidth: '600px',
                margin: '0 auto 2rem'
            }}>Discover our most sought-after items</p>
            
            <Slider {...settings} style={{ margin: '0 -12px' }}>
                {products.map((product) => (
                    <div key={product._id} style={{ padding: '0 12px' }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer'
                        }}>
                            <Link to={`/product/${product._id}`}>
                                <div style={{
                                    position: 'relative',
                                    paddingTop: '100%',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                    {product.discount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            background: '#ed3849',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.875rem'
                                        }}>
                                            -{product.discount}%
                                        </span>
                                    )}
                                </div>
                            </Link>
                            <div style={{ padding: '1rem' }}>
                                <Link to={`/product/${product._id}`}>
                                    <h3 style={{
                                        fontSize: '1.125rem',
                                        fontWeight: '600',
                                        marginBottom: '0.5rem',
                                        color: '#0f172a',
                                        transition: 'color 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.color = '#ed3849'}
                                    onMouseOut={(e) => e.target.style.color = '#0f172a'}>
                                        {product.name}
                                    </h3>
                                </Link>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <span style={{
                                            color: '#ed3849',
                                            fontWeight: '700',
                                            fontSize: '1.125rem'
                                        }}>
                                            ₦{product.price.toLocaleString()}
                                        </span>
                                        {product.oldPrice > 0 && (
                                            <span style={{
                                                color: '#64748b',
                                                textDecoration: 'line-through',
                                                fontSize: '0.875rem'
                                            }}>
                                                ₦{product.oldPrice.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ color: '#fbbf24' }}>
                                        {'★'.repeat(product.rating)}
                                        {'☆'.repeat(5 - product.rating)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .slick-dots li button:before {
                    color: #ed3849 !important;
                }
                
                .slick-prev:before,
                .slick-next:before {
                    color: #ed3849 !important;
                }
                
                .slick-prev,
                .slick-next {
                    z-index: 1;
                }
            `}</style>
        </section>
    );
};

export default TrendingProducts;
