/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useMemo } from 'react';
import { X, Plus, Minus, ChevronRight, ShoppingBag, ChefHat } from 'lucide-react';


// --- MOCK DATA COM IMAGENS REAIS ---
const CATEGORIES = ['Hambúrgueres', 'Porções', 'Bebidas'];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'X-Bacon Supremo',
    description: 'Pão brioche artesanal, blend bovino 180g, tiras de bacon crocante, queijo prato derretido, alface americana e tomate fresco.',
    basePrice: 38.00,
    category: 'Hambúrgueres',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    availableAddons: [
      { id: 'a1', name: 'Extra Cheddar Inglês', price: 6.00 },
      { id: 'a2', name: 'Bacon em Tiras', price: 6.50 },
      { id: 'a3', name: 'Ovo Caipira Frito', price: 4.00 },
    ]
  },
  {
    id: 2,
    name: 'Smash Trufado',
    description: 'Pão tradicional tostado na manteiga, 2 smash burgers 90g, duplo queijo cheddar, maionese trufada e cebola roxa.',
    basePrice: 34.50,
    category: 'Hambúrgueres',
    imageUrl: 'https://pecadobychiqui.com/wp-content/uploads/2025/01/UMAMI-8.png',
    availableAddons: [
      { id: 'a1', name: 'Extra Cheddar', price: 5.00 },
      { id: 'a7', name: 'Maionese Trufada', price: 4.50 },
    ]
  },
  {
    id: 3,
    name: 'Fritas Rústicas com Alecrim',
    description: 'Porção de 400g de batatas rústicas cortadas à mão, temperadas com páprica defumada, sal grosso e alecrim.',
    basePrice: 24.00,
    category: 'Porções',
    imageUrl: '/images/fritas.jpeg',
    availableAddons: [
      { id: 'a4', name: 'Fonduta de Queijo', price: 8.00 },
      { id: 'a5', name: 'Farofa de Bacon', price: 6.00 },
    ]
  },
  {
    id: 4,
    name: 'Pink Lemonade',
    description: 'Limonada refrescante com xarope de frutas vermelhas e hortelã. Copo de 400ml.',
    basePrice: 12.00,
    category: 'Bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    availableAddons: [
      { id: 'a6', name: 'Extra Gelo e Hortelã', price: 0.00 },
    ]
  }
];

// --- UTILS ---
const formatMoney = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// --- WHATSAPP BUILDER FUNCTION ---
const buildWhatsAppMessage = (cart: any[], form: { name: any; address: any; payment: any; }, total: any) => {
  const phone = "5515998854634"; // Substituir pelo número do estabelecimento
  
  let text = `🍔 *NOVO PEDIDO ARTESANAL* 🍔\n`;
  text += `👤 Cliente: ${form.name}\n\n`;
  text += `🛒 *Pedido:*\n`;
  
  cart.forEach((item: { quantity: any; name: any; addons: any[]; totalPrice: any; }) => {
    let itemLine = `${item.quantity}x ${item.name}`;
    if (item.addons.length > 0) {
      const addonNames = item.addons.map((a: { name: any; }) => `+${a.name}`).join(', ');
      itemLine += ` (${addonNames})`;
    }
    itemLine += ` - ${formatMoney(item.totalPrice)}\n`;
    text += itemLine;
  });

  text += `\n💰 *Total:* ${formatMoney(total)}\n\n`;
  text += `📍 *Endereço:* ${form.address}\n`;
  text += `💳 *Pagamento:* ${form.payment}\n`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [cart, setCart] = useState<Array<{
    id: string;
    productId: number;
    name: string;
    basePrice: number;
    quantity: number;
    addons: Array<{ id: string; name: string; price: number }>;
    unitPrice: number;
    totalPrice: number;
    imageUrl: string;
  }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof MOCK_PRODUCTS[0] | null>(null);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [cart]);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (product: { basePrice: any; id: any; name: any; imageUrl: any; }, quantity: number, addons: any[]) => {
    const addonsTotal = addons.reduce((acc: any, a: { price: any; }) => acc + a.price, 0);
    const unitPrice = product.basePrice + addonsTotal;
    const totalPrice = unitPrice * quantity;

    const cartItem = {
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      basePrice: product.basePrice,
      quantity,
      addons,
      unitPrice,
      totalPrice,
      imageUrl: product.imageUrl // Salvando a imagem no carrinho para o layout novo
    };

    setCart(prev => [...prev, cartItem]);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: any) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-slate-200">
      
      {/* Header Minimalista */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
            <ChefHat size={22} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-xl leading-none tracking-tight uppercase">'Artisan</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">Burgers & Co.</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors border border-slate-200"
        >
          <ShoppingBag size={22} className="text-slate-800" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {cartItemCount}
            </span>
          )}
        </button>
      </header>

      {/* Tabs de Categoria Estilo Pill */}
      <nav className="overflow-x-auto no-scrollbar border-b border-slate-200 bg-white">
        <ul className="flex px-6 py-4 gap-4 min-w-max max-w-5xl mx-auto">
          {CATEGORIES.map(cat => (
            <li key={cat}>
              <button
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  activeCategory === cat 
                    ? 'bg-black text-white border-black shadow-md' 
                    : 'bg-white text-slate-600 border-slate-300 hover:border-black hover:text-black'
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Grid de Produtos - Layout Gourmet */}
      <main className="p-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-400 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
            >
              <div className="h-56 w-full relative overflow-hidden bg-slate-100">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-black text-xl text-slate-900 leading-tight mb-2 tracking-tight">{product.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-3 mb-6 leading-relaxed flex-1">{product.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <span className="font-bold text-slate-900 text-xl">
                    {formatMoney(product.basePrice)}
                  </span>
                  <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white text-slate-700 transition-all duration-300">
                    <Plus size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modais */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={handleAddToCart} 
        />
      )}

      {isCartOpen && (
        <CartSidebar 
          cart={cart} 
          total={cartTotal} 
          onClose={() => setIsCartOpen(false)} 
          onRemove={removeFromCart}
        />
      )}
    </div>
  );
}

// --- PRODUCT MODAL COMPONENT ---
function ProductModal({ product, onClose, onAddToCart }: { product: any; onClose: () => void; onAddToCart: (product: any, quantity: number, addons: any[]) => void }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Array<{ id: string; name: string; price: number }>>([]);

  const toggleAddon = (addon: { id: string; name: string; price: number }) => {
    const exists = selectedAddons.find(a => a.id === addon.id);
    if (exists) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  const finalPrice = (product.basePrice + addonsTotal) * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="bg-white w-full sm:w-[500px] max-h-[90vh] rounded-t-3xl sm:rounded-3xl relative flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        
        <div className="h-64 w-full relative">
          <img 
            src={product.imageUrl} 
            alt={``}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 text-slate-900 rounded-full hover:bg-white backdrop-blur-md shadow-sm transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="px-8 pt-0 pb-6 flex-1 overflow-y-auto custom-scrollbar -mt-4 relative z-10">
          <h2 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">{product.name}</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">{product.description}</p>

          {product.availableAddons && product.availableAddons.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                <h3 className="font-bold text-lg text-slate-900">Personalize seu pedido</h3>
                <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">Opcional</span>
              </div>
              
              <div className="space-y-4">
                {product.availableAddons.map((addon: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; price: any; }) => {
                  const isSelected = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <label key={addon.id} className="flex items-center justify-between group cursor-pointer p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors border-2 ${
                          isSelected ? 'bg-black border-black text-white' : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}>
                          {isSelected && <X size={14} className="rotate-45" style={{ transform: 'rotate(0deg)'}} />}
                        </div>
                        <span className="text-slate-700 font-medium group-hover:text-black transition-colors">{addon.name}</span>
                      </div>
                      <span className="text-slate-900 font-bold">+{formatMoney(addon.price)}</span>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={isSelected}
                        onChange={() => toggleAddon(addon as { id: string; name: string; price: number })}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="font-bold text-slate-900">Quantidade</span>
            <div className="flex items-center gap-5 bg-white rounded-full p-1.5 border border-slate-200 shadow-sm">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="w-4 text-center font-black text-lg text-slate-900">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
          <button 
            onClick={() => onAddToCart(product, quantity, selectedAddons)}
            className="w-full bg-black hover:bg-slate-800 text-white font-bold py-4 rounded-2xl flex items-center justify-between px-8 transition-transform active:scale-[0.98] shadow-lg shadow-black/10"
          >
            <span className="uppercase tracking-wide text-sm">Adicionar ao Pedido</span>
            <span className="text-lg">{formatMoney(finalPrice)}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// --- CART & CHECKOUT SIDEBAR COMPONENT ---
function CartSidebar({ cart, total, onClose, onRemove }: { cart: any[]; total: number; onClose: () => void; onRemove: (id: string) => void }) {
  const [step, setStep] = useState('cart');
  const [form, setForm] = useState({
    name: '',
    address: '',
    payment: 'Pix'
  });

  const handleCheckout = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    const url = buildWhatsAppMessage(cart, form, total);
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="bg-white w-full sm:w-[420px] h-full relative flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {step === 'cart' ? 'Sua Sacola' : 'Finalizar Pedido'}
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
          {step === 'cart' ? (
            <>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <ShoppingBag size={64} className="opacity-20 mb-2" strokeWidth={1} />
                  <p className="font-medium">Sua sacola está vazia.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item: { id: React.Key | null | undefined; imageUrl: string | Blob | undefined; quantity: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; addons: any[]; totalPrice: any; }) => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4 shadow-sm">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                         <img src={item.imageUrl} alt={``} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-slate-900 leading-tight">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                        {item.addons.length > 0 && (
                          <p className="text-xs text-slate-500 mb-2 leading-tight">
                            + {item.addons.map((a: { name: any; }) => a.name).join(', ')}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-2">
                           <span className="font-black text-slate-900">{formatMoney(item.totalPrice)}</span>
                           <button 
                            onClick={() => onRemove(item.id as string)}
                            className="text-xs text-slate-400 hover:text-red-500 font-bold transition-colors uppercase tracking-wider"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Subtotal</span>
                      <span>{formatMoney(total)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Taxa de entrega</span>
                      <span className="text-black font-bold">Grátis</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-black text-2xl pt-4 border-t border-slate-200">
                      <span>Total</span>
                      <span>{formatMoney(total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
               <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder-slate-400"
                  placeholder="Ex: João da Silva"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Endereço de Entrega</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none placeholder-slate-400"
                  placeholder="Rua, Número, Bairro, Complemento..."
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Pix', 'Cartão', 'Dinheiro'].map((method) => (
                    <label 
                      key={method} 
                      className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        form.payment === method 
                          ? 'bg-black border-black text-white' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value={method} 
                        className="hidden"
                        checked={form.payment === method}
                        onChange={(e) => setForm({...form, payment: e.target.value})}
                      />
                      <span className="font-bold text-sm">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="p-8 bg-white border-t border-slate-100">
          {step === 'cart' ? (
            <button 
              disabled={cart.length === 0}
              onClick={() => setStep('checkout')}
              className="w-full bg-black hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
            >
              <span className="uppercase tracking-wide text-sm">Continuar</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setStep('cart')}
                className="px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors uppercase tracking-wide text-sm"
              >
                Voltar
              </button>
              <button 
                type="submit"
                form="checkout-form"
                className="flex-1 bg-black hover:bg-slate-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-black/10 uppercase tracking-wide text-sm"
              >
                <span>Enviar Pedido</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}