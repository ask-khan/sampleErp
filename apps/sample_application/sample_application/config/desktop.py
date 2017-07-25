# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"module_name": "Sample Applications",
			"color": "grey",
			"icon": "(default 'octicon octicon-file-directory'): octicon octicon-book",
			"type": "module",
			"label": _("Sample Applications")
		}
	]
