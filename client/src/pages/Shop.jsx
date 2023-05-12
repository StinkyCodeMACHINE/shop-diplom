import react, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import { API_URL, PRODUCT_ROUTE, PRODUCT_IMAGE_URL } from "../utils/consts";
import { getBrands, getProducts, getTypes } from "../API/productAPI";
import Pagination from "../components/Shop/Pagination";
import ProductCard from "../components/Shop/ProductCard";

export default function Shop() {
  const { product, setProduct } = useContext(Context);

  useEffect(() => {
    getTypes().then((data) =>
      setProduct((oldProduct) => ({ ...oldProduct, types: data }))
    );
    getBrands().then((data) =>
      setProduct((oldProduct) => ({ ...oldProduct, brands: data }))
    );
  }, []);

  //изменение пагинации
  useEffect(() => {
    getProducts(
      product.selectedType.id,
      product.selectedBrand.id,
      product.page,
      3,
      product.name
    ).then((data) => {
      setProduct((oldProduct) => ({ ...oldProduct, products: data.rows }));
      setProduct((oldProduct) => ({ ...oldProduct, totalCount: data.count }));
    });
  }, [product.selectedBrand, product.selectedType, product.page, product.name]);

  useEffect(() => {
    setProduct((oldProduct) => ({ ...oldProduct, page: 1 }));
    getProducts(
      product.selectedType.id,
      product.selectedBrand.id,
      product.page,
      3,
      product.name
    ).then((data) => {
      setProduct((oldProduct) => ({ ...oldProduct, products: data.rows }));
      setProduct((oldProduct) => ({ ...oldProduct, totalCount: data.count }));
    });
  }, [product.selectedBrand, product.selectedType]);

  return (
    <div className="shop-container">
      <div className="types">
        {product.types.map((eachType) => (
          <div
            key={eachType.id}
            style={
              eachType.id === product.selectedType.id ? { color: "blue" } : {}
            }
            onClick={() =>
              product.selectedType.id === eachType.id
                ? setProduct((oldProduct) => ({
                    ...oldProduct,
                    selectedType: {},
                  }))
                : setProduct((oldProduct) => ({
                    ...oldProduct,
                    selectedType: eachType,
                  }))
            }
          >
            {eachType.name}
          </div>
        ))}
      </div>
      <div className="main-container">
        <div className="brands">
          {product.brands.map((eachBrand) => (
            <div
              key={eachBrand.id}
              style={
                eachBrand.id === product.selectedBrand.id
                  ? { color: "blue" }
                  : {}
              }
              onClick={() =>
                product.selectedBrand.id === eachBrand.id
                  ? setProduct((oldProduct) => ({
                      ...oldProduct,
                      selectedBrand: {},
                    }))
                  : setProduct((oldProduct) => ({
                      ...oldProduct,
                      selectedBrand: eachBrand,
                    }))
              }
            >
              {eachBrand.name}
            </div>
          ))}
        </div>
        <div className="product-cards">
          {product.products.map((eachProduct) => (
            <ProductCard
              key={eachProduct.id}
              id={eachProduct.id}
              typeId={eachProduct.typeId}
              brandId={eachProduct.brandId}
              img={eachProduct.img}
              rating={eachProduct.rating}
              name={eachProduct.name}
            />
          ))}
        </div>
        <Pagination />
      </div>
    </div>
  );
}
