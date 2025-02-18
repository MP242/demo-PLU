describe('Signin Page', () => {
    it ('should render the signin page', () => {
        cy.visit('/auth/signin');
        cy.get('form').get('input').should('have.length', 2);
        cy.get('form').get('button').contains('Login');
    })

    it ('should signin with correct credentials and witht the role admin', () => {
        cy.visit('/auth/signin');
        cy.get('[data-cy="email"]').type('admin@gmail.com');
        cy.get('[data-cy="password"]').type('admin');
        cy.get('[data-cy="submitLogin"]').click();
        cy.url().should('include', '/tableau');
        cy.get('[data-cy="intergration"]').click();
        cy.get('[data-cy="intergration"]').should("be.visible");
    })

    it ('should signin with correct credentials and witht the role user', () => {
        cy.visit('/auth/signin');
        cy.get('[data-cy="email"]').type('sautronleo1@gmail.com');
        cy.get('[data-cy="password"]').type('toto');
        cy.get('[data-cy="submitLogin"]').click();
        cy.url().should('include', '/tableau');
        cy.get('[data-cy="intergration"]').click();
        cy.get('[data-cy="denied"]').should("be.visible");
    })

    it ('should signin with incorrect credentials', () => {
        cy.visit('/auth/signin');
        cy.get('[data-cy="email"]').type('null@gmail.com');
        cy.get('[data-cy="password"]').type('null');
        cy.get('[data-cy="submitLogin"]').click();
        cy.url().should('include', '/auth/signin');
    })
});
