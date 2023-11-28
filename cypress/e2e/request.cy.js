describe('Request Page', () => {
    beforeEach(() => {
      // Visit the Request page before each test
      cy.visit('http://localhost:3000/request');
    });
  
    it('should display the form and submit a request', () => {
      // Assert that the title is present
      cy.contains('Request a piece').should('be.visible');
  
      // Fill out the form
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="source"]').type('Art Center');
      cy.get('input[name="destination"]').type('Obrien');
      cy.get('.mantine-menu-trigger').click(); // Click on the menu trigger
      cy.get('.mantine-menu-item').first().click(); // Select the first item from the menu
      cy.get('textarea[name="message"]').type('Test message');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Assert that the request was submitted (customize based on your actual success criteria)
      cy.contains('Submit Request').should('not.exist'); // Assuming the button text changes after submission
      cy.contains('Request Approved').should('be.visible');
    });
  
    it('should display a message for users who need to sign in', () => {
      // Assume there is a message indicating users need to sign in
      cy.contains('Please sign in...').should('be.visible');
      cy.contains('Note: Only Faculty may request an art piece.').should('be.visible');
    });
  });
  