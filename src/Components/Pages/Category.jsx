import React, { useContext, useMemo, useState } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Grid2X2, Heart, List, Search, ShoppingBag, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../Layout/Footer";
import { CartContext } from "../../CartContext";
import { useCurrency } from "../../CurrencyContext";
import { useWishlist } from "../../WishlistContext";
import { CATALOG, CATEGORY_NAV, toSlug } from "../../data/catalog";
import "../../Styles/Category.scss";
import "../../Styles/catalog.scss";

const HEROES = {
  "All Categories": {
    eyebrow: "THE REPA COLLECTION",
    title: <>Find your next<br /><em>favourite thing.</em></>,
    description: "Well-made tech for work, play, and all the moments in between.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1500&q=85",
    accent: "A considered edit of everyday technology.",
  },
  Accessories: {
    eyebrow: "THE LITTLE THINGS THAT DO A LOT",
    title: <>Small upgrades.<br /><em>Big difference.</em></>,
    description: "Chargers, keyboards, wearables, and the clever details that make your setup yours.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1500&q=85",
    accent: "Better details for your everyday setup.",
  },
  Smartphones: {
    eyebrow: "MADE TO MOVE WITH YOU",
    title: <>Your world,<br /><em>in your hands.</em></>,
    description: "Explore thoughtful phones with the cameras, power, and all-day battery for your life.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1500&q=85",
    accent: "Find the phone that feels like yours.",
  },
  Laptops: {
    eyebrow: "A BETTER WAY TO GET THINGS DONE",
    title: <>Meet your next<br /><em>great idea.</em></>,
    description: "From everyday essentials to creative powerhouses, find the right laptop for your pace.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1500&q=85",
    accent: "Ready for the big work and the small wins.",
  },
  Gaming: {
    eyebrow: "LEVEL UP YOUR EVERYDAY",
    title: <>More play.<br /><em>More you.</em></>,
    description: "Powerful gear and next-level experiences, picked for your kind of play.",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1500&q=85",
    accent: "Gear up. Get in the game.",
  },
  "TV & Media": {
    eyebrow: "MAKE ROOM FOR A GOOD STORY",
    title: <>Bring the big<br /><em>moments home.</em></>,
    description: "Beautiful screens and smarter entertainment for movie nights, match days, and more.",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1500&q=85",
    accent: "A little closer to the front row.",
  },
  Headphones: {
    eyebrow: "FIND YOUR OWN FREQUENCY",
    title: <>Turn it up.<br /><em>Tune it out.</em></>,
    description: "Comfortable, clear, considered audio for the commute, the calls, and your quiet time.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1500&q=85",
    accent: "A little more space for your soundtrack.",
  },
};

const readProductArray = (key) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return [];
  }
};

function ProductCard({ product, formatCurrency, onOpen, onAdd, isSaved, onWishlist }) {
  const stock = Number.isFinite(Number(product.stock)) ? Number(product.stock) : null;
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  return (
    <article className="catalog-card">
      <button type="button" className="catalog-card-image" onClick={onOpen} aria-label={`View ${product.name}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {discount > 0 && <span className="catalog-sale-badge">-{discount}%</span>}
        {product.tags?.includes("featured") && <span className="catalog-featured-badge"><Sparkles size={12} /> REPA PICK</span>}
      </button>
      <button type="button" className={`catalog-heart ${isSaved ? "saved" : ""}`} aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`} onClick={onWishlist}>
        <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
      </button>
      <div className="catalog-card-copy">
        <span className="catalog-card-category">{product.category}</span>
        <button type="button" className="catalog-card-name" onClick={onOpen}>{product.name}</button>
        <div className="catalog-stars" aria-label={`${product.rating || 5} out of 5 stars`}><span>★★★★★</span><small>{Number(product.rating || 5).toFixed(1)} · {product.reviews || 0} reviews</small></div>
        <div className="catalog-card-bottom">
          <div><strong>{formatCurrency(product.price)}</strong>{discount > 0 && <del>{formatCurrency(product.originalPrice)}</del>}</div>
          {stock !== null && <span className={stock > 0 ? "catalog-stock" : "catalog-stock out"}>{stock > 0 ? "In stock" : "Sold out"}</span>}
          <button type="button" className="catalog-quick-add" aria-label={`Add ${product.name} to cart`} disabled={stock === 0} onClick={onAdd}><ShoppingBag size={16} /></button>
        </div>
      </div>
    </article>
  );
}

export default function Category() {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryKey } = useParams();
  const { formatCurrency } = useCurrency();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isSaved } = useWishlist();
  const routeKey = `${location.key}:${categoryKey || ""}`;
  const [searchState, setSearchState] = useState(() => ({
    routeKey,
    value: String(location.state?.search || ""),
  }));
  const searchTerm = searchState.routeKey === routeKey
    ? searchState.value
    : String(location.state?.search || "");
  const setSearchTerm = (value) => setSearchState({ routeKey, value });
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [pageState, setPageState] = useState(() => ({ routeKey, value: 1 }));
  const currentPage = pageState.routeKey === routeKey ? pageState.value : 1;
  const setCurrentPage = (value) => setPageState({
    routeKey,
    value: typeof value === "function" ? value(currentPage) : value,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [addedId, setAddedId] = useState("");
  const itemsPerPage = 9;

  const categoryNames = useMemo(() => ["All Categories", ...CATEGORY_NAV.filter((item) => item.category !== "All Categories").map((item) => item.category)], []);
  const slugCategory = categoryNames.find((name) => toSlug(name) === categoryKey);
  const selectedCategory = slugCategory || (categoryNames.includes(location.state?.category) ? location.state.category : "All Categories");

  const products = useMemo(() => {
    const storeProducts = readProductArray("dashboardProducts")
      .filter((product) => Number(product.stock ?? 1) > 0)
      .map((product) => ({
        ...product,
        id: product.id || `dashboard-${product.name}`,
        name: product.name || product.title || "New product",
        image: product.image || product.images?.[0] || "/Images/lap.jpg",
        price: Number(product.price || 0),
        originalPrice: Number(product.oldPrice || product.originalPrice || product.price || 0),
        category: categoryNames.includes(product.category) ? product.category : "Accessories",
        rating: Number(product.rating || 5),
        reviews: Number(product.reviews || 0),
        sourceProductId: product.id,
        sourceSection: product.sourceSection || "Store",
      }));
    const landingProducts = readProductArray("landingPostedProducts")
      .filter((product) => Number(product.stock ?? 1) > 0)
      .map((product) => ({
        ...product,
        id: product.id || `landing-${product.name}`,
        name: product.name || product.title || "New product",
        image: product.image || product.images?.[0] || "/Images/lap.jpg",
        price: Number(product.price || 0),
        originalPrice: Number(product.oldPrice || product.originalPrice || product.price || 0),
        category: categoryNames.includes(product.category) ? product.category : "Accessories",
        rating: Number(product.rating || 5),
        reviews: Number(product.reviews || 0),
        sourceProductId: product.id,
        sourceSection: product.sourceSection || "Store",
      }));
    const storeIds = new Set(storeProducts.map((product) => String(product.id)));
    const customProducts = [...storeProducts, ...landingProducts.filter((product) => !storeIds.has(String(product.id)))];
    return [...customProducts, ...CATALOG];
  }, [categoryNames]);

  const filteredProducts = useMemo(() => {
    let results = products.filter((product) => selectedCategory === "All Categories" || product.category === selectedCategory);
    const query = searchTerm.trim().toLowerCase();
    if (query) results = results.filter((product) => `${product.name} ${product.category} ${product.brand || ""} ${product.description || ""}`.toLowerCase().includes(query));
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      results = results.filter((product) => product.price >= min && product.price < max);
    }
    return [...results].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return Number(b.rating || 0) - Number(a.rating || 0);
      if (sortBy === "newest") return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      return Number(b.reviews || 0) - Number(a.reviews || 0);
    });
  }, [products, priceRange, searchTerm, selectedCategory, sortBy]);

  const hero = HEROES[selectedCategory] || HEROES["All Categories"];
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const pageProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const addProduct = (product) => {
    addToCart({ ...product, sourceProductId: product.sourceProductId || product.id }, 1);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId((current) => current === product.id ? "" : current), 1300);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange("all");
    setSortBy("popular");
    setCurrentPage(1);
  };

  const firstResult = filteredProducts.length ? (page - 1) * itemsPerPage + 1 : 0;
  const lastResult = Math.min(page * itemsPerPage, filteredProducts.length);

  return (
    <main className="catalog-page">
      <section className="catalog-hero container">
        <div className="catalog-hero-copy">
          <span className="catalog-eyebrow"><i /> {hero.eyebrow}</span>
          <h1>{hero.title}</h1>
          <p>{hero.description}</p>
          <div className="catalog-hero-note"><Check size={16} /> Carefully selected. Ready for everyday.</div>
          <a href="#catalog-products" className="catalog-hero-link">Explore {selectedCategory === "All Categories" ? "the collection" : selectedCategory.toLowerCase()} <ArrowRight size={17} /></a>
        </div>
        <div className="catalog-hero-image">
          <img src={hero.image} alt={`${selectedCategory} collection`} fetchPriority="high" />
          <span>{hero.accent}</span>
        </div>
      </section>

      <section className="catalog-products container" id="catalog-products">
        <div className="catalog-heading">
          <div><span className="catalog-eyebrow">THE GOOD STUFF</span><h2>{selectedCategory === "All Categories" ? "Explore the collection" : selectedCategory}</h2><p>{selectedCategory === "All Categories" ? "Find something that fits the way you live." : `${hero.accent} Find the right fit for you.`}</p></div>
          <span className="catalog-result-count">{filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}</span>
        </div>

        <div className="catalog-toolbar">
          <label className="catalog-search"><Search size={17} /><input type="search" value={searchTerm} placeholder="Search products, brands..." onChange={(event) => { setSearchTerm(event.target.value); setCurrentPage(1); }} />{searchTerm && <button type="button" aria-label="Clear search" onClick={() => setSearchTerm("")}><X size={15} /></button>}</label>
          <button type="button" className={`catalog-filter-toggle ${showFilters ? "active" : ""}`} onClick={() => setShowFilters((value) => !value)}><SlidersHorizontal size={16} /> Filters</button>
          <label className={`catalog-select-wrap ${showFilters ? "show" : ""}`}><span>Price</span><select value={priceRange} onChange={(event) => { setPriceRange(event.target.value); setCurrentPage(1); }}><option value="all">Any price</option><option value="0-100">$0 – $99</option><option value="100-500">$100 – $499</option><option value="500-1000">$500 – $999</option><option value="1000-2500">$1,000 – $2,499</option><option value="2500-100000">$2,500+</option></select></label>
          <label className="catalog-select-wrap"><span>Sort</span><select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setCurrentPage(1); }}><option value="popular">Most popular</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option><option value="newest">Newest</option></select></label>
          <div className="catalog-view-toggle" aria-label="Product layout">
            <button type="button" className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} aria-label="Grid view"><Grid2X2 size={17} /></button>
            <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} aria-label="List view"><List size={18} /></button>
          </div>
        </div>
        {(searchTerm || priceRange !== "all") && <div className="catalog-active-filters"><span>Showing {firstResult}–{lastResult} of {filteredProducts.length}</span><button type="button" onClick={clearFilters}>Clear filters <X size={13} /></button></div>}

        {pageProducts.length ? (
          <div className={`catalog-grid ${viewMode}`}>
            {pageProducts.map((product) => (
              <div key={product.id} className="catalog-card-wrap">
                <ProductCard
                  product={product}
                  formatCurrency={formatCurrency}
                  onOpen={() => navigate("/product", { state: { product } })}
                  onAdd={() => addProduct(product)}
                  isSaved={isSaved(product.id)}
                  onWishlist={() => toggleWishlist(product)}
                />
                {addedId === product.id && <span className="catalog-added-message" role="status">Added to cart <Check size={13} /></span>}
              </div>
            ))}
          </div>
        ) : (
          <div className="catalog-empty"><div><Search size={22} /></div><h3>No matches this time</h3><p>Try a different search or clear the filters to see everything.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>
        )}

        {totalPages > 1 && <nav className="catalog-pagination" aria-label="Product pages"><button type="button" onClick={() => { setCurrentPage((value) => Math.max(1, value - 1)); document.getElementById("catalog-products")?.scrollIntoView({ behavior: "smooth" }); }} disabled={page === 1} aria-label="Previous page"><ChevronLeft size={18} /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => <button type="button" key={item} className={page === item ? "active" : ""} onClick={() => { setCurrentPage(item); document.getElementById("catalog-products")?.scrollIntoView({ behavior: "smooth" }); }}>{item}</button>)}<button type="button" onClick={() => { setCurrentPage((value) => Math.min(totalPages, value + 1)); document.getElementById("catalog-products")?.scrollIntoView({ behavior: "smooth" }); }} disabled={page === totalPages} aria-label="Next page"><ChevronRight size={18} /></button></nav>}
      </section>
      <Footer />
    </main>
  );
}
