<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<!--=======================================================================

	replace.xsl

	This is an example of using a named template to do substring
	replacement. It relies on tail recursion, in order to be XSLT 1.0
	conformant. This template can be used when the XPath translate()
	function, which operates on single characters in a string, is
	insufficient. It uses the XPath functions substring-before(),
	substring-after(), and concat(), and is quite simple.

	Each time the named template is invoked, it is given a string to
	perform the replacement on, a substring to find and replace, and a
	replacement string. It produces a result tree fragment containing a
	text node with the first instance of the matched string having been
	replaced.
	
	If there was any text after that first match, the template calls
	itself again, but makes the string to perform the replacement on be
	just the text after the first match. When the end of the string is
	reached, the template won't call itself again.
	
	The series of text nodes that it produces during this process are
	automatically concatenated into one text node, which you can leave
	in the result tree fragment for most situations. If it is
	necessary to have an actual string object, use the string()
	function to use the string-value of the result tree fragment.

	Written by: Mike J. Brown <mike@skew.org>
	License: none; use and distribute freely.

	Version 1.0 - 10 Nov 2000: First public version. XSLT 1.0 conformant.

=======================================================================-->

	<!-- arbitrary output method just for demonstration purposes -->
	<xsl:output method="text"/>

	<!-- template matching root node of arbitrary source tree -->
	<xsl:template match="/">
		<!-- example showing replacement of '%20' with a single space -->
		<xsl:variable name="myString" select="'This%20is%20a%20Test'"/>
		<xsl:variable name="myNewString">
			<!-- go create the result tree fragment with the replacement -->
			<xsl:call-template name="SubstringReplace">
				<xsl:with-param name="stringIn" select="$myString"/>
				<xsl:with-param name="substringIn" select="'%20'"/>
				<xsl:with-param name="substringOut" select="' '"/>
			</xsl:call-template>
		</xsl:variable>
		<!--
		show the new string. concat() will treat the result tree
		fragment as if it were a string returned by the string() function.
		-->
		<xsl:value-of select="concat('&#10;input: ',$myString,'&#10;output: ',$myNewString)"/>
	</xsl:template>

	<!-- here is the template that does the replacement -->
	<xsl:template name="SubstringReplace">
		<xsl:param name="stringIn"/>
		<xsl:param name="substringIn"/>
		<xsl:param name="substringOut"/>
		<xsl:choose>
			<xsl:when test="contains($stringIn,$substringIn)">
				<xsl:value-of select="concat(substring-before($stringIn,$substringIn),$substringOut)"/>
				<xsl:call-template name="SubstringReplace">
					<xsl:with-param name="stringIn" select="substring-after($stringIn,$substringIn)"/>
					<xsl:with-param name="substringIn" select="$substringIn"/>
					<xsl:with-param name="substringOut" select="$substringOut"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$stringIn"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>

