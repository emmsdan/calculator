import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import '@/App.css'

const airportData = {
  "DNAA": { name: "Nnamdi Azikiwe International Airport, Abuja", lat: 9.0065, lon: 7.2631 },
  "DNMM": { name: "Murtala Muhammed International Airport, Lagos", lat: 6.5774, lon: 3.3214 },
  "KJFK": { name: "John F. Kennedy International Airport, New York", lat: 40.6413, lon: -73.7781 },
  "EGLL": { name: "London Heathrow Airport", lat: 51.4700, lon: -0.4543 },
  "OMDB": { name: "Dubai International Airport", lat: 25.2532, lon: 55.3657 },
  "ZBAA": { name: "Beijing Capital International Airport", lat: 40.0799, lon: 116.6031 },
  "RJTT": { name: "Tokyo Haneda Airport", lat: 35.5533, lon: 139.7811 },
};

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const inputStyle = "w-full p-2 mb-4 border rounded bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-400";
const buttonStyle = "w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300";

export default function AviationEmissionsCalculator() {
  const [aircraftRegistration, setAircraftRegistration] = useState('');
  const [aircraftType, setAircraftType] = useState('');
  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [isReturnFlight, setIsReturnFlight] = useState(false);
  const [fuelUsed, setFuelUsed] = useState('');
  const [fuelCapacity, setFuelCapacity] = useState('');
  const [totalPassengers, setTotalPassengers] = useState('');
  const [cargo, setCargo] = useState('');
  const [flightLevel, setFlightLevel] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('normal');
  const [distance, setDistance] = useState<null | number>(null);
  const [carbonEmissions, setCarbonEmissions] = useState<null | number>(null);
  const [error, setError] = useState<null | string>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (departureAirport && arrivalAirport) {
      const depAirport = airportData[departureAirport];
      const arrAirport = airportData[arrivalAirport];
      if (depAirport && arrAirport) {
        const calculatedDistance = haversine(depAirport.lat, depAirport.lon, arrAirport.lat, arrAirport.lon);
        setDistance(isReturnFlight ? calculatedDistance * 2 : calculatedDistance);
      }
    }
  }, [departureAirport, arrivalAirport, isReturnFlight]);

  const calculateEmissions = () => {
    if (!aircraftRegistration || !aircraftType || !departureAirport || !arrivalAirport || !fuelUsed || !fuelCapacity || !flightLevel || !totalPassengers) {
      setError('Please fill in all required fields');
      setShowResults(false);
      return;
    }

    if (Number(fuelUsed) > Number(fuelCapacity)) {
      setError('Fuel used cannot exceed fuel capacity');
      setShowResults(false);
      return;
    }

    let calculatedEmissions = Number(fuelUsed) * 3.16; // Base calculation
    
    // Apply corrections based on flight level
    const flightLevelFactor = 1 - (Number(flightLevel) / 100000);
    calculatedEmissions *= flightLevelFactor;

    // Apply weather condition factor
    const weatherFactor = weatherCondition === 'adverse' ? 1.1 : 1;
    calculatedEmissions *= weatherFactor;

    // Double emissions for return flight
    if (isReturnFlight) {
      calculatedEmissions *= 2;
    }

    setCarbonEmissions(Number(calculatedEmissions.toFixed(2)));
    setError(null);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
            Aviation Carbon Emissions Calculator
          </h1>
          <form onSubmit={(e) => { e.preventDefault(); calculateEmissions(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className={inputStyle}
                type="text"
                placeholder="Aircraft Registration"
                value={aircraftRegistration}
                onChange={(e) => setAircraftRegistration(e.target.value)}
                required
              />
              <input
                className={inputStyle}
                type="text"
                placeholder="Aircraft Type"
                value={aircraftType}
                onChange={(e) => setAircraftType(e.target.value)}
                required
              />
              <input
                className={inputStyle}
                type="number"
                placeholder="Fuel Capacity (kg)"
                value={fuelCapacity}
                onChange={(e) => setFuelCapacity(e.target.value)}
                required
              />
              <select
                className={inputStyle}
                value={departureAirport}
                onChange={(e) => setDepartureAirport(e.target.value)}
                required
              >
                <option value="">Select Departure Airport</option>
                {Object.entries(airportData).map(([code, { name }]) => (
                  <option key={code} value={code}>{code} - {name}</option>
                ))}
              </select>
              <select
                className={inputStyle}
                value={arrivalAirport}
                onChange={(e) => setArrivalAirport(e.target.value)}
                required
              >
                <option value="">Select Arrival Airport</option>
                {Object.entries(airportData).map(([code, { name }]) => (
                  <option key={code} value={code}>{code} - {name}</option>
                ))}
              </select>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="returnFlight"
                  checked={isReturnFlight}
                  onChange={(e) => setIsReturnFlight(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="returnFlight">Return Flight</label>
              </div>
              <input
                className={inputStyle}
                type="number"
                placeholder="Fuel Used (kg)"
                value={fuelUsed}
                onChange={(e) => setFuelUsed(e.target.value)}
                required
              />
              <input
                className={inputStyle}
                type="number"
                placeholder="Total Passengers"
                value={totalPassengers}
                onChange={(e) => setTotalPassengers(e.target.value)}
                required
              />
              <input
                className={inputStyle}
                type="number"
                placeholder="Cargo Weight (kg)"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                required
              />
              <input
                className={inputStyle}
                type="number"
                placeholder="Flight Level (e.g., 350 for FL350)"
                value={flightLevel}
                onChange={(e) => setFlightLevel(e.target.value)}
                required
              />
              <select
                className={inputStyle}
                value={weatherCondition}
                onChange={(e) => setWeatherCondition(e.target.value)}
              >
                <option value="normal">Normal Weather</option>
                <option value="adverse">Adverse Weather</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${inputStyle} bg-gray-100`}>
                <label className="block text-sm font-medium text-gray-700">Distance Travelled</label>
                <p className="mt-1 text-lg font-semibold">{distance ? `${distance.toFixed(2)} km` : 'N/A'}</p>
              </div>
              <div className={`${inputStyle} bg-gray-100`}>
                <label className="block text-sm font-medium text-gray-700">Estimated Carbon Emissions</label>
                <p className="mt-1 text-lg font-semibold">{carbonEmissions ? `${carbonEmissions} kg CO2` : 'N/A'}</p>
              </div>
            </div>

            <Button type="submit" className={buttonStyle}>
              Calculate Emissions
            </Button>
          </form>

          {error && (
            <Alert className="mt-6" variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showResults && (
            <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Emissions Calculation Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-100 rounded">
                  <h3 className="text-lg font-semibold mb-2">Total CO2 Emissions</h3>
                  <p className="text-3xl font-bold text-blue-600">{carbonEmissions} kg CO2</p>
                </div>
                <div className="p-4 bg-green-100 rounded">
                  <h3 className="text-lg font-semibold mb-2">Distance Travelled</h3>
                  <p className="text-3xl font-bold text-green-600">{distance.toFixed(2)} km</p>
                </div>
                <div className="p-4 bg-yellow-100 rounded">
                  <h3 className="text-lg font-semibold mb-2">Emissions per Passenger</h3>
                  <p className="text-3xl font-bold text-yellow-600">
                    {(carbonEmissions / Number(totalPassengers)).toFixed(2)} kg CO2/passenger
                  </p>
                </div>
                <div className="p-4 bg-purple-100 rounded">
                  <h3 className="text-lg font-semibold mb-2">Emissions per km</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {(carbonEmissions / distance).toFixed(2)} kg CO2/km
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
