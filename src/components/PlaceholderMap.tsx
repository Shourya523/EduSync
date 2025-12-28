"use client"

import { useEffect } from "react"

interface PlaceholderMapProps {
  center?: [number, number]
  zoom?: number
}

export default function PlaceholderMap({
  center = [28.6304, 77.2177],
  zoom = 12,
}: PlaceholderMapProps) {
  useEffect(() => {
    let mounted = true

    ;(async () => {
      if (!mounted) return
      const L = await import("leaflet")
      await import("leaflet/dist/leaflet.css")

      const el = document.getElementById("carbuddy-map")
      // If a map instance was previously attached to the element, remove it first
      if (el && (el as any).__leaflet_map) {
        try {
          (el as any).__leaflet_map.remove()
        } catch (e) {
          // ignore removal errors
        }
        delete (el as any).__leaflet_map
      }

      const map = L.map("carbuddy-map", {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      }).setView(center, zoom)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

      // store instance on element for later cleanup
      if (el) (el as any).__leaflet_map = map
    })()

    return () => {
      mounted = false
      const el = document.getElementById("carbuddy-map")
      if (el && (el as any).__leaflet_map) {
        try {
          (el as any).__leaflet_map.remove()
        } catch (e) {
          /* ignore */
        }
        delete (el as any).__leaflet_map
      }
    }
  }, [center, zoom])

  return (
    <div
      id="carbuddy-map"
      style={{ width: "100%", height: "100%", borderRadius: "14px" }}
    />
  )
}
