'use client'
import { useEffect, useRef, useState } from 'react'

const STATE_CODES = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
}

export default function USMap({ onStateSelect, selectedState }) {
  const svgRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [hoveredState, setHoveredState] = useState(null)

  useEffect(() => {
    let d3, topojson

    async function loadMap() {
      const [d3Module, topoModule] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/d3@7/+esm'),
        import('https://cdn.jsdelivr.net/npm/topojson-client@3/+esm'),
      ])
      d3 = d3Module
      topojson = topoModule

      const us = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      const features = topojson.feature(us, us.objects.states).features

      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()

      const projection = d3.geoAlbersUsa().scale(1280).translate([480, 300])
      const path = d3.geoPath(projection)

      svg.selectAll('path')
        .data(features)
        .join('path')
        .attr('d', path)
        .attr('fill', d => d.properties.name === selectedState ? '#185FA5' : '#B5D4F4')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 0.8)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          if (d.properties.name !== selectedState) {
            d3.select(this).attr('fill', '#378ADD')
          }
          setHoveredState(d.properties.name)
        })
        .on('mouseout', function(event, d) {
          if (d.properties.name !== selectedState) {
            d3.select(this).attr('fill', '#B5D4F4')
          }
          setHoveredState(null)
        })
        .on('click', function(event, d) {
          svg.selectAll('path').attr('fill', '#B5D4F4')
          d3.select(this).attr('fill', '#185FA5')
          const stateCode = STATE_CODES[d.properties.name] || ''
          onStateSelect({ name: d.properties.name, code: stateCode })
        })

      setLoaded(true)
    }

    loadMap()
  }, [])

  useEffect(() => {
    if (!svgRef.current || !loaded) return
    const paths = svgRef.current.querySelectorAll('path')
    paths.forEach(p => {
      const name = p.__data__?.properties?.name
      if (name) {
        p.setAttribute('fill', name === selectedState ? '#185FA5' : '#B5D4F4')
      }
    })
  }, [selectedState, loaded])

  return (
    <div className="relative w-full">
      {!loaded && (
        <div className="flex items-center justify-center h-64 text-sm text-gray-400">
          Loading map...
        </div>
      )}
      <svg
        ref={svgRef}
        viewBox="0 0 960 600"
        className="w-full"
        style={{ display: loaded ? 'block' : 'none' }}
        aria-label="Interactive US map — click a state to see its representatives"
      />
      {hoveredState && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs bg-revela-navy text-white px-3 py-1 rounded-full pointer-events-none">
          {hoveredState}
        </div>
      )}
    </div>
  )
}
