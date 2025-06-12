import { Card, Button, Container, Row, Col } from 'react-bootstrap';

export default function DogDetails({ dog, isFavorite, onToggleFavorite, isMatchMode = false, cityState }) {
  return (
    <Container className='my-3'>
      <Row className='justify-content-center'>
        <Col xs={12} md={isMatchMode ? 10 : 12} lg={isMatchMode ? 8 : 12}>
          <Card className='shadow-sm'>
            <Card.Img
              variant='top'
              src={dog.img}
              alt={dog.name}
              style={{
                height: isMatchMode ? 'auto' : '300px',
                maxHeight: isMatchMode ? '60vh' : '300px',
                objectFit: 'cover',
              }}
            />
            <Card.Body>
              <Card.Title>{dog.name}</Card.Title>
              <Card.Text>🐾 <strong>Breed:</strong> {dog.breed}</Card.Text>
              <Card.Text>🎂 <strong>Age:</strong> {dog.age}</Card.Text>
              {cityState?.city && cityState?.state && (
                <Card.Text>📍 <strong>Location:</strong> {cityState.city}, {cityState.state}</Card.Text>
              )}
              <Card.Text>📍 <strong>ZIP:</strong> {dog.zip_code}</Card.Text>

              {!isMatchMode && onToggleFavorite && (
                <Button 
                    variant={isFavorite ? 'outline-danger' : 'outline-primary'} 
                    onClick={() => onToggleFavorite(dog.id)}>
                        {isFavorite ? '💔 Remove from Favorites' : '❤️ Add to Favorites'}
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
