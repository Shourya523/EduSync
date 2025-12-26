"use client";
import { useState } from "react";
import "./cafe.css";
import AuthGuard from "@/src/components/AuthGuard";
import { X, ShoppingBag } from "lucide-react"; 
import { toast } from "react-toastify"; // <--- Import Toast
import { auth } from "@/src/lib/firebase"; // <--- Import Auth

interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
}

const MENU_ITEMS: MenuItem[] = [
    { id: 1, name: "Masala Chai (Ginger)", price: 15, category: "Hot" },
    { id: 2, name: "Samosa (2 pcs)", price: 30, category: "Snacks" },
    { id: 3, name: "Paneer Pakoda", price: 80, category: "Snacks" },
    { id: 4, name: "Masala Potato Chips", price: 20, category: "Sides" },
    { id: 5, name: "Vada Pav", price: 25, category: "Snacks" },
    { id: 6, name: "Cold Coffee", price: 60, category: "Cold" },
];

export default function CafePage() {
    const [cart, setCart] = useState<{ item: MenuItem; qty: number }[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(false); // <--- Loading state

    const addToCart = (item: MenuItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.item.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { item, qty: 1 }];
        });
        setIsCartOpen(true);
    };

    const addCombo = () => {
        const chai = MENU_ITEMS[0];
        const samosa = MENU_ITEMS[1];

        setCart((prev) => {
            let newCart = [...prev];

            const addOrIncrement = (item: MenuItem) => {
                const index = newCart.findIndex((i) => i.item.id === item.id);
                if (index > -1) {
                    newCart[index] = { ...newCart[index], qty: newCart[index].qty + 1 };
                } else {
                    newCart.push({ item, qty: 1 });
                }
            };

            addOrIncrement(chai);
            addOrIncrement(samosa);
            return newCart;
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((i) => i.item.id !== id));
        if (cart.length <= 1) setIsCartOpen(false);
    };

    // <--- NEW: Checkout Function
    const handleCheckout = async () => {
        const user = auth.currentUser;
        if (!user) {
            toast.error("Please log in to order");
            return;
        }

        setLoading(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    items: cart, 
                    total: cart.reduce((acc, curr) => acc + curr.item.price * curr.qty, 0)
                }),
            });

            if (res.ok) {
                setCart([]);
                setIsCartOpen(false);
                toast.success("Order placed successfully! 🍔");
            } else {
                toast.error("Failed to place order. Try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const total = cart.reduce((acc, curr) => acc + curr.item.price * curr.qty, 0);

    return (
        <AuthGuard>
            <section className={`jcafe-container ${isCartOpen ? "is-shifted" : ""}`}>
                
                <header className="jcafe-header">
                    <div>
                        <h1>J<span>Cafe</span></h1>
                        <p>Fuelling your study sessions with premium snacks.</p>
                    </div>
                    {!isCartOpen && cart.length > 0 && (
                        <button className="cart-trigger" onClick={() => setIsCartOpen(true)}>
                            <ShoppingBag size={20} /> View Tray ({cart.length})
                        </button>
                    )}
                </header>

                <div className="jcafe-content">
                    <div className="jcafe-left-col">
                        <div className="jcafe-card jcafe-featured">
                            <span className="jcafe-badge">Student Combo</span>
                            <h3>Chai & Samosa</h3>
                            <p>The ultimate study-break fuel. Ginger Masala Chai with 2 crispy Samosas.</p>
                            <button onClick={addCombo} className="jcafe-primary-btn">
                                Quick Add — ₹45
                            </button>
                        </div>

                        <div className="jcafe-bento-grid">
                            <div className="jcafe-card">
                                <h4 className="jcafe-label">Rewards</h4>
                                <p className="jcafe-value">You have 4 stars.</p>
                                <span className="jcafe-hint">6 more for a free chai!</span>
                            </div>
                            
                            <div 
                                className="jcafe-card" 
                                style={{ cursor: "pointer" }}
                                onClick={() => addToCart(MENU_ITEMS[4])}
                            >
                                <h4 className="jcafe-label">Quick Reorder</h4>
                                <p className="jcafe-value">Vada Pav</p>
                                <span className="jcafe-hint">Tap to add again</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="jcafe-menu-card">
                        <div className="jcafe-menu-top">
                            <h3>Full Menu</h3>
                            <p>Tap items to add to tray</p>
                        </div>
                        <ul className="jcafe-list">
                            {MENU_ITEMS.map((item) => (
                                <li key={item.id} className="jcafe-list-item" onClick={() => addToCart(item)}>
                                    <div className="jcafe-item-info">
                                        <span className="jcafe-item-name">{item.name}</span>
                                        <span className="jcafe-item-tag">{item.category}</span>
                                    </div>
                                    <div className="jcafe-item-price">₹{item.price}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={`jcafe-sidebar ${isCartOpen ? "is-open" : ""}`}>
                    <div className="jcafe-sidebar-header">
                        <h3>Your Tray</h3>
                        <button className="close-btn" onClick={() => setIsCartOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="jcafe-sidebar-items">
                        {cart.length === 0 ? (
                            <p className="empty-tray">Your tray is empty.</p>
                        ) : (
                            cart.map((entry) => (
                                <div key={entry.item.id} className="jcafe-cart-row">
                                    <div className="cart-item-info">
                                        <span className="qty-badge">{entry.qty}x</span>
                                        <span>{entry.item.name}</span>
                                    </div>
                                    <div className="cart-item-right">
                                        <span>₹{entry.item.price * entry.qty}</span>
                                        <button onClick={(e) => {e.stopPropagation(); removeFromCart(entry.item.id)}} className="remove-btn">
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {cart.length > 0 && (
                        <div className="jcafe-sidebar-footer">
                            <div className="jcafe-total-row">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                            {/* <--- Updated Button with Handler and Loading State */}
                            <button 
                                className="jcafe-checkout-btn" 
                                onClick={handleCheckout}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Complete Order"}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </AuthGuard>
    );
}