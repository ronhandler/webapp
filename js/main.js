$(document).ready( function() {

	$(window).scrollTop(0);

	var refreshtab = function(e) {
		e.preventDefault();
		var cur = $(this).attr("href");
		var el = $(cur);
		el.removeAttr('id');
		location.hash = cur;
		el.attr('id', cur.slice(1));
		$(".tabs>div").hide();
		el.show();
	};

	$(".tabs>div").hide();
	if (location.hash) {
		$(location.hash).show();
	}

	$(".tabs li>a").focus(refreshtab);
	$(".tabs li>a").click(refreshtab);
});

