UTILS.addEvent(document, 'DOMContentLoaded', function() {
	//$(window).scrollTop(0);

	var validate = function(reports) {
		var flag = true;
		//console.log(reports);
		for (var i=0; i<reports.length; ++i) {
			// If one of the fields in a row is missing, no good.
			if (reports[i].name.value == "" && reports[i].url.value != "") {
				flag = false;
				reports[i].name.valid=false;
			}
			else if (reports[i].name.value != "" && reports[i].url.value == "") {
				flag = false;
				reports[i].url.valid=false;
			} else {
				reports[i].name.valid=true;
				reports[i].url.valid=true;
			}
			var urlRegex = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
			if (urlRegex.test(reports[i].url.value) == false && reports[i].url.value!="") {
				console.log('Not a url');
				reports[i].url.valid=false;
				flag = false;
			}
		}
		return flag;
	};

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

	// Add placeholders to all input elements.
	$(".tabs input").each(function() {
		var type = $(this).attr("name").toLowerCase();
		$(this).attr("placeholder", "Enter "+type+"...");
	});

	["#public-folders", "#my-folders"].forEach(function(page) {
		// Set event to open a new tab with the selected site.
		UTILS.addEvent($(page+" .newtab.icon")[0], "focus click", function() {
			var tempurl =  $(page+" iframe").attr("src");
			window.open(tempurl);
		});
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
					name: {value: elements[i].value},
					url: {value: elements[i+1].value},
					index: i,
				};
				if (record.name.value!="" && record.url.value!="")
				reports.push(record);
			}

			if (validate(reports) == false) {
				// Clear error class from all elements.
				elements.each(function() {
					$(this).removeClass("error");
				});
				// Add error class to erroneous elements.
				var eflag = false;
				console.log(reports);
				for (var i=0; i<reports.length; i++) {
					if (reports[i].name.valid == false) {
						if (eflag == false) {
							// Set correct focus.
							elements[reports[i].index].focus();
							eflag = true;
						}
						elements[reports[i].index].classList.add("error");
					}
					if (reports[i].url.valid == false) {
						if (eflag == false) {
							// Set correct focus.
							elements[reports[i].index+1].focus();
							eflag = true;
						}
						elements[reports[i].index+1].classList.add("error");
					}
				}
				return;
			}
			elements.each(function() {
				$(this).removeClass("error");
			});

			// Fade effect on the toggle button.
			$(page+" .settings.icon").trigger("click");
			//$(page+" form").fadeToggle("fast");

			// Populate the select box with the new user input.
			$(page+" .selectbox").empty();
			for (var i=0; i<reports.length; i++) {
				if (reports[i].name == "")
					continue;
				$(page+" .selectbox").append($("<option/>", {
					value: reports[i].url.value,
					text: reports[i].name.value
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
