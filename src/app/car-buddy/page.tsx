"use client"

import { useState, useMemo } from "react"
import { MapPin, Star } from "lucide-react"
import "./car-buddy.css"
import ChatWindow from "@/src/components/ChatWindow"
import CarpoolHero from "@/src/components/CarpoolHero" // Ensure path is correct

interface Ride {
  id: string
  name: string
  destination: string
  distance: number
  price: number
  rating?: number
}

const mockRides: Ride[] = [
  { id: "1", name: "Aman Gupta", destination: "Sector 62", distance: 2.5, price: 40 },
  { id: "2", name: "Riya Sharma", destination: "Botanical Garden", distance: 8.2, price: 80 },
  { id: "3", name: "Kunal Singh", destination: "Noida Sec 15", distance: 12.0, price: 150 },
  { id: "4", name: "Priya Verma", destination: "Indirapuram", distance: 6.5, price: 60 },
  { id: "5", name: "Rahul Jain", destination: "Vaishali", distance: 9.1, price: 90 },
]

export default function CarpoolPage() {
  const [offerPrice, setOfferPrice] = useState(45)
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null)

  const ratingFromId = (id: string) => {
    let h = 0
    for (let i = 0; i < id.length; i++) {
      h = (h << 5) - h + id.charCodeAt(i)
      h |= 0
    }
    const positive = Math.abs(h)
    const scaled = (positive % 150) / 100 // 0.00 - 1.49
    return parseFloat((3.5 + scaled).toFixed(1))
  }

  const ridesWithRatings = useMemo(() => {
    return mockRides.map((r) => ({
      ...r,
      rating: ratingFromId(r.id),
    }))
  }, [])

  const nearbyRides = ridesWithRatings
    .filter((ride) => ride.distance <= 10)
    .sort((a, b) => a.distance - b.distance)

  return (
    <section className="edusync-dashboard-root">
      <header className="edusync-main-header">
        <div className="edusync-welcome-container">
          <h1>J<span>Carpool</span></h1>
          <p>Find students heading your way.</p>
        </div>
      </header>

      <div className="edusync-bento-layout">
        
        {/* FIX: Use the component directly. 
            We pass 'edusync-tile-wide' if your CSS grid needs it to span columns. */}
        <CarpoolHero 
          className="edusync-tile-wide" 
          offerPrice={offerPrice} 
          setOfferPrice={setOfferPrice} 
        />

        {/* Ride List Tile */}
        <div className="edusync-tile edusync-tile-wide edusync-tile-tall">
          <div className="edusync-list-header">
            <h3>Students Also Going Your Direction</h3>
            <p>{nearbyRides.length} active riders within 10km</p>
          </div>
          
          <div className="edusync-scroll-area">
            {nearbyRides.map((ride) => (
              <div key={ride.id} className="edusync-ride-item">
                <div className="edusync-ride-info">
                  <button 
                    className="edusync-name-trigger"
                    onClick={() => setSelectedRide(ride)}
                  >
                    {ride.name}
                  </button>
                  <div className="edusync-ride-meta">
                    <MapPin size={12} />
                    <span>{ride.destination}</span>
                    <span>• {ride.distance} km</span>
                  </div>
                  <div className="edusync-ride-rating">
                    <Star size={14} color="#d4a23a" />
                    <span>{ride.rating ?? "-"} / 5</span>
                  </div>
                </div>
                <div className="edusync-ride-actions">
                  <div className="edusync-price-badge">
                    ₹{ride.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Tiles */}
        <div className="edusync-tile edusync-stat-tile">
          <span className="edusync-tag-label">Rewards</span>
          <p className="edusync-stat-value">4.8</p>
          <p className="edusync-stat-label">Passenger Rating</p>
        </div>

        <div className="edusync-tile edusync-stat-tile">
          <span className="edusync-tag-label">History</span>
          <p className="edusync-stat-value">12</p>
          <p className="edusync-stat-label">Rides shared this month</p>
        </div>
      </div>

      {selectedRide && (
        <ChatWindow 
          recipientName={selectedRide.name}
          destination={selectedRide.destination}
          onClose={() => setSelectedRide(null)}
        />
      )}
    </section>
  )
}