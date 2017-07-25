@frappe.whitelist()
def get_widgets():

	# check first email address is exit or not.
	get_widget = frappe.db.sql("""select name from `tabWidget`""");
	return get_widget;
