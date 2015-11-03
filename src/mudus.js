/**
 * @project: <mudus module loader>
 * @file: <mudus.js> - 
 * @author: <https://twitter.com/isocroft> -
 * @created: <04/11/2015>
 * @desc: a library for loading and executing CommonJS modules 
 * in the browser environment
 * @version: 0.12
 * @license: MIT 
 * @copyright: (c) 2015. All rights reserved
 */
 
 
window.Mudus = (function($win, $doc, $callback){
	
	Object.each = function(obj, iterator, context){
                 // more code here...
	}

        Array.prototype.forEach = Array.prototype.forEach || function (h, i){
                 if (typeof h != 'function') {
                        return;
                 }
                  var j, k = this.length, l = new Array(k);
                  for (j = 0; j < k; ++j) {
                         if (j in this) {
                             l[j] = h.call(i, this[j], j, this);
                          }
                    }
                   return true;
        };
        
		Array.prototype.indexOf = Array.prototype.indexOf || function(arrElem) {
             // find the index of a given item in an array
             for (var i = 0; i < this.length; i++) {
                   if (this[i] === arrElem) return i;
             }
             return -1;
        };
        
		Function.prototype.bind = Function.prototype.bind || function(){     
             // curry the "this" context and arguments to the given function                

                       
             var fn = this,
             args = [].slice.call(arguments),
             object = args.shift();
             return fn.apply(object, args.concat([].slice.call(arguments)));
        };

         
		

    var internal = $callback($win, $doc, ({}).hasOwnProperty),
	    all = $doc.getElementsByTagName('script'),
	    thisfile = all[all.length - 1];
		
		internal.load(new Function("", "return "+thisfile.getAttribute("data-init")+";")());
	
	return {
	    ready:function(fn){
		     if(typeof fn == "function"){
		          internal.ready(fn);
			 }	  
		}	 
	}
        
 }(this, this.document, function(w, d, $h){
 
     var modules = {}, 
	     loadReady = [],
         hasBeenBuilt = {},
         reqGraph = [], // a list really
         build = function(id){
                var mod, exports, factory;
                if(modules[id]){
                          mod = modules[id];
                          if(modules[id].factory){
                                     factory = mod.factory;
                          }else{
                                    return true; // the module has been built, so return and use 'modules[id].exports' to grab it!
                         };
                          exports = factory(req, mod);
                          /*if(typeof exports == "function"){
                                     ;
                           }*/
						 if(!mod.exports && exports){  
                             mod.exports = exports; // hoisting the variable back to the module 'exports' property
                         }
						 delete mod.factory;
                         reqGraph.splice(reqGraph.indexOf(id), 1);
                   }else{
                          return false;
                   }
         },
         def = function(id, script, context){
                         var local = null, 
                             fn = (typeof script == "function") ? script.bind(local) : (new Function("require,module", (typeof script == "string"?script : ' return null; ')));
                             if(!(id in modules)){
                                         modules[id] = {exports:local, id:id, factory:fn, uri:context};
                              }else{
                                             throw id+" module definiton already exists!";
                              }
         },
         req = function(id){
                               var t, exposed = false;
                                if(modules[id]){
                                      if(reqGraph.indexOf(id) === -1 || !(modules[id].factory)){
                                             if(!hasBeenBuilt[id]){
                                                     reqGraph.push(id);
                                             }
                                      }else{
                                             reqGraph.reverse();
                                             t = "cycle in require graph: "+reqGraph.join("->")+"->"+id;
                                             reqGraph.length = 0;  // empty the array but, maintain the reference!
                                             delete modules[id];
                                             throw t;
                                      }
                                      if(modules[id].factory){
                                             hasBeenBuilt[id] = true;
                                      }
                                      exposed = build(id);
                                      if(exposed){ // check if we have built and exposed the modules' export
		                                   return modules[id].exports;
              		                  }
                                      return null;
                                }else{
                                      throw id+" module definition not found!";
                                }
         },
		 futuresStates = {
                      STARTED:0,
                      AWAIT:1,
                      RESOLVED:2,
                      REJECTED:3
        },
        formatOptions = function(opts){
                      var options = {};
                      (String(opts).split(",")).forEach(function(key){
                                options[key] = true;
                      });
                      return options;
        },
        Routines = function(opts){
	
                   var options = formatOptions(opts),
                       fireStart,
                       fireEnd,
                       savedData,
                       index,
                       fired,
                       firing,
                       pending = [],
                       queue = options.multiple && [],
                       fire = function(data){
                             savedData = !fire.$decline && options.save && data; // save it only when we are not rejecting {fire.$decline != true}!
                             fired = true;
                             firing = true; // firing has begun!
                             index = fireStart || 0;
                             fireEnd = pending.length;
                             for(fireStart = 0; index < fireEnd; index++){
                                  pending[index].apply(data[0], data[1]);
                             }
                             firing = false; // firing has ended!
        
                             if(queue){ // deal with the queue if it exists and has any contents...
                                 if(queue.length){
                                       return fire(queue.shift()); // fire on the {queue} items recursively
                                 }
                                  // if queue is empty.... then end [flow of control] at this point!
                             }
        
                             fire.$decline = false;
        if(savedData){
            // clear our {pending} list and free up some memeory!!
            if(options.unpack){
                pending.length = 0; // saves the reference {pending} and does not replace 

it!
            }
        }
    },
	self = {
    add:function(){
        var len = 0;
        if(pending){ // if not disbaled
            
            var start = pending.length;
            (function add(args){
             
                   args.forEach(function(arg){
                          var type = typeof arg;
                          
                          if(type == "function"){
                                len = pending.push(arg);
                          }else{
                             if(!!arg && arg.length && typeof arg != "string")
                                 add([].slice.call(arg)); // inspect recursively
                          }
                   });
             
             }([].slice.call(arguments)));
            
            
			if( fired ){ // only if we have already run the {pending} list of routines at least once, ...
			   if(options.join && !options.unpack){
			           // fireStart = start; 
			   	     fireEnd = len; // update info again...
				     fire.$decline = true;
	                            fire( savedData ); // fire with the saved data 
			   }  
			}
            
            
        }
        return len;
    },
    hasFn:function(fn){
	    var result = false;
        Object.each(pending, function(val){
		     if(typeof fn === "function" && fn === val)
			      result = true;
		}, this);
		return result;
    },
    hasList:function(){
        return !!pending; // [false] only when the disabled(); method has been called!!
    },
    fireWith:function(/* {Object} context, {Array} args */){
        if(pending && (!fired || queue)){
            var args = arguments.length && [].slice.call(arguments) || [],
            context = args.splice(0, 1) || [];
            args = [context[0], args];
            
            if(firing){ // we are currently iterating on the {pending} list of routines
                queue.push(args); // store resources for recursive firing within {fire} function
            }else{
                fire( args );
            }
        }
    },
    disable:function(){
        pending = queue = undefined;
    }
  };
    
    
    
    return self;
},
  // Implementation of the Promises A spec   
Futures = function(){
	
    var defTracks = {
        resolve:['done', 'RESOLVED', Routines(['join', 'save'])],
        reject:['fail', 'REJECTED', Routines(['join','save'])],
        notify:['progress', 'AWAIT', Routines(['join', 'multiple'])]
    },
    self = this,
    keys = Object.keys(defTracks),
    setter = function(dx, arr,  forPromise){
        var drop = (dx != "notify");
        if(!arr.length && !forPromise) return defTracks[dx][2].fireWith;
        return (!forPromise)? function(){
            if(self.state >= 0 && self.state <=1){
                self.state = futuresStates[defTracks[dx][1]];
            }
            defTracks[dx][2].fireWith(self === this? self : this, [].slice.call

(arguments));
            if(drop){
                defTracks[arr[0]][2].disable();
                defTracks[arr[1]][2].disable();
            }
            return true;
        } : function(){
            if(self.state >= 0 && self.state <=1){
                defTracks[dx][2].add.apply(self, [].slice.call(arguments));
            }
            return self;
        } ;
    },
    i = 0,
    ax = keys.slice(),
    d,
    promise = {};
    
    
    // using a closure to define a function on the fly...
    for(d in defTracks){
        if($h.call(defTracks, d)){
            keys.splice(i++, 1);
            self[d] = setter(d, keys);
            self[d+"With"] = setter(d, []);
            promise[defTracks[d][0]] = setter(d, [], true);
            keys = ax.slice();
        }
    }
    
    
                promise.state = futuresStates.STARTED;
                promise.always = function(){
                    return this.done.apply(self, arguments).fail.apply(self, arguments);
                };
                promise.promise = function(obj){
                    if(obj && typeof obj == "object" && !obj.length){
                         for(var i in promise){
                             if($h.call(promise, i)){
                                  obj[i] = promise[i];
                             }
                         }
                   return obj;
                }
                    return promise;
                };
                promise.then = function(/* fnDone, fnFail, fnProgress */){
                    var ret, args = [].slice.call(arguments);
                    args.forEach(function(item, i){
                           item = (typeof item == "function") && item;
                           self[defTracks[keys[i]][0]](function(){
                                 var rt = item && item.apply(this, arguments);
                                 if(rt && typeof rt.promise == "function")
                                      ret = rt.promise();
                          });
                     });
                     return self.promise(ret);
                };
                promise.isResolved = function(){
                    return !defTracks['reject'][2].hasList();
                };
                promise.isRejected = function(){
                    return !defTracks['resolve'][2].hasList();
                };
                promise.pipe = promise.then;
    
                promise.promise(self);
    
                Futures.STARTED = futuresStates.STARTED;
                Futures.AWAITING = futuresStates.AWAIT;
                Futures.RESOLVED = futuresStates.RESOLVED;
                Futures.REJECTED = futuresStates.REJECTED;
    
    
                setter = ax = d = i = null; // avoid leaking memory with each call to Futures constructor!!
    
	            // enforce new!
	            return (self instanceof Futures)? self : new Futures();
         },
         Ajax = (function(){

            // Define success status stats
            // returns whether the HTTP request was successful
            function IsRequestSuccessful(httpReq) {
                    // IE: sometimes uses 1223 instead of 204
                    var success = (httpReq.status === 0 || 
                         (httpReq.status >= 200 && httpReq.status < 300) || 
                          httpReq.status === 304 || httpReq.status === 1223);
                          return success;
            }			
            // define basic xhr service object
            function CreateXHRObject() {
                        // although IE supports the XMLHttpRequest object, but it does not work on local files.
                        var forceActiveX = (w.ActiveXObject && w.location.protocol === "file:");
                        if (w.XMLHttpRequest && !forceActiveX) {
                                return new w.XMLHttpRequest();
                        }else{
                            try {
                               return new w.ActiveXObject("Microsoft.XMLHTTP");
                            }catch(e) {
	                           return new w.ActiveXObject("Msxml2.XMLHTTP");
	                        }
                        }
                        return null;
            }
             
                        // ajax fetch …
                        var rds = "onreadystatechange",
                            JSAjax = function(options){
                                      var xhr = CreateXHRObject();
			                          if(xhr === null){
					                console.log("Error: Ajax Object failed to create request object!");
				                        return;
			                          }
                                      options.url = options.url+(options.data? "?"+options.data : "");
                                      options.url = options.url+(options.cache? "" : (!options.data? "?" : "&")+"timeburst="+(new Date()).getTime()); 
                                      xhr.open(options.type, options.url, options.async);
                                         
                                           // a couple of xmlhttp headers to set for this request         
                                      xhr.setRequestHeader("Content-Type", "text/"+options.contentType);
                                      xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
                                      xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");  // Fixes IE re-caching problem
                                      xhr.setRequestHeader("Connection", "close"); // may throw an non-fatal error in Webkit so no worries…
					 
		                              xhr.send("");	
					 
		                              // this function is called repeatedly
		                              xhr[rds] = function(){
                                             var rState = this.readyState;
			                                 if(rState === 2){
	  		                                      if(typeof(options.beforeSend) === 'function') 
                                                                   options.beforeSend(this);  
                                                        return;
                                                  }
                                                  if(rState === 4){ 
			                                            xhr[rds] = null;
	 		                                            if(IsRequestSuccessful(this)){
                                                             if((this.getResponseHeader('Content-Type').replace(/^(text|application)\//, '')) === options.dataType){
					                                  options.success(this, this.statusText);
	                                                                 return;
			                                     }else{
                                                                     options.error(this, (this.statusText.indexOf('OK') > -1)? 'JavaScript file not found' : this.statusText);
                                                                     return;
                                                             }
				                                             xhr = null;
		                                                }else{
												                                           options.error(this, this.statusText);
												                                           return;
												                                      }
		                                          }
									  }	  
							
                            };
             
                            return {
                                    request:function(options){
									      if(!options.context){
										           options.context = null;
										     }
                                           JSAjax({
                                                 url:options.url,
                                                 type:"GET",
                                                 async:true,
                                                 cache:false,
                                                 dataType:'javascript',
                                                 data:options.data,
                                                 contentType:'plain',
                                                 beforeSend:function(xhr){
                                                     options.beforeSend && options.beforeSend.call(options.context, xhr, this);
                                                 },
                                                 success:function(xhr, statusText){
                                                     options.callback.call(options.context, xhr.responseText);
                                                 },
                                                 error:function(xhr, statusText){
                                                     options.callback.call(options.context, new Error("request failed: "+statusText));
                                                 }
                                            });
                                    },
									                           abort:function(){
									      
								                           	}
                            };
    }()),
    TaskRunner = (function(){
			                       // Constructor
                                   function Task(e, t) {
                                       this.handler = e,
                                       this.args = t;
									                              Task.count = (typeof Task.count == "number")? (Task.count+1) : 0;
                                   }
                                   // Public method - {run}
                                   Task.prototype.run = function(con) {
                                       if ("function" == typeof this.handler){
                                             return this.handler.apply(con, this.args);
                                       }else {
                                            var scriptSource = "" + this.handler;
                                            return eval(scriptSource);
                                       }
                                   };
                             
                                   var tasksCount = [], nextHandle = 1, tasksByHandle = {}, currentlyRunningATask=false;
                             
                             
                             return {
							 
							        addTask:function(){
									     var self = this;
									     return self.addImmediateCallables.call(self, arguments);
									},
         addImmediateCallables:function(e){
           var t = e[0], n = [].slice.call(e, 1), r = new Task(t, n), i;
										 tasksCount.push(Task.count);
										 i = nextHandle++;
										 tasksByHandle[i] = r;
            return i;
         },
         getTasksCount:function(){
									    return tasksCount.length;
									},
           runIfPresent:function(e, afterTask){
								            e*=1;
										             	var self = this;
                                            if (currentlyRunningATask){
                                                      w.setTimeout(function() {
                                                            (TaskRunner || self).runIfPresent(e, afterTask);
                                                      }, 10);
                                            }else {
                                                 var self = this, t = tasksByHandle[e];
                                                 if(t && t instanceof Task){
                                                       currentlyRunningATask=!0;
                                                       try {
                                                           var y = t.run();
												
		   // detect a standard Promises/A+ promise object
		   if(y && typeof y.promise == "function"){
		       // make sure that the promise object is a "thenable"
		       if(y.promise().promise && typeof y.then == "function"){
			        y.then(function(result){
				        if(typeof afterTask === "function"){
                         afterTask.apply(null, [].slice(arguments));
                }
						currentlyRunningATask=!1;
					      	//y = null;
				    }, function(data){
					    alert("Load Error: "+data.message);
					});
			   }else{
			      throw new Error("TaskRunner: fake promise found!");
			   }
		   }else{
			       currentlyRunningATask=!1;
				 }
                                                       }finally {
                                                            self.remove(e);
                                                       }
                                                   }
                                            }
                                    },
                                    remove: function(e) {
                                             delete tasksByHandle[e];
											                                  tasksCount.splice(e-1);
                                    }
                                }
                             
    }()),
         
		 flush = function(){
		     var fn;
		     for(var y=0; y < loadReady.length; y++){
			      fn = loadReady[y];
			      try{ fn(req); }catch(e){}
			 }
			 loadReady.length = 0;
		 },
		 afterTask = function(){
		     var url = arguments[1];
			 var data = arguments[0];
			 def(url.replace(/^((?:[\w]+)(?:\/))+/, '').replace(/\.js$/i, ''), 

data, url); 
         },
		 promise,
		 task = function(opts){
		      Ajax.request(
				   opts
			  );
			  return opts.context.promise;			 
		};		
		 
         return {
		      load:function(arr){
			        
					var t , id, opts = {
								  context:{itemsCount:arr.length},
								  callback:function(data){
								         if(data instanceof Error){
			                       return this.promise.reject(data);
									      	 }
					              this.promise.resolve(data, this.url);
										 
										 loadReady.set = ((this.currCount + 1) === this.itemsCount);
										 if(loadReady.set){ 
											     flush(loadReady);
									    }
										 
					     },
								  beforeSend:function(xhr, obj){
								      this.url = obj.url; // copy the url to the context
								  }
						};		   
			            for(t=0; t < opts.context.itemsCount; t++){
					               promise = new Futures();
					               opts.url = arr[t];
						              opts.context.currCount = t
						              opts.context.promise = promise;
				                id = TaskRunner.addTask(task, opts);
						              TaskRunner.runIfPresent(id, afterTask);
               }

			  },
			  ready:function(fn){
			       if(loadReady.set){
				        try{ fn(req); }catch(e){}
				   }else{
				        loadReady.push(fn);
				   }
				   return this;
			  }
		 }
 });
