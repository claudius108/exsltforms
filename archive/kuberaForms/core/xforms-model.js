			 ({
				"xblBindingAttached":	function() {
					this.boundElement.style.display = "none";
					//set id for element
					this.boundElement.id = this.boundElement.id ? this.boundElement.id : "kF-id-" + new Date().getTime();
					//set getInstanceDocument() function
					this.boundElement['getInstanceDocument'] = function(instanceId) {
						var arg = this.getInstanceDocument.arguments[0];
						switch(arg) {
							case undefined:
							case '':
								return this.querySelector("*").querySelector("*");
							break;
							default:
								return this.querySelector("#" + arg + " > *");
						}						
					}

					}
			 })			
