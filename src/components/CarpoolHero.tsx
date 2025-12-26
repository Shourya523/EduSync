import React from 'react';
import { Navigation, Disc, ArrowRight } from 'lucide-react';
import "../app/car-buddy/car-buddy.css"

interface HeroProps {
  className?: string;
  offerPrice: number;
  setOfferPrice: (price: number) => void;
}

const CarpoolHero = ({ className, offerPrice, setOfferPrice }: HeroProps) => {
  return (
    // We combine the base tile class with any extra layout classes passed in (like 'wide')
    <div className={`edusync-hero-tile ${className || ''}`}>
      
      <div className="edusync-badge">Student Match</div>

      <div className="edusync-hero-inner">
        <div className="edusync-location-card">
          
          {/* THE FIX: The vertical line is now guaranteed to exist */}
          <div className="edusync-timeline-line"></div>

          <div className="edusync-loc-row">
            <label>From</label>
            <div className="edusync-input-flex">
              <div className="edusync-icon-circle">
                <Disc size={20} className="edusync-icon-orange" fill="currentColor" />
              </div>
              <input type="text" className="edusync-loc-input" defaultValue="JIIT Main Campus" />
            </div>
          </div>

          <div className="edusync-divider"></div>

          <div className="edusync-loc-row">
            <label>To</label>
            <div className="edusync-input-flex">
               <div className="edusync-icon-circle">
                <Navigation size={20} className="edusync-icon-blue" fill="currentColor" />
               </div>
              <input type="text" className="edusync-loc-input" defaultValue="Sector 62 Metro" />
            </div>
          </div>
        </div>

        <div className="edusync-action-row">
          <button className="edusync-black-btn">
            Find Ride <ArrowRight size={18} />
          </button>

          <div className="edusync-price-pill">
            <span className="edusync-currency">₹</span>
            <input 
              type="number" 
              className="edusync-price-input" 
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarpoolHero;