describe("Page Tableau Drawer", () => {

    beforeEach(() => {
        cy.log("Connexion à l'application")
        cy.visit("/auth/signin")
        cy.get("[data-cy=email]").type("admin@gmail.com")
        cy.get("[data-cy=password]").type("admin")
        cy.get("[data-cy=submitLogin]").click()
        cy.url().should("include", "/tableau");

    });

    it("should render Drawer and element in", () => {
        cy.get("[data-cy='table-row-0']").click();
        cy.get("[data-cy=drawerComponent]").should("exist")
        cy.get("[data-cy=tabComponent]").should("exist")
    })

    it("should have tab information", () => {
        cy.get("[data-cy='table-row-0']").click();

        cy.log("should have a tab information")
        cy.get("[data-cy=Information]").should("exist")
        cy.get("[data-cy=Information]").click();
        cy.url().should("include", "conf=Information");
        cy.get("[data-cy=tab-information]").should("exist");

        cy.log("should have a button submit")
        cy.get("[data-cy=submit]").should("exist");

        cy.log("should have 8 input here information")
        cy.get("[data-cy=lastName]").should("exist");
        cy.get("[data-cy=firstName]").should("exist");
        cy.get("[data-cy=address]").should("exist");
        cy.get("[data-cy=city]").should("exist");
        cy.get("[data-cy=zipCode]").should("exist");
        cy.get("[data-cy=district]").should("exist");
        cy.get("[data-cy=phone1]").should("exist");
        cy.get("[data-cy=phone2]").should("exist");

    })

    it("should have tab calls", () => {
        cy.get("[data-cy='table-row-0']").click();

        cy.log("should have a tab calls")
        cy.get("[data-cy=Calls]").should("exist")
        cy.get("[data-cy=Calls]").click();
        cy.url().should("include", "conf=Calls");
        cy.get("[data-cy=tab-calls]").should("exist");
    })

    it("should have tab rdv", () => {
        cy.get("[data-cy='table-row-0']").click();

        cy.log("should have a tab rdv")
        cy.get("[data-cy=RDV]").should("exist")
        cy.get("[data-cy=RDV]").click();
        cy.url().should("include", "conf=RDV");
        cy.get("[data-cy=tab-rdv]").should("exist");
    })
})
