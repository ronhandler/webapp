function validate(reports) {
	return 0;
};
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
	iframe_pages.forEach(function(page) {
		$(page+" input").each(function() {
			UTILS.addEvent($(this)[0], "keyup", function(e) {
				if (e.keyCode === 13) {
					$(page+" [id*='-save']").trigger("click");
				} else if (e.keyCode === 27) {
					$(page+" [id*='-cancel']").trigger("click");
				}
				e.preventDefault();
			});
		});
		UTILS.addEvent($(page+" [id*='-cancel']")[0], "click", function() {
			$(".tabs form").fadeToggle("fast");
		});
		UTILS.addEvent($(page+" [id*='-save']")[0], "click", function() {
			// Get input from user.
			var reports = [];
			var elements = $(page+" .report input");
			for (var i=0; i<elements.length; i=i+2) {
				var record = {
					name: elements[i].value,
					url: elements[i+1].value,
				};
				reports.push(record);
			}

			var ret = validate(reports);

			// Fade effect on the toggle button.
			$(page+" .settings.icon").trigger("click");
			//$(page+" form").fadeToggle("fast");

			// Populate the select box with the new user input.
			$(page+" .selectbox").empty();
			for (var i=0; i<reports.length; i++) {
				if (reports[i].name == "")
					continue;
				$(page+" .selectbox").append($("<option/>", {
					value: reports[i].url,
					text: reports[i].name
				}));
			}

			// Set event to for the select box to load site into iframe.
			UTILS.addEvent($(page+" .selectbox")[0], "change", function() {
				$(page+" [id*='-frame'").attr('src', $(this).val());
			});

			// Set event to open a new tab with the selected site.
			UTILS.addEvent($(page+" .newtab.icon")[0], "focus click", function() {
				var tempurl =  $(page+" .selectbox").find("option:selected").val();
				window.open(tempurl);
			});

			// Select the first option in the select box.
			$(page+" .selectbox").attr('selectedIndex', 0);
			$(page+" [id*='-frame'").attr('src', $(page+" .selectbox").val());

		});
		// Add event to the settings icon.
		UTILS.addEvent($(page+" .settings.icon")[0], "focus click", function() {
			$(page+" form").fadeToggle("fast");
			$(page+" input")[0].focus();
		});
	});

//http://walla.co.il
//http://apple.com

});
