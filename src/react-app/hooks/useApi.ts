import { useState, useEffect } from 'react';
import { Category, Product, Cup, Inventory, CreateOrder } from '@/shared/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { categories, loading, error };
}

export function useMainProducts(categoryId?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = categoryId ? `/api/main-products?category_id=${categoryId}` : '/api/main-products';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [categoryId]);

  return { products, loading, error };
}

export function useSubProducts(parentId: number | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!parentId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    fetch(`/api/sub-products/${parentId}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [parentId]);

  return { products, loading, error };
}

export function useProductCups(productId: number | null) {
  const [cups, setCups] = useState<Cup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setCups([]);
      setLoading(false);
      return;
    }

    fetch(`/api/product-cups/${productId}`)
      .then(res => res.json())
      .then(data => {
        setCups(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  return { cups, loading, error };
}

export function useProducts(categoryId?: number, parentId?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let url = '/api/products?';
    const params = [];
    if (categoryId) params.push(`category_id=${categoryId}`);
    if (parentId) params.push(`parent_id=${parentId}`);
    url += params.join('&');
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [categoryId, parentId]);

  return { products, loading, error };
}

export function useCups() {
  const [cups, setCups] = useState<Cup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cups')
      .then(res => res.json())
      .then(data => {
        setCups(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { cups, loading, error };
}

export function useInventory() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => {
        setInventory(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { inventory, loading, error };
}

export function useIngredientPrices() {
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/ingredient-prices')
      .then(res => res.json())
      .then(data => {
        setIngredients(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getSugarPrice = () => {
    const sugar = ingredients.find(item => item.item_name === 'Sugar');
    return sugar?.cost_per_unit || 1.0;
  };

  const getMilkPrice = () => {
    const milk = ingredients.find(item => item.item_name === 'Milk');
    return milk?.cost_per_unit || 5.0;
  };

  return { ingredients, loading, error, getSugarPrice, getMilkPrice };
}

export async function createOrder(orderData: CreateOrder) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error('Failed to create order');
  }

  return response.json();
}
