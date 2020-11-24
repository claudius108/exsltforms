({
	"xblBindingAttached":	function() {
		/*
		* Define kF JS object
		*/
		window[ 'kF' ] = {
			version : "0.7",
			defaultModel : "",
			xfPrefix : "",
			models : {},
			instances : {},
			simPath : {
				xpathExprString : "",
				xformsFunctionsList : { 'avg' : 1 },
				xpathFunctionsList : { 'count' : 1 },
				xformsFunctions: {
					instance : function( instanceId ) {
						return document.getElementById( instanceId ).firstElementChild;
					},
					avg : function( xpathExpr ) {
						var sum = document.evaluate( 'sum(' + xpathExpr + ')', document.getElementById( 'i' ).firstElementChild, null, 0, null).numberValue;
						var count = document.evaluate( 'count(' + xpathExpr + ')', document.getElementById( 'i' ).firstElementChild, null, 0, null).numberValue;
						return sum /count;
					},
					aggregate : function( functionName, xpathExpr ) {
						var sequence = document.evaluate( xpathExpr, document.getElementById( 'i' ).firstElementChild, null, 7, null);
						var array = new Array();
						for ( var i=0, il = sequence.snapshotLength; i < il; i++ ) {
							var element = sequence.snapshotItem(i);
							array[ i ] = element.textContent;
						}
						return Math[ functionName ].apply( Math, array );
					}
		
				},
				kFxpath : {
					kFvalueOf : function( contextDocument, xpathExpr, errType ) {
						try {
							var XPathResult = contextDocument.evaluate( xpathExpr, contextDocument.documentElement.firstElementChild, kF.utils.nsResolver, 0, null);
						}
						catch(err) {
							switch( errType ) {
								case 'xforms-binding-exception':
									//document.dispatchEvent( kF.XMLevents[ 'xforms-binding-exception' ] );
									//kFdebuggingLogger.show();
									//YAHOO.log( "FATAL ERROR: The processor encountered 'xforms-binding-exception', for element '#" + ( new XMLSerializer() ).serializeToString( contextNode ) + "', as it has an illegal binding expression, namely '" + xpathExpr + "'. The processor will halt now.", "error" );
								break;
								case 'xforms-compute-exception':
									//document.dispatchEvent( kF.XMLevents[ 'xforms-compute-exception' ] );
									//kFdebuggingLogger.show();
									//YAHOO.log( "FATAL ERROR: The processor encountered 'xforms-compute-exception', for element '#" + ( new XMLSerializer() ).serializeToString( contextNode ) + "', as it has an illegal computing expression, namely '" + xpathExpr + "'. The processor will halt now.", "error" );
								break;
							}
							return null;
						}//alert( xpathExpr + " " + XPathResult.resultType );
						switch( XPathResult.resultType ) {
							case 1:
								return XPathResult.numberValue;
							break;
							case 2:
								return XPathResult.stringValue;
							break;
							case 3:
								return XPathResult.booleanValue;
							break;
						}
					},
					kFcopyOf : function( contextDocument, xpathExpr ) {
						try {
							var node = contextDocument.evaluate( xpathExpr, contextDocument.documentElement.firstElementChild, kF.utils.nsResolver, 9, null).singleNodeValue;
						}
						catch(err) {
							//document.dispatchEvent( kF.XMLevents[ 'xforms-binding-exception' ] );
							//kFdebuggingLogger.show();
							//YAHOO.log( "FATAL ERROR: The processor encountered 'xforms-binding-exception', for element '#" + ( new XMLSerializer() ).serializeToString( contextNode ) + "', as it has an illegal binding expression, namely '" + xpathExpr + "'. The processor will halt now.", "error" );
							return false;
						}
						return node;
					}
				},
				processXPathExprString : function(xpathExprString) {
					xpathExprString =
						xpathExprString
							.replace( new RegExp( "\\)", "gi" ), "\")+\"" )
							.replace( new RegExp( "\"\\)\\+\"\\.", "gi" ), ")." )
							.replace( new RegExp( "\"\\)\\+\"\\[", "gi" ), ")[" );
					return "/*\n" + xpathExprString + "\n*/";
				}
			},
			utils: {
				xpathNS: {},
				nsResolver : function( prefix ) { return kF.utils.xpathNS[ prefix ] || null; },
				poll : {
					register : function(pollName, pollAction, pollCondition) {
						this.registry[pollName] = {
							pollAction : pollAction,
							pollCondition : pollCondition
						};
						this.init(pollName);
					},
					registry : {},
					init : function(pollName) {
						if ( kF.utils.poll.registry[pollName].pollCondition() ) {
							kF.utils.poll.registry[pollName].pollAction();
						} else {
							setTimeout( function() { kF.utils.poll.init(pollName); }, 10);
						}
					}
				}
			}						
		};
		/*
		* INITIALIZE kuberaForms processor
		*/
		(function() {
			/*
			* Get XForms prefix and other prefixes for data instances
			*/
			var xformsPrefixes = {
				"http://www.w3.org/2001/xml-events" : 1,
				"http://www.w3.org/2001/XMLSchema" : 1,
				"http://www.w3.org/2001/XMLSchema-instance" : 1,
				"http://www.w3.org/2002/xforms" : 1
			},
				attribute = null,
				xpathNSrepo = kF.utils.xpathNS;
			for ( var i = 0; attribute = document.documentElement.attributes[i]; i++ ) {
				var attrValue = attribute.value, attrName = attribute.name;
				if (!attrName.match(/^xmlns:/)) {
					continue;
				}
				if (attrValue == "http://www.w3.org/2002/xforms") {
					kF.xfPrefix = attrName.substring( 6 );
				}
				if (attrValue in xformsPrefixes) {
					continue;
				}
				xpathNSrepo[ attrName.substring( 6 ) ] = attrValue;
			}
			/*
			* Set default model
			*/
			kF.defaultModel = document.querySelector(kF.xfPrefix + "\\:model");
			/*
			* Process XForms style definitions
			*/
			//TODO: process any XForms style elements, and reinsert them in DOM
					
		})();
		kF.utils.poll.register('DOMtest1', function() {alert(kF.defaultModel.id);}, function() { return kF.defaultModel.id != ""});
		//kF.utils.poll.register('DOMtest2', function() {alert('Poll implemented 2');}, function() { return document && document.getElementsByTagName('BODY')});

		window.onload = function() {
			/*
			* Insert in page a JS script containing processed XPath expressions
			*/
			var oHead = document.getElementsByTagName('HEAD').item(0);
			var oScript = document.createElement( "script" );
			oScript.language = "javascript";
			oScript.type = "text/javascript";
			//processing of kF.simPath.xpathExprString
			oScript.text = kF.simPath.processXPathExprString( kF.simPath.xpathExprString );
			oHead.appendChild( oScript );

			//alert( ( new XMLSerializer() ).serializeToString( inst1 ) );
		};					
	 }
})