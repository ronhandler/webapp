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
		var cur = $(this).attr('href');
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

	var iframe_pages = ["#quick-reports", "#my-team-folders"];
	for (var p=0; p<iframe_pages.length; p++) {
		var page = iframe_pages[p];
		console.log('blah ' + page);
		UTILS.addEvent($(page+" [id*='-save']")[0], 'click', function() {
			var pg = $(this).attr('name');
			console.log('baah ' + pg);
			// Get input from user.
			var reports = [];
			var elements = $(pg+" .report input");
			for (var i=0; i<elements.length; i=i+2) {
				var record = {
					name: elements[i].value,
					url: elements[i+1].value,
				};
				reports.push(record);
			}

			// Fade effect on the toggle button.
			$(pg+" form").fadeToggle("fast");

			// Populate the select box with the new user input.
			$(pg+" .selectbox").empty();
			for (var i=0; i<reports.length; i++) {
				if (reports[i].name == "")
					continue;
				$(pg+" .selectbox").append($("<option/>", {
					value: reports[i].url,
					text: reports[i].name
				}));
			}

			// Set event to for the select box to load site into iframe.
			UTILS.addEvent($(pg+" .selectbox")[0], "change", function() {
				$(pg+" [id*='-frame'").attr('src', $(this).val());
			});
			$(pg+" .selectbox").val(0).change();

			// Set event to open a new tab with the selected site.
			UTILS.addEvent($(pg+" .newtab.icon")[0], "focus click", function() {
				var tempurl =  $(pg+" .selectbox").find("option:selected").val();
				window.open(tempurl);
			});
		});
	}

	var elements = $(".tabs .settings.icon");
	for (var i=0; i<elements.length; i++) {
		UTILS.addEvent(elements[i], 'focus click', function() {
			$(".tabs form").fadeToggle("fast");
		});
	}

});
