import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import DogAdoptionContext from '../contexts/DogAdoptionContext';
import DogDetails from '../components/DogDetails';

export function ShowMatch() {

    const serverUrl = 'https://frontend-take-home-service.fetch.com';

    const { matchId } = useContext(DogAdoptionContext);
    const [matchedDog, setMatchedDog] = useState(null);
    const [cityState, setCityState] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMatchedDog = async () => {

            if (!matchId) return;

            const dogResult = await fetch(`${serverUrl}/dogs`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([matchId])
            });
            const dogJson = await dogResult.json();
            const dog = dogJson[0];

            setMatchedDog(dog);

            const zipDetailsResult = await fetch(`${serverUrl}/locations`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([dog.zip_code])
            });

            const zipDetailsJson = await zipDetailsResult.json();
            const zipDetail = zipDetailsJson[0];
            setCityState({ city: zipDetail.city, state: zipDetail.state });
        };

        fetchMatchedDog();
    }, [matchId]);

    const styles = {
        background: {
            minHeight: '100vh',
            backgroundImage: 'url("/Background.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        contentWrapper: {
            width: '100%',
            maxWidth: '900px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '2rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
        }
    };

    return (
        <div style={styles.background}>
            <div style={styles.contentWrapper}>
                <h1 className='mb-4'>🎉 Congratulations! We found a match for you 🎉</h1>

                {matchedDog ? (
                    <div className='d-flex justify-content-center'>
                        <DogDetails dog={matchedDog} isMatchMode cityState={cityState} />
                    </div>
                ) : (
                    <p>Loading your perfect match...</p>
                )}

                <Button
                    className='mt-4'
                    variant='primary'
                    onClick={() => navigate('/dogs')}
                >
                    Return to Home
                </Button>
            </div>
        </div>
    );

}