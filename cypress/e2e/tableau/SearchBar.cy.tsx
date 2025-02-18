describe("Page Tableau searchBar", () => {

    beforeEach(() => {
        cy.log("Connexion à l'application")
        cy.visit("/auth/signin")
        cy.get("[data-cy=email]").type("admin@gmail.com")
        cy.get("[data-cy=password]").type("admin")
        cy.get("[data-cy=submitLogin]").click()
        cy.url().should("include", "/tableau");

    })

    it("should render Search Bar", () => {
        cy.get("[data-cy=searchComponent]").should("exist")
    });

    it("should have input for write and update the url", () => {
        cy.get("[data-cy=search]").type("test");
        cy.url().should("include", "search=test");
    });
});
