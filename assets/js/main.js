$(function () {
	if ($("#wrapper > h2, #wrapper > h3").length > 0) {
		$("#wrapper > h2, #wrapper > h3").each(function () {
			$("#table_of_content ol").append(
				"<li class='tag-"
				+ this.nodeName.toLowerCase()
				+ "'><a href='#"
				+ $(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
				+ "'>"
				+ $(this).text()
				+ "</a></li>");
			$(this).attr("id", $(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
			$("#table_of_content ul li:first-child a").parent().addClass("active");
		});
	}
	else {
		$("#table_of_content").remove();
	}


});