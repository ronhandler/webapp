UTILS.addEvent(document, 'DOMContentLoaded', function() {
	//$(window).scrollTop(0);

	// Initially hide the notification pane and tabs' content.
	$("div.notifications").hide();
	$(".tabs>div").hide();

	if (location.hash) {
		$(location.hash).show();
	}

	var refreshtab = function(e) {
		e.preventDefault();
		var cur = $(this).attr("href");
		var el = $(cur);
		el.removeAttr('id');         // Temporarily remove id, so scroll won't jump.
		location.hash = cur;
		el.attr('id', cur.slice(1)); // Re-enable id.
		$(".tabs>div").hide();
		el.show();
	};

	var elements = $(".tabs li>a");
	for (var i=0; i<elements.length; i++) {
		UTILS.addEvent(elements[i], 'focus click', refreshtab);
	}

	// Get data using ajax UTILS method.
	UTILS.ajax('/data/config.json',
	{
		method: 'GET',
		done: {
			call: function (data, res) {
				if (res.notification) {
					$("div.notifications").append(res.notification);
					$("div.notifications").show();
				} else {
				}
			}
		}
	});

	UTILS.addEvent($('#report-save')[0], 'click', function() {
		var reports = [];
		var elements = $(".report input");
		for (var i=0; i<elements.length; i=i+2) {
			var record = {
				name: elements[i].value,
				url: elements[i+1].value,
			};
			reports.push(record);
		}
		console.log(reports);
	});

});
