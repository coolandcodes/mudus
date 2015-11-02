
describe("definition test in public interface", function(){
     beforeEach(function () {
          this.addMatchers({
            
          });
     });
     it("ready method defined", function () {
         expect(Mudus.ready).toBeDefined();
     });
     it("load method not defined ", function(){
         expect(Mudus.load).toBeUndefined();
     });
});
