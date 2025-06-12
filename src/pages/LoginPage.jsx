import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {

    const serverUrl = 'https://frontend-take-home-service.fetch.com';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${serverUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, email }),
            });

            if (response.ok) {
                navigate('/dogs');
            } else {
                alert('Login failed. Check your name and email.');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert('An error occurred during login.');
        }
    };

    const styles = {
        background: {
            minHeight: '100vh',
            backgroundImage: 'url("/Background.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
        },
        card: {
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
    };

    return (
        <div style={styles.background}>
            <Container className='d-flex justify-content-center'>

                <Card className='shadow' style={styles.card}>
                    <Card.Body className='p-4'>
                        <h2 className='text-center mb-3'>Adopt a Dog</h2>
                        <p className='text-center mb-4'>Please log in to continue.</p>

                        <Form onSubmit={handleLogin}>
                            <Form.Group className='mb-3' controlId='formName'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder='Enter your name'
                                />
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='formEmail'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type='email'
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter your email'
                                />
                            </Form.Group>

                            <Button type='submit' variant='primary' className='w-100'>
                                Log In
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}
