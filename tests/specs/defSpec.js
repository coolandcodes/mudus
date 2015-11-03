
describe("definition test for public interface", function(){
    /* 
    beforeEach(function () {
          this.addMatchers({
            
          });
     });*/
     it("should have the 'ready' method defined", function () {
          expect(Mudus.ready).toBeDefined();
     });
     it("should have the 'load' method not defined ", function(){
          expect(Mudus.load).toBeUndefined();
     });
});
