import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, X, ArrowRight } from 'lucide-react';
import { useCategories, useMainProducts, useSubProducts, useProductCups, createOrder, useIngredientPrices } from '@/react-app/hooks/useApi';
import { OrderItem, Product, Cup } from '@/shared/types';
export default function OrderForm() {
  const {
    categories
  } = useCategories();
  const {
    getSugarPrice,
    getMilkPrice
  } = useIngredientPrices();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedMainProduct, setSelectedMainProduct] = useState<number | null>(null);
  const {
    products: mainProducts
  } = useMainProducts(selectedCategory || undefined);
  const {
    products: subProducts
  } = useSubProducts(selectedMainProduct);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCups, setAllCups] = useState<Cup[]>([]);

  // Load all products and cups for cart display and price calculation
  useEffect(() => {
    Promise.all([fetch('/api/products').then(res => res.json()), fetch('/api/cups').then(res => res.json())]).then(([productsData, cupsData]) => {
      setAllProducts(productsData);
      setAllCups(cupsData);
    }).catch(console.error);
  }, []);
  const addToCart = (product: Product, cupId?: number, sugarSpoons?: number, milkQuarters?: number) => {
    const existingItemIndex = cart.findIndex(item => item.product_id === product.id && item.cup_id === cupId && item.sugar_spoons === (sugarSpoons || 0) && item.milk_quarters === (milkQuarters || 0));
    if (existingItemIndex >= 0) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, {
        product_id: product.id,
        cup_id: cupId || null,
        quantity: 1,
        sugar_spoons: sugarSpoons || 0,
        milk_quarters: milkQuarters || 0
      }]);
    }
  };
  const updateCartItem = (index: number, field: keyof OrderItem, value: number) => {
    const newCart = [...cart];
    newCart[index] = {
      ...newCart[index],
      [field]: value
    };
    setCart(newCart);
  };
  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };
  const calculateItemTotal = (item: OrderItem) => {
    const product = allProducts.find(p => p.id === item.product_id);
    if (!product) return 0;
    let itemTotal = product.price;

    // Add cup cost if needed
    if (product.needs_cup && item.cup_id) {
      const cup = allCups.find(c => c.id === item.cup_id);
      if (cup) {
        itemTotal += cup.price;
      }
    }

    // Add sugar cost if allowed
    if (product.allows_sugar === 1) {
      itemTotal += item.sugar_spoons * getSugarPrice();
    }

    // Add milk cost if allowed
    if (product.allows_milk === 1) {
      itemTotal += item.milk_quarters * getMilkPrice();
    }
    return itemTotal * item.quantity;
  };
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      await createOrder({
        customer_name: customerName || undefined,
        items: cart,
        notes: notes || undefined
      });
      setOrderSuccess(true);
      setCart([]);
      setCustomerName('');
      setNotes('');
      setSelectedCategory(null);
      setSelectedMainProduct(null);
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (orderSuccess) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إنشاء الطلب بنجاح!</h2>
          <p className="text-gray-600">شكراً لك، سيتم تحضير طلبك قريباً</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
            <h1 className="text-3xl font-bold text-center">طلبات الكافتيريا</h1>
            <p className="text-center mt-2 opacity-90">ادخال الطلبات</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Name */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">بصمة الموظف </label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-right" placeholder="أدخل اسم العميل" dir="rtl" />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">القائمة الرئسية</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map(category => <button key={`category-${category.id}`} type="button" onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedMainProduct(null);
                }} className={`p-4 rounded-lg font-medium transition-all ${selectedCategory === category.id ? 'bg-amber-600 text-white shadow-lg transform scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {category.name_ar}
                    </button>)}
                </div>
              </div>

              {/* Main Products */}
              {selectedCategory && <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    المنتجات الرئيسية
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mainProducts.map(product => <button key={`main-product-${product.id}`} type="button" onClick={() => setSelectedMainProduct(product.id)} className={`p-4 rounded-lg border-2 transition-all ${selectedMainProduct === product.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>
                        <div className="text-center">
                          <div className="text-3xl mb-2">{product.icon_url}</div>
                          <h3 className="font-semibold text-gray-900">{product.name_ar}</h3>
                          <p className="text-amber-600 font-bold mt-1">{product.price.toFixed(2)} ج.م</p>
                        </div>
                      </button>)}
                  </div>
                </div>}

              {/* Sub Products */}
              {selectedMainProduct && subProducts.length > 0 && <SubProductsSection subProducts={subProducts} allCups={allCups} onAddToCart={addToCart} onBack={() => setSelectedMainProduct(null)} getSugarPrice={getSugarPrice} getMilkPrice={getMilkPrice} />}

              {/* Cart */}
              {cart.length > 0 && <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    سلة المشتريات
                  </label>
                  <div className="space-y-3">
                    {cart.map((item, index) => <CartItem key={`cart-item-${index}-product-${item.product_id}-cup-${item.cup_id || 'none'}-sugar-${item.sugar_spoons}-milk-${item.milk_quarters}`} item={item} index={index} allProducts={allProducts} allCups={allCups} onUpdateItem={updateCartItem} onRemoveItem={removeFromCart} itemTotal={calculateItemTotal(item)} getSugarPrice={getSugarPrice} getMilkPrice={getMilkPrice} />)}
                  </div>

                  <div className="mt-4 p-4 bg-amber-100 rounded-lg">
                    <div className="text-xl font-bold text-center">
                      الإجمالي: {calculateTotal().toFixed(2)} ج.م
                    </div>
                  </div>
                </div>}

              {/* Notes */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  ملاحظات إضافية
                </label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-right" rows={3} placeholder="أي ملاحظات خاصة للطلب..." dir="rtl" />
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={cart.length === 0 || isSubmitting} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {isSubmitting ? 'جاري إنشاء الطلب...' : 'إنشاء الطلب'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>;
}

// Sub Products Section Component
function SubProductsSection({
  subProducts,
  allCups,
  onAddToCart,
  onBack,
  getSugarPrice,
  getMilkPrice
}: {
  subProducts: Product[];
  allCups: Cup[];
  onAddToCart: (product: Product, cupId?: number, sugarSpoons?: number, milkQuarters?: number) => void;
  onBack: () => void;
  getSugarPrice: () => number;
  getMilkPrice: () => number;
}) {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedCup, setSelectedCup] = useState<number | null>(null);
  const [sugarSpoons, setSugarSpoons] = useState<number>(0);
  const [milkQuarters, setMilkQuarters] = useState<number>(0);
  const {
    cups
  } = useProductCups(selectedProduct || 0);
  const selectedProductData = selectedProduct ? subProducts.find(p => p.id === selectedProduct) : null;
  const getTotalPrice = () => {
    if (!selectedProductData) return 0;
    let total = selectedProductData.price;

    // Add cup cost if needed
    if (selectedCup && selectedProductData.needs_cup === 1) {
      const cup = allCups.find(c => c.id === selectedCup);
      if (cup) total += cup.price;
    }

    // Add sugar cost if allowed
    if (selectedProductData.allows_sugar === 1) {
      total += sugarSpoons * getSugarPrice();
    }

    // Add milk cost if allowed
    if (selectedProductData.allows_milk === 1) {
      total += milkQuarters * getMilkPrice();
    }
    return total;
  };
  const handleAddToCart = () => {
    if (!selectedProductData) return;
    if (selectedProductData.needs_cup === 1 && !selectedCup) {
      alert('من فضلك اختر نوع الكوب أولاً');
      return;
    }
    onAddToCart(selectedProductData, selectedCup || undefined, sugarSpoons, milkQuarters);
    setSelectedProduct(null);
    setSelectedCup(null);
    setSugarSpoons(0);
    setMilkQuarters(0);
  };
  return <div>
      <div className="flex items-center mb-3">
        <button type="button" onClick={onBack} className="flex items-center text-amber-600 hover:text-amber-700 font-medium">
          <ArrowRight className="w-4 h-4 ml-1" />
          عودة للمنتجات الرئيسية
        </button>
      </div>
      
      {/* Product Selection */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          اختر المنتج
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {subProducts.map(product => <button key={`sub-product-${product.id}`} type="button" onClick={() => {
          setSelectedProduct(product.id);
          setSelectedCup(null);
        }} className={`p-4 rounded-lg border-2 transition-all ${selectedProduct === product.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>
              <div className="text-center">
                <div className="text-3xl mb-2">{product.icon_url}</div>
                <h3 className="font-semibold text-gray-900">{product.name_ar}</h3>
                <p className="text-amber-600 font-bold mt-1">{product.price.toFixed(2)} ج.م</p>
              </div>
            </button>)}
        </div>
      </div>

      {/* Cup Selection */}
      {selectedProductData && selectedProductData.needs_cup === 1 && <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            اختر نوع الكوب
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {cups.map(cup => <button key={`product-${selectedProduct}-cup-${cup.id}`} type="button" onClick={() => setSelectedCup(cup.id)} className={`p-3 rounded-lg border-2 transition-all ${selectedCup === cup.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{cup.name_ar}</div>
                  <div className="text-amber-600 font-bold">+{cup.price.toFixed(2)} ج.م</div>
                </div>
              </button>)}
          </div>
        </div>}

      {/* Sugar and Milk Options */}
      {selectedProductData && (selectedProductData.allows_sugar === 1 || selectedProductData.allows_milk === 1) && <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            الإضافات
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sugar */}
            {selectedProductData.allows_sugar === 1 && <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السكر (معلقة - {getSugarPrice().toFixed(2)} ج.م)
                </label>
                <div className="flex items-center">
                  <button type="button" onClick={() => setSugarSpoons(Math.max(0, sugarSpoons - 1))} className="p-2 bg-gray-200 rounded-r hover:bg-gray-300 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 bg-white border-t border-b min-w-[60px] text-center font-medium">
                    {sugarSpoons}
                  </span>
                  <button type="button" onClick={() => setSugarSpoons(sugarSpoons + 1)} className="p-2 bg-gray-200 rounded-l hover:bg-gray-300 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>}

            {/* Milk */}
            {selectedProductData.allows_milk === 1 && <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللبن (ربع كوب - {getMilkPrice().toFixed(2)} ج.م)
                </label>
                <div className="flex items-center">
                  <button type="button" onClick={() => setMilkQuarters(Math.max(0, milkQuarters - 1))} className="p-2 bg-gray-200 rounded-r hover:bg-gray-300 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 bg-white border-t border-b min-w-[60px] text-center font-medium">
                    {milkQuarters}
                  </span>
                  <button type="button" onClick={() => setMilkQuarters(milkQuarters + 1)} className="p-2 bg-gray-200 rounded-l hover:bg-gray-300 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>}
          </div>
        </div>}

      {/* Price Summary and Add to Cart */}
      {selectedProductData && <div className="bg-amber-50 rounded-lg p-6 border-2 border-amber-200">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">ملخص الطلب</h3>
            <div className="space-y-1 text-gray-700">
              <div className="flex justify-between">
                <span>{selectedProductData.name_ar}</span>
                <span>{selectedProductData.price.toFixed(2)} ج.م</span>
              </div>
              {selectedCup && selectedProductData.needs_cup === 1 && <div className="flex justify-between">
                  <span>{allCups.find(c => c.id === selectedCup)?.name_ar}</span>
                  <span>+{allCups.find(c => c.id === selectedCup)?.price.toFixed(2)} ج.م</span>
                </div>}
              {selectedProductData.allows_sugar === 1 && sugarSpoons > 0 && <div className="flex justify-between">
                  <span>سكر ({sugarSpoons} معلقة)</span>
                  <span>+{(sugarSpoons * getSugarPrice()).toFixed(2)} ج.م</span>
                </div>}
              {selectedProductData.allows_milk === 1 && milkQuarters > 0 && <div className="flex justify-between">
                  <span>لبن ({milkQuarters} ربع كوب)</span>
                  <span>+{(milkQuarters * getMilkPrice()).toFixed(2)} ج.م</span>
                </div>}
              <hr className="border-amber-300" />
              <div className="flex justify-between font-bold text-lg text-amber-600">
                <span>الإجمالي</span>
                <span>{getTotalPrice().toFixed(2)} ج.م</span>
              </div>
            </div>
          </div>
          
          <button type="button" onClick={handleAddToCart} disabled={selectedProductData.needs_cup === 1 && !selectedCup} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            إضافة للسلة - {getTotalPrice().toFixed(2)} ج.م
          </button>
        </div>}
    </div>;
}

// Cart Item Component
function CartItem({
  item,
  index,
  allProducts,
  allCups,
  onUpdateItem,
  onRemoveItem,
  itemTotal,
  getSugarPrice,
  getMilkPrice
}: {
  item: OrderItem;
  index: number;
  allProducts: Product[];
  allCups: Cup[];
  onUpdateItem: (index: number, field: keyof OrderItem, value: number) => void;
  onRemoveItem: (index: number) => void;
  itemTotal: number;
  getSugarPrice: () => number;
  getMilkPrice: () => number;
}) {
  const product = allProducts.find(p => p.id === item.product_id);
  const cup = item.cup_id ? allCups.find(c => c.id === item.cup_id) : null;
  if (!product) return null;
  return <div className="bg-amber-50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <span className="text-xl ml-2">{product.icon_url}</span>
          <div>
            <h4 className="font-semibold text-gray-900">{product.name_ar}</h4>
            {cup && <p className="text-sm text-gray-600">{cup.name_ar} (+{cup.price.toFixed(2)} ج.م)</p>}
            <div className="text-xs text-gray-500 mt-1">
              السعر الأساسي: {product.price.toFixed(2)} ج.م
              {product.allows_sugar === 1 && item.sugar_spoons > 0 && <span> + سكر: {(item.sugar_spoons * getSugarPrice()).toFixed(2)} ج.م</span>}
              {product.allows_milk === 1 && item.milk_quarters > 0 && <span> + لبن: {(item.milk_quarters * getMilkPrice()).toFixed(2)} ج.م</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-amber-600 font-bold ml-2">{itemTotal.toFixed(2)} ج.م</span>
          <button type="button" onClick={() => onRemoveItem(index)} className="text-red-500 hover:text-red-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الكمية
          </label>
          <div className="flex items-center">
            <button type="button" onClick={() => onUpdateItem(index, 'quantity', Math.max(1, item.quantity - 1))} className="p-2 bg-gray-200 rounded-r hover:bg-gray-300 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 bg-white border-t border-b min-w-[60px] text-center font-medium">
              {item.quantity}
            </span>
            <button type="button" onClick={() => onUpdateItem(index, 'quantity', item.quantity + 1)} className="p-2 bg-gray-200 rounded-l hover:bg-gray-300 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sugar */}
        {product.allows_sugar === 1 && <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              السكر (معلقة - {getSugarPrice().toFixed(2)} ج.م)
            </label>
            <div className="flex items-center">
              <button type="button" onClick={() => onUpdateItem(index, 'sugar_spoons', Math.max(0, item.sugar_spoons - 1))} className="p-2 bg-gray-200 rounded-r hover:bg-gray-300 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 bg-white border-t border-b min-w-[60px] text-center font-medium">
                {item.sugar_spoons}
              </span>
              <button type="button" onClick={() => onUpdateItem(index, 'sugar_spoons', item.sugar_spoons + 1)} className="p-2 bg-gray-200 rounded-l hover:bg-gray-300 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>}

        {/* Milk */}
        {product.allows_milk === 1 && <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اللبن (ربع كوب - {getMilkPrice().toFixed(2)} ج.م)
            </label>
            <div className="flex items-center">
              <button type="button" onClick={() => onUpdateItem(index, 'milk_quarters', Math.max(0, item.milk_quarters - 1))} className="p-2 bg-gray-200 rounded-r hover:bg-gray-300 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 bg-white border-t border-b min-w-[60px] text-center font-medium">
                {item.milk_quarters}
              </span>
              <button type="button" onClick={() => onUpdateItem(index, 'milk_quarters', item.milk_quarters + 1)} className="p-2 bg-gray-200 rounded-l hover:bg-gray-300 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>}
      </div>
    </div>;
}