describe('About Page', () => {
  beforeEach(() => {
    // Visit the About page before each test
    cy.visit('http://localhost:3000/about');
  });

  it('should contain the expected text', () => {
    // Assert that the expected text is present on the page
    const expectedText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis urna cursus eget nunc. Egestas sed tempus urna et pharetra pharetra massa massa ultricies. Neque gravida in fermentum et sollicitudin ac orci phasellus. Enim sit amet venenatis urna cursus. Turpis tincidunt id aliquet risus feugiat in ante metus. Erat nam at lectus urna duis convallis. Dapibus ultrices in iaculis nunc. Mattis aliquam faucibus purus in massa tempor nec. Arcu dictum varius duis at consectetur lorem. Quam adipiscing vitae proin sagittis nisl rhoncus. Tempor orci dapibus ultrices in iaculis nunc sed augue lacus. Gravida dictum fusce ut placerat orci. Nunc scelerisque viverra mauris in aliquam. Nibh tellus molestie nunc non blandit massa enim nec dui. Phasellus vestibulum lorem sed risus. Mauris sit amet massa vitae tortor. Maecenas ultricies mi eget mauris pharetra. In metus vulputate eu scelerisque felis.';
    
    cy.contains(expectedText).should('be.visible');
  });
});
