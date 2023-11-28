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

  it('should find and assert the existence of the browse button', () => {
    // Use the ID selector to locate the button
    cy.get('#HomePageBrowseButton').should('exist');
  });
});
