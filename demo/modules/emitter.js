/* emitter module */                      
                      console.log(typeof require);  

                      console.log(typeof module);                    

                      console.log(module.id);
                            
                      // a simple Pub/Sub interface which is akin to that of NodeJS
                            
                      var handlers = {},
                           
                      // the module definition itself
                           
                          pubsub =  {
                                      
                                     on:function(evt, callback){
                                              if(!handlers[evt]){
                                                   handlers[evt] = callback;
                                              }
                                      },
                                      emit:function(evt){
                                              if(handlers[evt){
                                                   handlers[evt].apply(null, [].slice.call(arguments, 1));
                                              }
                                     }
                            };
                            
                       // this is one way to export module definitions (using Mudus)
                            
                        module.exports = pubsub;

                  
