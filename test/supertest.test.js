const supertest = require('supertest');
const UserModel = require('../src/models/user.model.js');
const { createHash } = require('../src/utils/hashbcryp.js');
const jwt = require('jsonwebtoken');

const requester = supertest("http://localhost:8080");

let chai, expect;

before(async function () {
    chai = await import('chai');
    expect = chai.expect;
});

describe("Testing user registration endpoint", function() {
    this.timeout(3000000);

    it("should register a new user successfully", async () => {
        const userData = {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            password: "password123",
            age: 25,
        };

        try {
            const response = await requester.post("/api/users/register")
                .send(userData)
                .expect(302);

            expect(response.headers.location).to.equal('/api/users/profile');//works



            const user = await UserModel.findOne({ email: userData.email });
            expect(user).to.exist;
            expect(user.first_name).to.equal(userData.first_name);
            expect(user.last_name).to.equal(userData.last_name);

        } catch (error) {
            console.error("Error during test:", error);
            throw error;
        }
    });

    // Clean up after tests if necessary (delete test users created during testing)

});
