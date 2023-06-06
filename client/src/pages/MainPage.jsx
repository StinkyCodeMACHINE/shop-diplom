import react, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { Link, useNavigate } from "react-router-dom";
import {
  API_URL,
  PRODUCT_ROUTE,
  PRODUCT_IMAGE_URL,
  productSortingValues,
  productLimitValues,
  BANNER_IMAGE_URL,
  SHOP_ROUTE,
  BRAND_IMAGE_URL,
  TYPE_IMAGE_URL,
} from "../utils/consts";
import {
  getBanners,
  getBrands,
  getDefaultTypeInfo,
  getFavouriteIds,
  getGroups,
  getInstances,
  getProducts,
  getTypes,
} from "../API/productAPI";
import Pagination from "../components/Shop/Pagination";
import ProductCard from "../components/Shop/ProductCard";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

export default function Shop() {
  const { product, setProduct, user, whatIsShown, setWhatIsShown } =
    useContext(Context);
  const [renderedOnce, setRenderedOnce] = useState(false);
  const [displayed, setDisplayed] = useState({
    types: [],
    brands: [],
    banners: [],
    groups: [],
  });

  const navigate = useNavigate();

  // при изменении юзера и при старте
  useEffect(() => {
    async function apiCalls() {
      const result = {};
      const groups = await getGroups();
      const types = await getTypes();
      const brands = await getBrands();
      const banners = await getBanners({ searchValue: "" });
      await setDisplayed({ types, brands, banners, groups });
      await setRenderedOnce(true);
    }

    apiCalls();
  }, [user]);

  return (
    renderedOnce && (
      <div className="main-page-container">
        {displayed.banners.length > 0 && (
          <Carousel
            onClickItem={(index, item) => item.props.onClick()}
            width={"1000px"}
            showStatus={false}
            infiniteLoop={true}
            showThumbs={false}
            autoPlay={true}
          >
            {displayed.banners.map((banner, index) => (
              <img
                onClick={async (e) => {
                  let bannerGroup;
                  const bannerType = displayed.types.find(
                    (typeElem) => typeElem.id === banner.typeId
                  );
                  if (bannerType) {
                    bannerGroup = displayed.groups.find(
                      (groupElem) => groupElem.id === bannerType.groupId
                    );
                  }

                  const bannerBrand = displayed.brands.find(
                    (brandElem) => brandElem.id === banner.brandId
                  );
                  await setProduct((oldProduct) => ({
                    ...oldProduct,
                    selectedType: bannerType ? bannerType : {},
                    selectedBrand: bannerBrand ? bannerBrand : {},
                    selectedGroup: bannerGroup ? bannerGroup : {},
                  }));
                  navigate(SHOP_ROUTE);
                }}
                className="banner-img main-page-slider-img"
                src={API_URL + BANNER_IMAGE_URL + banner.img}
              />
            ))}
          </Carousel>
        )}
        <img src="/assets/logo.png"/>
        <h2>Популярные бренды</h2>
        {displayed.brands.length > 0 && (
          <Carousel
            width={"1000px"}
            onClickItem={(item) => item.props.onClick()}
            showStatus={false}
            showThumbs={false}
            centerMode={true}
            centerSlidePercentage={33.3}
          >
            {displayed.brands.flatMap((brandElem, index) =>
              index < 10 ? (
                <div
                  onClick={async (e) => {
                    await setProduct((oldProduct) => ({
                      ...oldProduct,
                      selectedBrand: brandElem,
                      selectedGroup: {},
                      selectedType: {},
                    }));
                    navigate(SHOP_ROUTE);
                  }}
                  className="main-page-slider-things-card"
                >
                  <img
                    src={
                      brandElem.img
                        ? API_URL + BRAND_IMAGE_URL + brandElem.img
                        : "/assets/default-img.png"
                    }
                  />
                </div>
              ) : (
                []
              )
            )}
          </Carousel>
        )}
        <h2>Популярные категории</h2>
        {displayed.types.length > 0 && (
          <Carousel
            width={"1000px"}
            onClickItem={(item) => item.props.onClick()}
            showStatus={false}
            showThumbs={false}
            centerMode={true}
            centerSlidePercentage={33.3}
          >
            {displayed.types.flatMap((typeElem, index) =>
              index < 10 ? (
                <div
                  onClick={async (e) => {
                    await setProduct((oldProduct) => ({
                      ...oldProduct,
                      selectedBrand: {},
                      selectedGroup: {},
                      selectedType: typeElem,
                    }));
                    navigate(SHOP_ROUTE);
                  }}
                  className="main-page-slider-things-card"
                >
                  <img
                    className="main-page-slider-img"
                    style={{ height: "250px" }}
                    src={
                      typeElem.img
                        ? API_URL + TYPE_IMAGE_URL + typeElem.img
                        : "/assets/default-img.png"
                    }
                  />
                  <div>{typeElem.name}</div>
                </div>
              ) : (
                []
              )
            )}
          </Carousel>
        )}
      </div>
    )
  );
}
