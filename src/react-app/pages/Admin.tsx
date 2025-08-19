import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import ImageUpload from '@/react-app/components/ImageUpload';
import { useCategories } from '@/react-app/hooks/useApi';
import { Product } from '@/shared/types';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'cups'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [mainProducts, setMainProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  const { categories } = useCategories();
  

  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    price: 0,
    category_id: '',
    parent_id: '',
    needs_cup: false,
    allows_sugar: false,
    allows_milk: false,
    icon_url: '',
    is_active: true
  });

  useEffect(() => {
    loadProducts();
    loadMainProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadMainProducts = async () => {
    try {
      const response = await fetch('/api/main-products');
      const data = await response.json();
      setMainProducts(data);
    } catch (error) {
      console.error('Error loading main products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.icon_url;
      
      // Upload image if selected
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImage);
        
        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: imageFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.url;
        }
      }

      const productData = {
        ...formData,
        price: Number(formData.price),
        category_id: Number(formData.category_id),
        parent_id: formData.parent_id ? Number(formData.parent_id) : null,
        needs_cup: formData.needs_cup ? 1 : 0,
        allows_sugar: formData.allows_sugar ? 1 : 0,
        allows_milk: formData.allows_milk ? 1 : 0,
        is_active: formData.is_active ? 1 : 0,
        icon_url: imageUrl,
      };

      const response = await fetch('/api/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct ? { ...productData, id: editingProduct.id } : productData),
      });

      if (response.ok) {
        resetForm();
        loadProducts();
        loadMainProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_ar: '',
      price: 0,
      category_id: '',
      parent_id: '',
      needs_cup: false,
      allows_sugar: false,
      allows_milk: false,
      icon_url: '',
      is_active: true
    });
    setSelectedImage(null);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      name_ar: product.name_ar,
      price: product.price,
      category_id: product.category_id.toString(),
      parent_id: product.parent_id?.toString() || '',
      needs_cup: product.needs_cup === 1,
      allows_sugar: product.allows_sugar === 1,
      allows_milk: product.allows_milk === 1,
      icon_url: product.icon_url || '',
      is_active: product.is_active === 1
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          loadProducts();
          loadMainProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">لوحة إدارة المقهى</h1>
                <p className="opacity-90 mt-1">إدارة المنتجات والفئات</p>
              </div>
              <button
                onClick={() => window.history.back()}
                className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 ml-2" />
                عودة
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b">
            {[
              { key: 'products', label: 'المنتجات' },
              { key: 'categories', label: 'الفئات' },
              { key: 'cups', label: 'الكوبايات' }
            ].map(tab => (
              <button
                key={`admin-tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-amber-50 text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-600 hover:text-amber-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'products' && (
              <div>
                {/* Add Product Button */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h2>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 ml-2" />
                    إضافة منتج جديد
                  </button>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">
                        {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                      </h3>
                      <button
                        onClick={resetForm}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الاسم بالإنجليزية
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الاسم بالعربية
                          </label>
                          <input
                            type="text"
                            value={formData.name_ar}
                            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-right"
                            dir="rtl"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            السعر (ج.م)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الفئة
                          </label>
                          <select
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            required
                          >
                            <option value="">اختر الفئة</option>
                            {categories.map(category => (
                              <option key={`admin-category-${category.id}`} value={category.id}>
                                {category.name_ar}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            المنتج الرئيسي (اختياري)
                          </label>
                          <select
                            value={formData.parent_id}
                            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="">لا يوجد (منتج رئيسي)</option>
                            {mainProducts.map(product => (
                              <option key={`admin-main-product-${product.id}`} value={product.id}>
                                {product.name_ar}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            أيقونة (نص)
                          </label>
                          <input
                            type="text"
                            value={formData.icon_url}
                            onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            placeholder="☕ 🍵 🥤"
                          />
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          صورة المنتج
                        </label>
                        <ImageUpload
                          onImageSelect={setSelectedImage}
                          currentImage={editingProduct?.image_url || undefined}
                          placeholder="اختر صورة المنتج"
                        />
                      </div>

                      {/* Checkboxes */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.needs_cup}
                            onChange={(e) => setFormData({ ...formData, needs_cup: e.target.checked })}
                            className="rounded text-amber-600 mr-2"
                          />
                          يحتاج كوب
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.allows_sugar}
                            onChange={(e) => setFormData({ ...formData, allows_sugar: e.target.checked })}
                            className="rounded text-amber-600 mr-2"
                          />
                          يقبل سكر
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.allows_milk}
                            onChange={(e) => setFormData({ ...formData, allows_milk: e.target.checked })}
                            className="rounded text-amber-600 mr-2"
                          />
                          يقبل لبن
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="rounded text-amber-600 mr-2"
                          />
                          نشط
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-5 h-5 ml-2" />
                          {editingProduct ? 'تحديث' : 'حفظ'}
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Products List */}
                <div className="bg-white rounded-lg border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          المنتج
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          السعر
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الفئة
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الحالة
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          إجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={`admin-product-${product.id}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-2xl ml-3">{product.icon_url}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name_ar}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.price} ج.م
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {categories.find(c => c.id === product.category_id)?.name_ar}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.is_active ? 'نشط' : 'غير نشط'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-amber-600 hover:text-amber-900 ml-3"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">إدارة الفئات</h2>
                <p className="text-gray-600">ستتم إضافة إدارة الفئات قريباً...</p>
              </div>
            )}

            {activeTab === 'cups' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">إدارة الكوبايات</h2>
                <p className="text-gray-600">ستتم إضافة إدارة الكوبايات قريباً...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
