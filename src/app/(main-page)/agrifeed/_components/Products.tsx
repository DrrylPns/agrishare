import React from 'react'
import productsData, { Product } from '../../_components/dummyData/productsData'
import ProductCard from './ProductCard'

function Products() {

  return (
    <div>
      {productsData.length > 0 ? productsData.map((product) => (
        <div key={product.id} className='mb-3'>
          <ProductCard
            key={product.id}
            id={product.id}
            user={product.user}
            productImage={product.productImage}
            productName={product.productName}
            description={product.description}
            category={product.category}
            tag={product.tag}
            availableStocks={product.availableStocks}
          />
        </div>
      )) : (
        <>
        </>
      )}
    </div>
  )
}

export default Products