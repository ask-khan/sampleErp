frappe.ui.toggle_like_pos = function($btn, doctype, name, callback) {
	var add = $btn.children("i").hasClass("not-liked") ? "Yes" : "No";
	// disable click
	$btn.css('pointer-events', 'none');

	frappe.call({
		method: "frappe.desk.like.toggle_like",
		quiet: true,
		args: {
			doctype: doctype,
			name: name,
			add: add,
		},
		callback: function(r) {
			// renable click
			$btn.css('pointer-events', 'auto');

			if(!r.exc) {
				// update in all local-buttons
				var action_buttons = $('.like-action[data-name="'+ name.replace(/"/g, '\"')
					+'"][data-doctype="'+ doctype.replace(/"/g, '\"')+'"]');

				if(add==="Yes") {
					action_buttons.removeClass("not-liked text-extra-muted");
				} else {
					action_buttons.addClass("not-liked text-extra-muted");
				}

				// update in locals (form)
				var doc = locals[doctype] && locals[doctype][name];
				if(doc) {
					var liked_by = JSON.parse(doc._liked_by || "[]"),
						idx = liked_by.indexOf(user);
					if(add==="Yes") {
						if(idx===-1)
							liked_by.push(user);
					} else {
						if(idx!==-1) {
							liked_by = liked_by.slice(0,idx).concat(liked_by.slice(idx+1))
						}
					}
					doc._liked_by = JSON.stringify(liked_by);
				}

				if(callback) {
					callback();
				}
			}
		}
	});
};
