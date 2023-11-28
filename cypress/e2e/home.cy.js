describe('Home Page', () => {
  beforeEach(() => {
    // Visit the Home page before each test
    cy.visit('http://localhost:3000');
  });

  it('should display the title and description', () => {
    // Assert that the title and description are visible on the page
    const titleText = 'A Merrimack College Museum.';
    const descriptionText = 'Welcome to the Merrimack College Art Collection – where the past meets the present, and every exhibit is a brushstroke in the masterpiece of creativity.';

    cy.contains(titleText).should('be.visible');
    cy.contains(descriptionText).should('be.visible');
  });

  it('should contain a "Browse" button that links to the gallery page', () => {
    // Assert that the "Browse" button is visible and clicking it navigates to the gallery page
    cy.contains('Browse').click();
    cy.url().should('include', '/gallery');
  });
});
