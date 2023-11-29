describe('About Page', () => {
  beforeEach(() => {
    // Visit the About page before each test
    cy.visit('http://localhost:3000/about');
  });

  it('should contain the expected text', () => {
    // Assert that the expected text is present on the page
    const expectedText = 'Lorem ipsum dolor sit amet';
    
    cy.contains(expectedText).should('be.visible');
  });
});
