describe("Page Tableau", () => {

    beforeEach(() => {
        cy.log("Connexion à l'application")
        cy.visit("/auth/signin")
        cy.get("[data-cy=email]").type("admin@gmail.com")
        cy.get("[data-cy=password]").type("admin")
        cy.get("[data-cy=submitLogin]").click()
        cy.url().should("include", "/tableau");

    })

    it("should render the tableau page", () => {
        cy.get("[data-cy=tableau]").should("exist")
    });

    it("should sort the table by button in the header in order asc", () => {
        cy.get("[data-cy=sort-Nom]").click();
        cy.get("[data-cy=sort-Nom]").click();

        cy.get("[data-cy=sort-Prénom]").click();
        cy.url().should("include", "value=Pr%C3%A9nom&sort=asc");

        cy.get("[data-cy=sort-Adresse]").click();
        cy.url().should("include", "value=Adresse&sort=asc");

        cy.get("[data-cy=sort-Ville]").click();
        cy.url().should("include", "value=Ville&sort=asc");

        cy.get("[data-cy='sort-Code postal']").click();
        cy.url().should("include", "value=Code+postal&sort=asc");

        cy.get("[data-cy=sort-Quartier]").click();
        cy.url().should("include", "value=Quartier&sort=asc");

        cy.get("[data-cy='sort-Téléphone 1']").click();
        cy.url().should("include", "value=T%C3%A9l%C3%A9phone+1&sort=asc");

        cy.get("[data-cy='sort-Téléphone 2']").click();
        cy.url().should("include", "value=T%C3%A9l%C3%A9phone+2&sort=asc");

        cy.get("[data-cy=sort-Calling]").click();
        cy.url().should("include", "value=Calling&sort=asc");

        cy.get("[data-cy=sort-LastCall]").click();
        cy.url().should("include", "value=LastCall&sort=asc");

    });
});
