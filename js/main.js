UTILS.addEvent(document, 'DOMContentLoaded', function() {

	var iframe_pages = ["#quick-reports", "#my-team-folders"]
	var reports = [];
	//$(window).scrollTop(0);

	var validate = function(rep) {
		var flag = true;
		for (var i=0; i<rep.length; ++i) {
			// If one of the fields in a row is missing, no good.
			if (rep[i].name.value == "" && rep[i].url.value != "") {
				flag = false;
				rep[i].name.valid=false;
			} else if (rep[i].name.value != "" && rep[i].url.value == "") {
				flag = false;
				rep[i].url.valid=false;
			} else {
				rep[i].name.valid=true;
				rep[i].url.valid=true;
			}
			var urlRegex = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
			if (urlRegex.test(rep[i].url.value) == false && rep[i].url.value!="") {
				var urlRegex2 = /[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
				if (urlRegex2.test(rep[i].url.value) == false && rep[i].url.value!="") {
					rep[i].url.valid=false;
					flag = false;
				} else {
					rep[i].url.value = "http://"+rep[i].url.value;
				}
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

	UTILS.addEvent($(".search-box")[0], "keyup", function(e) {
		if (e.keyCode === 13) {
			var pattern = $(".search-box input").val();
			var found = false;
			console.log("searching... " + pattern);
			iframe_pages.forEach(function(p) {
				if (reports[p]) {
					for (var i=0; i<reports[p].length; i++) {
						if (reports[p][i].name.value == pattern) {
							// If this is the first match, open the page
							// containing it.
							if (found == false) {
								$(".tabs>div").hide();
								$(".tabs [href='"+p+"']").focus();
								$(p).show();

								var el = $(p+" .selectbox option:contains('"+pattern+"')");
								var ind = el.attr("name");
								$(p+" .selectbox").prop('selectedIndex', ind);
								found = true;
							}
						}
					}
				}
			});
			if (found==false) {
				// Pattern wasn't found, we can display a notification.
				$("div.notifications").html("The search report "+pattern+" was not found.");
				$("div.notifications").show();
			} else {
				// Else, the pattern was found.
				$("div.notifications").html("");
				$("div.notifications").hide();
			}
		}
		e.preventDefault();
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

	iframe_pages.forEach(function(page) {
		reports[page] = [];
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
			var elements = $(page+" .report input");
			reports[page] = [];
			for (var i=0; i<elements.length; i=i+2) {
				var record = {
					name: {value: elements[i].value},
					url: {value: elements[i+1].value},
					index: i,
				};
				reports[page].push(record);
			}
			if (validate(reports[page]) == false) {
				// Clear error class from all elements.
				elements.each(function() {
					$(this).removeClass("error");
				});
				// Add error class to erroneous elements.
				var eflag = false;
				for (var i=0; i<reports[page].length; i++) {
					if (reports[page][i].name.valid == false) {
						if (eflag == false) {
							// Set correct focus.
							elements[reports[page][i].index].focus();
							eflag = true;
						}
						elements[reports[page][i].index].classList.add("error");
					}
					if (reports[page][i].url.valid == false) {
						if (eflag == false) {
							// Set correct focus.
							elements[reports[page][i].index+1].focus();
							eflag = true;
						}
						elements[reports[page][i].index+1].classList.add("error");
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
			var x=0;
			for (var i=0; i<reports[page].length; i++) {
				if (reports[page][i].name.value != "") {
					$(page+" .selectbox").append($("<option/>", {
						value: reports[page][i].url.value,
						text: reports[page][i].name.value,
						name: x++,
					}));
				}
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
			$(page+" .selectbox").prop('selectedIndex', 0);
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
