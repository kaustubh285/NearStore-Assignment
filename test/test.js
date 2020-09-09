const server = require("../index");

let chai = require("chai");
let chaiHttp = require("chai-http");
var should = chai.should();
chai.use(chaiHttp);

//Basic test to check if the returned status is 200 and if the returned body type is an Array.

describe("People", () => {
  describe("/GET data", () => {
    it("it should GET the people's data from the /data route", (done) => {
      chai
        .request(server)
        .get("/data")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("Array");
          done();
        });
    });
  });
});
