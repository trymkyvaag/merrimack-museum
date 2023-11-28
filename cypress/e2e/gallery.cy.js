describe('Gallery Page', () => {
    beforeEach(() => {
      // Visit the Gallery page before each test
      cy.visit('http://localhost:3000/gallery');
    });
  
    it('should display the search input and perform a search', () => {
      // Assert that the search input is visible
      cy.get('input[placeholder="Search artwork"]').should('be.visible');
  
      // Type a search query and press Enter
      const searchQuery = 'Test Artwork';
      cy.get('input[placeholder="Search artwork"]').type(searchQuery).type('{enter}');
  
      // Assert that the loading message is displayed
      cy.contains('Loading...').should('be.visible');
  
      // Wait for the results to load
      cy.contains('Loading...').should('not.exist');
      cy.wait(1000); // Adjust the wait time based on your actual API response time
  
      // Assert that the search results are displayed
      cy.contains('Identifier:').should('be.visible');
      cy.contains('Title:').should('be.visible');
      cy.contains('Artist Name:').should('be.visible');
      // Add more assertions based on your actual card structure
    });
  
    it('should display the dropdown and select an option', () => {
      // Assert that the dropdown is visible
      cy.get('.mantine-select').should('be.visible');
  
      // Select an option from the dropdown
      const selectedOption = '15';
      cy.get('.mantine-select').select(selectedOption);
  
      // Assert that the loading message is displayed
      cy.contains('Loading...').should('be.visible');
  
      // Wait for the results to load
      cy.contains('Loading...').should('not.exist');
      cy.wait(1000); // Adjust the wait time based on your actual API response time
  
      // Assert that the selected number of cards is displayed
      cy.contains('Identifier:').should('be.visible').should('have.length', parseInt(selectedOption));
  
      // Optionally, you can add more assertions based on your actual card structure
    });
  
    it('should scroll to top when the button is clicked', () => {
      // Scroll down the page
      cy.scrollTo('bottom');
  
      // Assert that the "Scroll to top" button is visible
      cy.get('button:contains("Scroll to top")').should('be.visible');
  
      // Click the "Scroll to top" button
      cy.get('button:contains("Scroll to top")').click();
  
      // Wait for the scroll animation to complete
      cy.wait(1000); // Adjust the wait time based on your actual animation time
  
      // Assert that the page is scrolled to the top
      cy.window().its('scrollY').should('equal', 0);
    });
  });
  