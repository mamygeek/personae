
keyupTimeoutId = null;

function clearKeyup() {
	if (keyupTimeoutId) {
		clearTimeout(keyupTimeoutId);
		keyupTimeoutId = null;
	}
}

function addGroupHandlers() {
	$(".addThemeButton").click(function(event) {
		var groupId = $(this).data("group-id");
		window.location.href = "theme.php?groupId=" + groupId + "&id=0&admin=";
	});
}

function savePower(myform) {
	clearKeyup();

	$.post(myform.attr("action"), myform.serialize(), function(data) {
//		myform.find(".saved").show().delay(1400).fadeOut(700);
		$("#success_group_groupAlert").parents(".container").show();
		$("#success_group_groupAlert").show().delay(2000).fadeOut(1000, function() {
			$(this).parents(".container").hide();
		});
	}, "json");
}

function savePowerHandlers() {
	$("input[name=gth_power]").keyup(function() {
		var myform = $(this).parents("form");
		clearKeyup();
		keyupTimeoutId = setTimeout(function() {
			savePower(myform);
		}, 1500);
	});
}

function excludeHandlers() {
	$(".excludeButton").click(function(event) {
		event.stopPropagation();
		event.preventDefault();

		var myform = $(this).parents("form");
		var themeId = myform.find("input[name=gth_theme_id]").val();
		$.post(myform.attr("action"), myform.serialize(), function(data) {
			$("#theme-" + themeId).remove();
		}, "json");
	});
}

function addGroupAdminFromSearchForm(rows) {
	var ids = "";
	var separator = "";
	for(var index = 0; index < rows.length; ++index) {
		ids += separator;
		ids += rows.eq(index).data("row").id;
		separator=",";
	}

	if (ids) {
		var myform = {"action": "add_admin"};
		myform["gad_group_id"] = $("#admins form input[name=gad_group_id]").val();
		myform["gad_member_id"] = ids;

		$.post("do_set_group_admin.php", myform, function(data) {
			if (data.ok) {
				addGroupAdmins(data.admins);
			}
		}, "json");
	}
}

function addGroupAdmins(admins) {
	var adminTBody = $("#admins table tbody");

	for(var index = 0; index < admins.length; ++index) {
		var admin = admins[index];

		var link = $("tr[data-template-id=template-group-admin]").template("use", {data : admin});
		adminTBody.append(link);
	}
}

function adminFormHandlers() {
	$("#addAdminButton").click(function(event) {
		event.preventDefault();
		event.stopPropagation();

		var form = $("#addAdminForm");

		$.post(form.attr("action"), form.serialize(), function(data) {
			if (data.ok) {
				addGroupAdmins(data.admins);
				$("#admins table tbody").append(link);

				form.get(0).reset();
			}
		}, "json");
	});

	addRemoveAdminLinkHandlers();
	if (typeof groupAdmins != "undefined") {
		addGroupAdmins(groupAdmins);
	}
}

function addRemoveAdminLinkHandlers(selector) {
	$("#admins").on("click", ".removeAdminLink", function(event) {
		event.preventDefault();
		event.stopPropagation();

		var mylink = $(this);
		var myform = {"action": "remove_admin"};
		myform["gad_group_id"] = $(this).data("group-id");
		myform["gad_member_id"] = $(this).data("member-id");

		$.post("do_set_group_admin.php", myform, function(data) {
			if (data.ok) {
				mylink.parents("tr").remove();
			}
		}, "json");
	});
}

function saveGroup() {
	clearKeyup();
	var myform = $("#saveGroupForm");
	$.post(myform.attr("action"), myform.serialize(), function(data) {
		$("#success_group_groupAlert").parents(".container").show();
		$("#success_group_groupAlert").show().delay(2000).fadeOut(1000, function() {
			$(this).parents(".container").hide();
		});

		$("#group_id").val(data.group.the_id);
		$("#group_link").text(data.group.gre_label);
	}, "json");
}

function saveGroupFormHandlers() {
	$("#saveGroupForm").change(saveGroup);

	$("#saveGroupForm input[type=text]").keyup(function() {
		clearKeyup();
		keyupTimeoutId = setTimeout(saveGroup, 1500);
	});

	$("#saveGroupForm input[type=checkbox]").change(function() {
		saveGroup();
	});

	$("#saveGroupForm select").change(function() {
		saveGroup();
	});
}

$(function() {
	addGroupHandlers();
	savePowerHandlers();
	excludeHandlers();
	adminFormHandlers();
	saveGroupFormHandlers();
});
