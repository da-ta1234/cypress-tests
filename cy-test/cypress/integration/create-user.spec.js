///<reference types="Cypress" /> 

import {today, uniqueValue} from '../fixtures/data'
let u = uniqueValue
let nu = uniqueValue /6
let filepath = 'Picture1.png'

describe('user creation ', () => {
    before(() => {
        cy.visit('http://a.testaddressbook.com/')
        cy.getCookies().as('cookies').then((cookies) => {
            cy.wrap(cookies)
            cy.writeFile('cypress/fixtures/cookies.json', cookies)
        })
    })
    beforeEach(() => {
        cy.readFile('cypress/fixtures/cookies.json').then((cookies) => {
            cy.wrap(cookies)
            let _name = cookies[0].name
            let _value = cookies[0].value
            cy.setCookie(_name, _value)
            cy.getCookies().as('cookies').then((cookies) => {
                cy.wrap(cookies)
                cy.writeFile('cypress/fixtures/cookies.json', cookies)
            })
        })
    })
    it('should create a new account', () => {
        cy.intercept('/sign_up').as('signup')
        cy.navigate('#sign-in')
        cy.navigate('[data-test*=sign-up]')
        cy.wait('@signup').then(()=> {
            cy.formData('[data-test=email]', `test${u}@test.com`)
            cy.formData('[data-test=password]', `changemepls!#1`)
            cy.navigate('[data-test=submit]')
            cy.get('.navbar-text').invoke('text').then(value => {
                cy.wrap(value).should('deep.equal', `test${u}@test.com`)
            })
            cy.navigate('[data-test*=addresses]')
            cy.navigate('[data-test=create]')
        })
        })
    it('should create and correct an erroneous address', () => {
        cy.formData('#address_last_name', 'mctest')
        cy.formData('#address_street_address', '1581')
        cy.formData('#address_secondary_address', 'Calico Drive')
        cy.formData('#address_city', 'Orlando')
        cy.formData('#address_age', 33)
        cy.formData('#address_phone', '3048123975')
        cy.navigate('#address_interest_climb')
        cy.get('#address_state').select('Florida')
        cy.navigate('#address_country_us')
        cy.get('#address_birthday').click().type('1988-01-01')
        cy.get('input[type="file"]').attachFile(filepath)
        cy.get('input[type=color]').invoke('val', '#ff0001').trigger('change')
        cy.formData('#address_note', `This test was performed on ${today}`)
        cy.navigate('[data-test*=submit]')
        cy.get('#error_explanation').children().should('contain', '2 errors').and('contain', 'First name').and('contain', 'Zip code')
        cy.formData('#address_first_name', 'testy')
        cy.formData('#address_zip_code', '26412')
        cy.navigate('[data-test*=submit]')
    })

    it('should verify the details', () => {
        cy.get('[data-test=first_name]').should('contain', 'testy')
        cy.get('[data-test=last_name]').should('contain', 'mctest')
        cy.get('[data-test=street_address]').should('contain', '1581')
        cy.get('[data-test=secondary_address]').should('contain', 'Calico Drive')
        cy.get('[data-test=city]').should('contain', 'Orlando')
        cy.get('[data-test=state]').should('contain', 'AL')
        cy.get('[data-test=zip_code]').should('contain', '26412')
        cy.get('[data-test=country]').should('contain', 'us')
        cy.get('[data-test=birthday]').should('contain', '1/01/1988')
        cy.get('[data-test=color]').should('have.css', 'background-color', 'rgb(255, 0, 1)')
        cy.get('[data-test=age]').should('contain', 33)
        cy.get('[data-test=phone]').should('contain', '304-812-3975')
        cy.get('[data-test=interest_climb]').should('contain', 'Yes')
        cy.get('[data-test=note]').should('contain', `This test was performed on ${today}`)
    })

    it('should edit and recheck the address', () => {
        cy.navigate('[data-test=edit]')
        cy.get('input[type="file"]').attachFile(filepath)
        cy.get('#address_first_name').invoke('val').should('eq', 'testy')
        cy.get('#address_last_name').invoke('val').should('eq', 'mctest')
        cy.get('#address_street_address').type('1583')
        cy.get('#address_secondary_address').invoke('val').should('eq', 'Calico Drive')
        cy.get('#address_city').invoke('val').should('eq', 'Orlando')
        cy.get('#address_state').select('Florida')
        cy.get('#address_zip_code').invoke('val').should('eq', '26412')
        cy.get('#address_birthday').invoke('val').should('eq', '1988-01-01')
        cy.get('#address_age').invoke('val').should('eq', '33')
        cy.get('#address_phone').invoke('val').should('eq', '3048123975')
        cy.get('#address_note').invoke('val').should('eq', `This test was performed on ${today}`)
        cy.navigate('[data-test*=submit]')
        cy.navigate('[data-test="sign-out"]')
    })

})