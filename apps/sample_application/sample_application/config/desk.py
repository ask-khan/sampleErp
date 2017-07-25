from __future__ import unicode_literals
from frappe import _
import frappe
import json

@frappe.whitelist()
def get_widgets():

	# Declare an Array
	getWidgetData = []

	# Check first email address is exit or not.
	get_widget = frappe.db.sql("""Select tb.base_doctype, tb.size_x, tb.size_y, tb.widget_type, tb.function_name, tb.name, tb.default_time, tb.filter_options from `tabList Widgets` tb where tb.name not in (select widget_id from `tabUser Widgets` )""");


	# Check all widgets Data
	get_all_widget = frappe.db.sql("""Select base_doctype, size_x, size_y, widget_type, function_name, name, default_time, filter_options from `tabList Widgets`""")

	# Push data into array
	getWidgetData.append(get_widget);
	getWidgetData.append(get_all_widget);

	return getWidgetData

@frappe.whitelist()
def get_table_information():

	tableData = ''

	return  tableData


@frappe.whitelist()
def get_tasks():
	get_task_percentage = frappe.db.sql("""SELECT SUM( progress ) * 100 / ( ( select COUNT(*) from tabTask ) * 100 )  FROM `tabTask`""");
	return get_task_percentage;


@frappe.whitelist()
def insert_user_widget( title, filter, position, widgetId, refresh, type  ):

	user_data = frappe.new_doc("User Widgets")
 	user_data.widget_id = widgetId
 	user_data.title = title
 	user_data.refresh_time = refresh
 	user_data.filter = filter
 	user_data.user = frappe.session.user
 	user_data.position = position
	user_data.type = type

 	# user save.
 	user_data.save()


@frappe.whitelist()
def update_widget_position ( col, row, widgetNumber ):
	frappe.db.sql("""update `tabUser Widgets` set col= %s, row= %s where widget_id= %s""", (str(col), str(row), widgetNumber))



@frappe.whitelist()
def get_user_widget():

	userWidgetData = []
	usersWidget = frappe.get_list('User Widgets', {"owner": frappe.session.user})

	if len ( usersWidget ) > 0:
		for userWidget in usersWidget:
			completeWidgetUserData = {}
		 	widgetData = frappe.get_doc('User Widgets', userWidget['name'])

			completeWidgetData = frappe.get_doc('List Widgets',widgetData.widget_id)
			completeWidgetUserData.update({'list': completeWidgetData})
			completeWidgetUserData.update({'User': widgetData})
			userWidgetData.append( completeWidgetUserData )

		return userWidgetData
	else:
		return None

@frappe.whitelist()
def get_default_time_by_id( ids ):

	widgetData = frappe.get_doc('List Widgets',ids )
	return widgetData
	# check first email address is exit or not.
	# default_time = frappe.db.sql("""select default_time from `tabList Widgets` where name= %s""", (id));
	# return default_time;

@frappe.whitelist()
def delete_widgets( widgetNumber ):

	frappe.db.sql("""DELETE FROM `tabUser Widgets` WHERE widget_id= %s AND owner= %s""",(str(widgetNumber), str(frappe.session.user)))

	widgetData = frappe.db.sql("""Select base_doctype, size_x, size_y, widget_type, function_name, name, default_time from `tabList Widgets` WHERE name= %s""", (str(widgetNumber)) );

	return widgetData

@frappe.whitelist()
def get_total_amount():

	totalAmount = ''

	return totalAmount

@frappe.whitelist()
def get_progress_bar():

	progressBar = ''

	return progressBar

@frappe.whitelist()
def get_task_information_one():

	taskInformation = ''

	return taskInformation

@frappe.whitelist()
def get_status_information ():
	statusInformation = ''

	return statusInformation

@frappe.whitelist()
def bar_chart_information():
	data = [ ["January", 10], ["February", 8], ["March", 4], ["April", 13], ["May", 17], ["June", 9] ];

	return data

@frappe.whitelist()
def stark_chart_function():
	data = '';
	return data

@frappe.whitelist()
def large_bar_chart_function():
	data = ''
	return data

@frappe.whitelist()
def get_total_amount_one():
	return '';

@frappe.whitelist()
def get_total_amount_two():
	return '';

@frappe.whitelist()
def get_total_amount_three():
	return '';

@frappe.whitelist()
def upate_all_widget_position(data):

	widgetData = json.loads( data )

	if len( widgetData ) > 0  :
		for singleWidget in widgetData:

			frappe.db.sql("""update `tabUser Widgets` set col= %s, row= %s where widget_id= %s""",(str(singleWidget["y"]), str(singleWidget["x"]), singleWidget["widget"]))
	else:
		print 'Length is not zero'


@frappe.whitelist()
def upate_single_widget_position( data ):
	singleWidget = json.loads( data )
	frappe.db.sql("""update `tabUser Widgets` set col= %s, row= %s where widget_id= %s""", (str(singleWidget["y"]), str(singleWidget["x"]), singleWidget["widget"]))
