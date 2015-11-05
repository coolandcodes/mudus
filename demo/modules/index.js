/* the index module */
  
                          console.log(module.id);   
 
                         var emtr = require('emitter'),
      
                          $$ = jQuery,

                         // the module definition
                          Index = {
                              watch:function(evt){
                                  $$('#check-board').on('click', function(e){
                                       emtr.emit(evt, {x:e.clientX, y:e.clientY});
                                  });
                              }
                          };

                          emtr.on('pos', function(data){
                               alert("x: "+data.x+", y: "+data.y);
                          });

                          // yet another way to export modules

                          return Index;
