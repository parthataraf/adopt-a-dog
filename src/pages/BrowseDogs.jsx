import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import {getBoundingBox } from '../utils/latLong.js'
import DogAdoptionContext from '../contexts/DogAdoptionContext';
import ActionBar from '../components/ActionBar';
import DogDetails from '../components/DogDetails';

export default function BrowseDogs() {
    const serverUrl = 'https://frontend-take-home-service.fetch.com';

    const [breeds, setBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [dogIds, setDogIds] = useState([]);
    const [dogs, setDogs] = useState([]);
    const [from, setFrom] = useState(0);
    const [total, setTotal] = useState(0);
    const [zipCode, setZipCode] = useState('');
    const [nearbyZipCodes, setNearbyZipCodes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [zipToCityStateMap, setZipToCityStateMap] = useState({});
    const { matchId, setMatchId } = useContext(DogAdoptionContext);

    const navigate = useNavigate();

    const pageSize = 24;
    const searchRadius = 50;

    function addRemoveFavorites(dogId) {
        if (favorites.includes(dogId)) {
            setFavorites(favorites.filter(id => id !== dogId));
        } else {
            setFavorites([...favorites, dogId]);
        }
    }

    // Fetch breeds
    useEffect(() => {
        const fetchBreeds = async () => {
            const breedResults = await fetch(`${serverUrl}/dogs/breeds`, {
                credentials: 'include',
            });
            const breedResultsJson = await breedResults.json();
            setBreeds(breedResultsJson);
        };

        fetchBreeds();
    }, []);

    // Fetch dog IDs when filters/sorting/page changes
    useEffect(() => {
        const fetchDogIds = async () => {
            const params = new URLSearchParams();
            if (selectedBreed)
                params.append('breeds', selectedBreed);

            if (nearbyZipCodes && nearbyZipCodes.length > 0) {
                for (const zipCode of nearbyZipCodes) {
                    params.append('zipCodes', zipCode);
                }
            }

            params.append('sort', `breed:${sortOrder}`);
            params.append('size', pageSize);
            params.append('from', from);

            const dogIdsResult = await fetch(`${serverUrl}/dogs/search?${params.toString()}`, {
                credentials: 'include',
            });

            const dogIdJson = await dogIdsResult.json();
            setDogIds(dogIdJson.resultIds);
            setTotal(dogIdJson.total);
        };
        fetchDogIds();

    }, [selectedBreed, nearbyZipCodes, sortOrder, from]);

    useEffect(() => {
        if (zipCode.length != 5) {
            setNearbyZipCodes([]);
            return;
        }

        const fetchNearbyZipCodes = async () => {
            const zipCodeDetailsResult = await fetch(`${serverUrl}/locations`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([zipCode])
            });

            if (zipCodeDetailsResult) {
                const zipCodeDetailsJson = await zipCodeDetailsResult.json();
                const zipCodeDetail = zipCodeDetailsJson[0];

                const boundingBox = getBoundingBox(zipCodeDetail.latitude, zipCodeDetail.longitude, searchRadius);

                const locSearchResult = await fetch(`${serverUrl}/locations/search`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        geoBoundingBox: boundingBox,
                        from: 0,
                        size: 1000
                    })
                });

                const locSearchJson = await locSearchResult.json();

                const allZipCodes = locSearchJson.results.map(res => res.zip_code);
                setNearbyZipCodes(allZipCodes);
            }
        };

        fetchNearbyZipCodes();

    }, [zipCode]);

    // Fetch dog details
    useEffect(() => {
        const fetchDogDetails = async () => {

            if (dogIds.length === 0) return;

            const dogDetailsResult = await fetch(`${serverUrl}/dogs`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dogIds),
            });
            
            const dogDetailsJson = await dogDetailsResult.json();
            setDogs(dogDetailsJson);
            
            const uniqueZips = [...new Set(dogDetailsJson.map(dog => dog.zip_code))];

            const locResult = await fetch(`${serverUrl}/locations`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(uniqueZips),
            });

            const locJson = await locResult.json();
            const zipMap = {};
            locJson.forEach(loc => {
                zipMap[loc.zip_code] = { city: loc.city, state: loc.state };
            });

            setZipToCityStateMap(zipMap);
        };
        fetchDogDetails();

    }, [dogIds]);

    // Find a match from favorites
    function findMatch() {
        const fetchMatch = async () => {
            if (favorites.length === 0) {
                alert('Please add at least one dog to your favorites before finding a match.');
                return;
            }

            const findMatchResult = await fetch(`${serverUrl}/dogs/match`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(favorites),
            });
            
            const findMatchJson = await findMatchResult.json();
            if (findMatchJson.match) {
                setMatchId(findMatchJson.match);
                navigate('/match');
            } else {
                alert('No match found. Please add more favorites and try again.');
            }
        };

        fetchMatch();
    }

    function handleLogout() {
        const logout = async () => {
            const response = await fetch(`${serverUrl}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setFavorites([]);
                setMatchId(null);
                navigate('/');
            } else {
                alert('Logout failed. Please try again.');
            }
        };

        logout();
    }

    return (
        <Container className='py-4' fluid>
            <h2>Explore and Find a Match</h2>

            <Container className='mb-4 p-3 border rounded bg-light'>
                <ActionBar
                    breeds={breeds}
                    selectedBreed={selectedBreed}
                    setSelectedBreed={setSelectedBreed}
                    zipCode={zipCode}
                    setZipCode={setZipCode}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    findMatch={findMatch}
                    handleLogout={handleLogout}
                />
            </Container>

            <Row>
                {dogs.map((dog) => (
                    <Col key={dog.id} xs={12} sm={6} md={4} lg={3} className='mb-4'>
                        <DogDetails dog={dog} isFavorite={favorites.includes(dog.id)}
                            onToggleFavorite={addRemoveFavorites} cityState={zipToCityStateMap[dog.zip_code]} />
                    </Col>
                ))}
            </Row>

            {/* Pagination */}
            <div className='d-flex justify-content-center align-items-center mt-4'>
                <Button
                    variant='secondary'
                    disabled={from === 0}
                    onClick={() => setFrom(Math.max(from - pageSize, 0))}
                >
                    Previous
                </Button>
                <span className='mx-3'>
                    Page {Math.floor(from / pageSize) + 1} of {Math.ceil(total / pageSize)}
                </span>
                <Button
                    variant='secondary'
                    disabled={from + pageSize >= total}
                    onClick={() => setFrom(from + pageSize)}
                >
                    Next
                </Button>
            </div>
        </Container>
    );
}
