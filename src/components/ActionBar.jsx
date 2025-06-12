import { Container, Row, Col, Form, Button } from 'react-bootstrap';

export default function ActionBar({
  breeds,
  selectedBreed,
  setSelectedBreed,
  zipCode,
  setZipCode,
  sortOrder,
  setSortOrder,
  findMatch,
  handleLogout,
}) {
  return (
    <Container className='mb-4 p-3 border rounded bg-light'>
      <Form>
        <Row className='g-3 align-items-end'>
          <Col xs={12} md={3}>
            <Form.Group controlId='breedSelect'>
              <Form.Label>Breed</Form.Label>
              <Form.Select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
                <option value=''>All Breeds</option>
                {breeds.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12} md={2}>
            <Form.Group controlId='zipInput'>
              <Form.Label>ZIP Code</Form.Label>
              <Form.Control
                type='text'
                value={zipCode}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d{0,5}$/.test(input)) {
                    setZipCode(input);
                  }
                }}
                placeholder='Enter 5-digit ZIP'
              />
            </Form.Group>
          </Col>

          <Col xs={12} md={2}>
            <Form.Group controlId='sortSelect'>
              <Form.Label>Sort by Breed</Form.Label>
              <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value='asc'>A → Z</option>
                <option value='desc'>Z → A</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={6} md={2}>
            <Button variant='primary' className='w-100' onClick={findMatch}>
              ❤️ Find My Match
            </Button>
          </Col>

          <Col xs={6} md={2} className='text-end'>
            <Button variant='outline-secondary' className='w-100' onClick={handleLogout}>
              Logout
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
