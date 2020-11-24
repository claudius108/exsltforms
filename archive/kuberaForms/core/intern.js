return {
				"xblBindingAttached":	function() {
					/*
					* Define kF JS object
					*/
					window[ 'kF' ] = {
						version : "0.7",
						models : {},
						instances : {},
						simPath : {
							xpathExprString : '',
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
										case 4:
											return XPathResult.iterateNext().textContent;
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
							ns: {},
							nsResolver : function( prefix ) { return kF.utils.ns[ prefix ] || null; }
					
						}						
					
					
					};
					/*
					* INITIALIZE kuberaForms processor
					*/

					(function() {
					
						/*
						* TODO: Set id for models and default model
						*/
					
						/*
						* TODO: Set id for instances
						*/
					
						/*
						* Get XForms prefix and other prefixes for data instances
						*/
						var xfPrefix = "";
						var xformsPrefixes = {
							"http://www.w3.org/2002/xforms" : 1,
							"http://www.w3.org/2001/xml-events" : 1,
							"http://www.w3.org/2001/XMLSchema" : 1,
							"http://www.w3.org/2001/XMLSchema-instance" : 1
						}
						var attribute = null;
						for ( var i = 0; attribute = document.documentElement.attributes[i]; i++ ) {
							var attrValue = attribute.value, attrName = attribute.name;
							//get XForms prefix
							if ( attrValue == "http://www.w3.org/2002/xforms" ) {
								kF.xfPrefix = xfPrefix = attrName.substring( 6 );
							}
							//get data instances prefixes
							if ( attrValue in xformsPrefixes ) {
							} else {
								kF.utils.ns[ attrName.substring( 6 ) ] = attrValue;
							}
						}
						//TODO: what about instances having default namespace - is there any need to retrieve the prefix
						//from XPath expressions?
					
						/*
						* Process XForms style definitions
						*/
						//TODO: process any XForms style elements, and reinsert them in DOM
						
					})();
					
					DOM = {
						onload: function(){},
						check: function(){ if(document && document.getElementsByTagName('BODY')){ DOM.onload(); clearInterval(DOM.interval) }},
						interval: setInterval('DOM.check()',10)
					}

					
										
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
			}