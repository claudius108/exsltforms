			 ({
				"xblBindingAttached":	function() {
					this[ 'xforms-input' ] = this.boundElement.querySelector( "input" );
					//set id for element
					this.boundElement.id = this.boundElement.id ? this.boundElement.id : "kF-id-" + new Date().getTime();
					//set model for element
					this.boundElement.setAttribute('model', this.boundElement.getAttribute('model') ? this.boundElement.getAttribute('model') : 'model1');
					//generate the string with all the XPath expression
					kF.simPath.xpathExprString += "document.getElementById('" + this.boundElement.id + "')['prepared-ref'] = " + "\"" + this.boundElement.getAttribute( "ref" ) + "\";" + "\n";
					//style the xforms input element
					this.boundElement.style.display = "block";
				}
			 })
