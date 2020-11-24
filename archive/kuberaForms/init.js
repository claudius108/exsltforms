kuberaForms.utils.pollingConditions[ 'initkF' ] = {
	testedValue: function() { return document.readyState == 'complete'; },
	executedFunction: function() {

		var start = new Date().getTime();
		var oldBody = document.getElementsByTagNameNS( "http://www.w3.org/1999/xhtml", "body" )[0];
		oldBody.innerHTML = '';

		var xmlDoc = document;

		request = new XMLHttpRequest();
		request.overrideMimeType("application/xml");
		request.open( 'GET', 'http://localhost/utils/kuberaForms/core-xsl/kuberaForms.xsl', false );
		request.send( null );
		var xsltDoc = request.responseXML;
				
		var xsltProcessor = new XSLTProcessor();
		xsltProcessor.importStylesheet(xsltDoc);

		var newDocument = xsltProcessor.transformToDocument(xmlDoc, document);
		var newHead = newDocument.evaluate( "./*/head", newDocument, kuberaForms.utils.nsResolver, 9, null).singleNodeValue;
		var newBody = newDocument.evaluate( "./*/body", newDocument, kuberaForms.utils.nsResolver, 9, null).singleNodeValue;

		var oldHead = document.evaluate( "./*/*[1]", document, kuberaForms.utils.nsResolver, 9, null).singleNodeValue;
// 		var oldBody = document.evaluate( "./*/*[2]", document, kuberaForms.utils.nsResolver, 9, null).singleNodeValue;

   		var newElement = document.createElement('body');
   		newElement.innerHTML = newBody.innerHTML;

// 		oldBody.parsentNode.removeChild( oldBody );

// 		oldBody.appendChild( newElement );

// 		document.replaceChild( newElement, oldBody );
// 		oldBody.innerHTML = ( new XMLSerializer() ).serializeToString( newBody.innerHTML );
		oldBody.innerHTML = '<div style="margin-top: 50px;" class="yui-skin-sam"><div id="kFdebuggingLogger"></div></div><xml style="display: none;" id="kFcurrentRepo"><model id="m1"><instance><payment method="cc"><number></number><expiry></expiry></payment></instance></model></xml><xml style="display: none;" id="kFsourceRepo"></xml>';

// 		alert( document.getElementsByTagNameNS( "http://www.w3.org/1999/xhtml", "head" )[0] );



/*		newPage = window.open( "about:blank","_self", "", true );
		newPage.document.write( ( new XMLSerializer() ).serializeToString( xsltProcessor.transformToFragment(xmlDoc, document) ) );
		newPage.document.close();*/					


// 		var end = new Date().getTime();
// 		alert( end - start + ' ms for xslt');
				
// 		alert( ( new XMLSerializer() ).serializeToString( newBody ) );
// 		alert( newBody.innerHTML );
			
		// alert( xsltProcessor.transformToFragment(xmlDoc, document) );
	}
}
kuberaForms.utils.poll( 'initkF' );
