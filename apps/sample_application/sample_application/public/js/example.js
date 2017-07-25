$(function () {
    console.log('checafe');
    if ( window.location.hash == '' ) {

        // Onload Hide
        $(".widgetDrop").hide();
        $(".grid-stack").hide();

        // When desktop click.
        $(".desktop").click(function () {
            $(".widgetDrop").hide();
            $(".grid-stack").hide();
            $(".desktop-icon").show();
            $(".widget").removeClass('active');
            $(".desktop").addClass('active');
        });

        // When widget click.
        $(".widget").click(function () {
            $(".desktop-icon").hide();
            $(".widgetDrop").show();
            $(".grid-stack").show();
            $(".desktop").removeClass('active');
            $(".widget").addClass('active');
        });

        // Close Button
        $(document.body).on("click", ".close", function (e) {


            this.grid = $('.grid-stack').data('gridstack');
            $(this).closest("div").addClass("deleteWidget");

            e.preventDefault();
            var grid = $('.grid-stack').data('gridstack'),
            el = $(this).closest('.grid-stack-item')

            grid.removeWidget(el);


            // Delete Widgets Function Call
            delete_widget($(this).attr('data-widget'));
        });

        // Options
        this.options = {
            float: false,
            disableResize: true,
            resizable: { autoHide: true, handles: 'se'},
            autoposition: true
        };

        $('.grid-stack').gridstack(this.options);

        // Function call.
        update_dropdown();

        // Function call Upload user widget
        get_user_widget();


        /**
         * Insert widget user setting
         * @return {None} None
         */
        function get_user_widget() {

            frappe.call({
                method: 'sample_application.config.desk.get_user_widget',
                args: {
                    owner: 'Administrator'
                },
                callback: function (r) {
                    // Check if array is exit
                    //console.log( r );
                    if (typeof r.message != 'undefined' && r.message instanceof Array) {

                        for (var i = 0; i < r.message.length; i++) {

                            var position = {}
                            position.row = r.message[i].User.row;
                            position.col = r.message[i].User.col;

                            getWidgetDataCall(r.message[i].list.function_name, r.message[i].list.widget_type, r.message[i].list.size_x, r.message[i].list.size_y, r.message[i].list.name, r.message[i].list.default_time, false, position)
                        }
                    } else {
                        //console.log('else');
                    }

                }
            });
        }


        // Dropdown content
        $(document.body).on("click", ".dropdown-menu li ", function (e) {

            // Function call
            getWidgetData($(event.target).data('type'), $(event.target).data('functionname'), $(event.target).data('x'), $(event.target).data('y'), $(event.target).data('widget'), $(event.target).data('refresh'), $(event.target).data('filter'));

            $(this).closest("li").remove();
        });


        /**
         * Get widget data
         * @param {String} widgetsName
         * @param {String} functionName
         * @param {String} sizex
         * @param {String} sizey
         * @param {String} widgetsId
         * @param {String} refresh
         * @return {None} None
         */
        function getWidgetData(widgetsName, functionName, sizex, sizey, widgetsId, refresh, filter) {
            //console.log('In getWidgetData' + widgetsName);
            // if widgetsName is easyPieChart
            if (widgetsName == 'easyPieChart') {

                // Function Get Widget Data Call
                getWidgetDataCall(functionName, widgetsName, sizex, sizey, widgetsId, refresh, true, '', filter);

                // if widgetsName is informationTable
            } else if (widgetsName == 'informationTable') {

                // Function Get Widget Data Call
                getWidgetDataCall(functionName, widgetsName, sizex, sizey, widgetsId, refresh, true, '');

                // if widgetsName is showAmount
            } else if (widgetsName == 'showAmount' || widgetsName == 'showAmountOne' || widgetsName == 'showAmountTwo' || widgetsName == 'showAmountThree' || widgetsName == 'showAmountFour' || widgetsName == 'progressBar' || widgetsName == 'taskInformationTable' || widgetsName == 'statusInformationTable' || widgetsName == 'barChart' || widgetsName == 'stackChart' || widgetsName == 'largeBarChart') {

                // Function Get Widget Data Call
                getWidgetDataCall(functionName, widgetsName, sizex, sizey, widgetsId, refresh, true, '');
            }
        }


        /**
         * Update Dropdown
         * @return None
         */
        function update_dropdown() {

            frappe.call({
                method: 'sample_application.config.desk.get_widgets',
                args: {
                    owner: "Administrator"
                },
                callback: function (r) {
                    //console.log(r);
                    var htmlContent = '';

                    // Add html content.
                    for (var i = 0; i < r.message[0].length; i++) {
                        htmlContent = htmlContent + '<li class="searchTerm"><a href="#" data-type="' + r.message[0][i][3] + '" data-x="' + r.message[0][i][1] + '" data-y="' + r.message[0][i][2] + '" data-widget="' + r.message[0][i][5] + '" data-functionName="' + r.message[0][i][4] + '" data-refresh="' + r.message[0][i][6] +   '" data-filter="' + r.message[0][i][7] + '" >' + r.message[0][i][0] + '</a></li>'
                    }

                    // Append html content in dropdown.
                    $(".appendDropdown").append(htmlContent);
                    //refresh_widget(r.message[1])
                }
            });
        }

        /**
         * Get widget data call
         * @param {String} widgetsName
         * @param {String} functionName
         * @param {String} sizex
         * @param {String} sizey
         * @param {String} widgetsId
         * @param {String} refresh
         * @return {None} None
         */
        function getWidgetDataCall(functionName, widgetsName, sizex, sizey, widgetsId, refresh, checkInsert, widgetPositions, filter) {

            var functionPath = 'sample_application.config.desk.' + functionName;
            var getPercentage = '';

            return frappe.call({
                method: functionPath,
                args: {
                    owner: "Administrator"
                },
                callback: function (r) {
                    var data = {}

                    //console.log(r.message.length);
                    if (widgetsName == 'easyPieChart') {

                        var today = new Date();
                        var h = today.getHours();
                        var m = today.getMinutes();
                        var s = today.getSeconds();


                        if (r.message[0][0] == null) {
                            data.percentage = 0
                        } else {
                            //data.percentage = parseInt(r.message[0][0]);
                            data.percentage = 0;
                        }
                        data.filter = filter
                        data.taskName = 'Task Name';
                        data.taskNext = 'Task Next';
                        data.time = h + ':' + m;
                    } else if (widgetsName == 'informationTable' || widgetsName == 'progressBar' || widgetsName == 'taskInformationTable' || widgetsName == 'statusInformationTable') {
                        data = ''
                    } else if (widgetsName == 'barChart') {
                        data = r.message
                    } else if (widgetsName == 'stackChart') {
                        data = ''
                    } else if (widgetsName == 'largeBarChart') {
                        data = ''
                    }

                    // Render Html Widget Function Call.
                    var htmlContent = renderHtmlWidgets(widgetsName, data, widgetsId);

                    if (htmlContent) {

                        add_user_widget(htmlContent, data, widgetsId, sizex, sizey, widgetsName, widgetPositions)

                        widgetPosition = '';
                        if (widgetsName === 'easyPieChart' && checkInsert == true) {
                            var data = {};
                            data.title = 'Task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            // Insert widget user setting
                            insertWidgetUserSetting(data)

                        } else if (widgetsName === 'informationTable' && checkInsert == true) {
                            var data = {}

                            data.title = 'Task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            // Insert widget user setting
                            insertWidgetUserSetting(data)
                        } else if (widgetsName === 'showAmount' && checkInsert == true) {
                            var data = {}

                            data.title = 'Task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            // Insert widget user setting
                            insertWidgetUserSetting(data)
                        } else if (widgetsName === 'showAmountOne' && checkInsert == true) {
                            var data = {}

                            data.title = 'Task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            // Insert widget user setting
                            insertWidgetUserSetting(data)
                        } else if (widgetsName === 'showAmountTwo' && checkInsert == true) {
                            var data = {}

                            data.title = 'Task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            // Insert widget user setting
                            insertWidgetUserSetting(data)
                        } else if (widgetsName === 'showAmountThree' && checkInsert == true) {
                            var data = {}

                            data.title = 'Task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            // Insert widget user setting
                            insertWidgetUserSetting(data)
                        } else if (widgetsName === 'progressBar' && checkInsert == true) {
                            var data = {}

                            data.title = 'Task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            // Insert widget user setting
                            insertWidgetUserSetting(data)
                        } else if (widgetsName == 'tableInformation' && checkInsert == true) {
                            var data = {}

                            data.title = 'Task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            // Insert widget user setting
                            insertWidgetUserSetting(data)

                        } else if (widgetsName == 'taskInformationTable' && checkInsert == true) {

                            var data = {}

                            data.title = 'Task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            // Insert widget user setting
                            insertWidgetUserSetting(data)
                        } else if (widgetsName == 'statusInformationTable' && checkInsert == true) {

                            var data = {}

                            data.title = 'Task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            // Insert widget user setting
                            insertWidgetUserSetting(data)
                        } else if (widgetsName == 'barChart' && checkInsert == true) {
                            var data = {}

                            data.title = 'task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            insertWidgetUserSetting(data)
                        } else if (widgetsName == 'stackChart' && checkInsert == true) {
                            var data = {}

                            data.title = 'task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            insertWidgetUserSetting(data)
                        } else if (widgetsName == 'largeBarChart' && checkInsert == true) {
                            var data = {}

                            data.title = 'task Name';
                            data.filter = ['First Month', 'Last Month']
                            data.position = widgetPosition;
                            data.widgetId = widgetsId;
                            data.refresh = refresh;
                            data.widgets = widgetsName;

                            insertWidgetUserSetting(data)
                        }

                    }
                }
            });

        }

        /**
         * Insert widget user setting
         * @param {String} widgetData
         * @return {None} None
         */

        function insertWidgetUserSetting(widgetData) {

            frappe.call({
                method: 'sample_application.config.desk.insert_user_widget',
                args: {
                    title: widgetData.title,
                    filter: widgetData.filter,
                    position: widgetData.position,
                    widgetId: widgetData.widgetId,
                    refresh: widgetData.refresh,
                    type: widgetData.widgets
                },
                callback: function (r) {
                    // Function call
                    saveWidgetSize();
                }

            });
        }

        /**
         * Render html widgets
         * @param {String} widgetsName
         * @param {String} data
         * @return {String} htmlcontent
         */

        function renderHtmlWidgets(widgetsName, data, widgetId) {

            if (widgetsName == 'easyPieChart') {
                var contentHtml = '<button type="button" class="close" aria-label="Close" data-widget=' + '"' + widgetId + '"' + '> <span aria-hidden="true">&times;</span> </button><h5 class="heading">' + data.taskName + '</h5><span class="chart" data-percent=' + '"' + data.percentage + '"' + '><span class="percent">' + parseInt(data.percentage) + '</span></span><div class="remain"><strong>5</strong> remainning</div><div class="nextTask">Next task:' + data.time + ' Thu</div>'
                return contentHtml
            } else if (widgetsName == 'pieChart') {
                var contentHtml = '<div class="col-sm-4"> <div class="panel panel-card p m-b-sm"> <h5 class="no-margin m-b">Sells</h5> <div class="text-center" ng-controller="ChartCtrl"> <div ui-jp="plot" ui-options=" [{label:\'Series 1\', data: 45}, {label:\'Series 2\', data: 5}, {label:\'Series 3\', data: 30}, {label:\'Series 4\', data: 20}], { series: { pie: { show: true, innerRadius: 0.4, stroke: { width: 3 }, label: { show: true, threshold: 0.05 } } }, colors: [\'#2196f3\',\'#ffc107\',\'#4caf50\',\'#7e57c2\'], grid: { hoverable: true, clickable: true, borderWidth: 0, color: \'#ccc\' }, tooltip: true, tooltipOpts: { content: \'%s: %p.0%\' } } " style="height: 168px; padding: 0px; position: relative;"><canvas class="flot-base" width="377" height="168" style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 377px; height: 168px;"></canvas><canvas class="flot-overlay" width="377" height="168" style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 377px; height: 168px;"></canvas><div class="legend"><div style="position: absolute; width: 64px; height: 88px; top: 5px; right: 5px; background-color: rgb(255, 255, 255); opacity: 0.85;"> </div><table style="position:absolute;top:5px;right:5px;;font-size:smaller;color:#ccc"><tbody><tr><td class="legendColorBox"><div style="border:1px solid #ccc;padding:1px"><div style="width:4px;height:0;border:5px solid rgb(33,150,243);overflow:hidden"></div></div></td><td class="legendLabel">Series 1</td></tr><tr><td class="legendColorBox"><div style="border:1px solid #ccc;padding:1px"><div style="width:4px;height:0;border:5px solid rgb(255,193,7);overflow:hidden"></div></div></td><td class="legendLabel">Series 2</td></tr><tr><td class="legendColorBox"><div style="border:1px solid #ccc;padding:1px"><div style="width:4px;height:0;border:5px solid rgb(76,175,80);overflow:hidden"></div></div></td><td class="legendLabel">Series 3</td></tr><tr><td class="legendColorBox"><div style="border:1px solid #ccc;padding:1px"><div style="width:4px;height:0;border:5px solid rgb(126,87,194);overflow:hidden"></div></div></td><td class="legendLabel">Series 4</td></tr></tbody></table></div><span class="pieLabel" id="pieLabel0" style="position: absolute; top: 57px; left: 205px;"><div style="font-size:x-small;text-align:center;padding:2px;color:rgb(33,150,243);">Series 1<br>45%</div></span><span class="pieLabel" id="pieLabel1" style="position: absolute; top: 136px; left: 148px;"><div style="font-size:x-small;text-align:center;padding:2px;color:rgb(255,193,7);">Series 2<br>5%</div></span><span class="pieLabel" id="pieLabel2" style="position: absolute; top: 108px; left: 82px;"><div style="font-size:x-small;text-align:center;padding:2px;color:rgb(76,175,80);">Series 3<br>30%</div></span><span class="pieLabel" id="pieLabel3" style="position: absolute; top: 13px; left: 97px;"><div style="font-size:x-small;text-align:center;padding:2px;color:rgb(126,87,194);">Series 4<br>20%</div></span></div> </div> <div class="m-t-xs"> <div class="font-bold">$432,000</div> <small class="text-muted">This month</small> </div> </div> </div>'
                return contentHtml
            } else if (widgetsName == 'sparkLine') {
                var contentHtml = '<div class="col-sm-4"> <div class="panel panel-card"> <div class="p"> <label class="md-switch pull-right" ng-init="showData=false"> <input type="checkbox" ng-model="showData" class="has-value"> <i class="green"></i> </label> <span>Monitor</span> <i class="fa fa-caret-up text-success"></i><span class="text-xs text-muted m-l-xs">1.5%</span> </div> <div class="panel-body"> <div ui-jp="plot" ui-refresh="showData" ui-options=" [ { data: [[1, 7.5], [2, 7.5], [3, 5.7], [4, 8.9], [5, 10], [6, 7], [7, 9], [8, 13], [9, 7], [10, 6]], points: { show: true, radius: 4, lineWidth: 3, fillColor: \'#7e57c2\'}, lines: { show: true, lineWidth: 0, fill: 0.5, fillColor: \'#7e57c2\' }, color:\'#fff\' } ], { series: { shadowSize: 0 }, xaxis: { show: true, font: { color: \'#ccc\' }, position: \'bottom\' }, yaxis:{ show: true, font: { color: \'#ccc\' }}, grid: { hoverable: true, clickable: true, borderWidth: 0, color: \'#ccc\' }, tooltip: true, tooltipOpts: { content: \'%x.0 is %y.4\', defaultTheme: false, shifts: { x: 0, y: -40 } } } " style="height: 198px; padding: 0px; position: relative;"> <canvas class="flot-base" width="361" height="198" style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 361px; height: 198px;"></canvas><div class="flot-text" style="position: absolute; top: 0px; left: 0px; bottom: 0px; right: 0px; font-size: smaller; color: rgb(84, 84, 84);"><div class="flot-x-axis flot-x1-axis xAxis x1Axis" style="position: absolute; top: 0px; left: 0px; bottom: 0px; right: 0px; display: block;"><div style="position: absolute; max-width: 60px; top: 185px; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 11px; line-height: 13px; font-family: Roboto, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(204, 204, 204); left: 51px; text-align: center;">2</div><div style="position: absolute; max-width: 60px; top: 185px; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 11px; line-height: 13px; font-family: Roboto, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(204, 204, 204); left: 125px; text-align: center;">4</div><div style="position: absolute; max-width: 60px; top: 185px; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 11px; line-height: 13px; font-family: Roboto, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(204, 204, 204); left: 199px; text-align: center;">6</div><div style="position: absolute; max-width: 60px; top: 185px; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 11px; line-height: 13px; font-family: Roboto, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(204, 204, 204); left: 273px; text-align: center;">8</div><div style="position: absolute; max-width: 60px; top: 185px; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 11px; line-height: 13px; font-family: Roboto, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(204, 204, 204); left: 344px; text-align: center;">10</div></div><div class="flot-y-axis flot-y1-axis yAxis y1Axis" style="position: absolute; top: 0px; left: 0px; bottom: 0px; right: 0px; display: block;"><div style="position: absolute; top: 174px; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 11px; line-height: 13px; font-family: Roboto, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(204, 204, 204); left: 6px; text-align: right;">0</div><div style="position: absolute; top: 117px; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 11px; line-height: 13px; font-family: Roboto, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(204, 204, 204); left: 6px; text-align: right;">5</div><div style="position: absolute; top: 61px; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 11px; line-height: 13px; font-family: Roboto, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(204, 204, 204); left: 0px; text-align: right;">10</div><div style="position: absolute; top: 5px; font-style: normal; font-variant: normal; font-weight: 400; font-stretch: normal; font-size: 11px; line-height: 13px; font-family: Roboto, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(204, 204, 204); left: 0px; text-align: right;">15</div></div></div><canvas class="flot-overlay" width="361" height="198" style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 361px; height: 198px;"></canvas></div> </div> </div> </div>'
                return contentHtml
            } else if (widgetsName == 'groupTable') {
                var contentHtml = '<div class="col-sm-8"> <div class="panel panel-default"> <div class="panel-heading">Stats</div> <table class="table table-striped m-b-none"> <thead> <tr> <th style="width:60px;" class="text-center">Graph</th> <th>Item</th> <th style="width:90px;"></th> </tr> </thead> <tbody> <tr> <td> <div ng-init="data1=[ 16,15,15,14,17,18,16,15,16 ]" ui-jp="sparkline" ui-options="[ 16,15,15,14,17,18,16,15,16 ], {type:\'bar\', height:19, barWidth:4, barSpacing:2, barColor:\'#4caf50\'}" class="sparkline inline"><canvas width="52" height="19" style="display: inline-block; width: 52px; height: 19px; vertical-align: top;"></canvas></div> </td> <td>App downloads</td> <td class="text-success"> <i class="fa fa-level-up"></i> 40% </td> </tr> <tr> <td class="text-center"> <div ng-init="data2=[ 60,30,10 ]" ui-jp="sparkline" ui-options="[ 60,30,10 ], {type:\'pie\', height:19, sliceColors:[\'#2196f3\',\'#fff\',\'#ffc107\']}" class="sparkline inline"><canvas width="19" height="19" style="display: inline-block; width: 19px; height: 19px; vertical-align: top;"></canvas></div> </td> <td>Social connection</td> <td class="text-success"> <i class="fa fa-level-up"></i> 20% </td> </tr> <tr> <td> <i class="fa fa-line-chart"></i> </td> <td>Revenue</td> <td class="text-warning"> <i class="fa fa-level-down"></i> 5% </td> </tr> <tr> <td> <div ng-init="data4=[ 16,15,15,14,17,18,16,15,16 ]" ui-jp="sparkline" ui-options="[ 16,15,15,14,17,18,16,15,16 ], {type:\'discrete\', height:19, width:60, lineColor:\'#4caf50\'}" class="sparkline inline"><canvas width="60" height="19" style="display: inline-block; width: 60px; height: 19px; vertical-align: top;"></canvas></div> </td> <td>Customer increase</td> <td class="text-danger"> <i class="fa fa-level-down"></i> 20% </td> </tr> </tbody> </table> </div> </div>'
                return contentHtml
            } else if (widgetsName == 'informationTable') {
                var contentHtml = '<button type="button" class="close" aria-label="Close" data-widget=' + '"' + widgetId + '"' + '> <span aria-hidden="true">&times;</span> </button><div class="phead ddb dd" style="color: #000000;margin-right: 350px;height: 40px;padding-top: 15px;">Infomation<ul style="float: right;"></ul></div><table><tr> <td> <i class="fa fa-fw fa-circle m-r-sm text-info"></i>Alfreds Futterkiste</td> <td>293,200</td></tr><tr> <td> <i class="fa fa-fw fa-circle m-r-sm text-info"></i>Alfreds Futterkiste</td> <td>293,200</td></tr> <tr> <td> <i class="fa fa-fw fa-circle m-r-sm text-info"></i>Alfreds Futterkiste</td> <td>293,200</td></tr><tr> <td> <i class="fa fa-fw fa-circle m-r-sm text-info"></i>Alfreds Futterkiste</td> <td>293,200</td></tr><tr> <td> <i class="fa fa-fw fa-circle m-r-sm text-info"></i>Alfreds Futterkiste</td> <td>293,200</td></tr></table>'
                return contentHtml
            } else if (widgetsName == 'showAmount' || widgetsName == 'showAmountOne' || widgetsName == 'showAmountTwo' || widgetsName == 'showAmountThree') {
                var contentHtml = '<button type="button" class="close" aria-label="Close" data-widget=' + '"' + widgetId + '"' + '> <span aria-hidden="true">&times;</span> </button><h5 class="heading-member">Members</h5><div class="panel panel-card"><div class="panel-body text-center"> <div class="m-v-lg"> Total accounts <div class="h2 text-success font-bold">3,421,100</div> </div> </div></div>'
                return contentHtml
            } else if (widgetsName == 'progressBar') {
                var contentHtml = '<button type="button" class="close" aria-label="Close" data-widget=' + '"' + widgetId + '"' + '> <span aria-hidden="true">&times;</span> </button><div class="panel panel-card"> <h5 class="heading"> Members </h5> <div class="panel-body text-center"> <div class="m-v-lg"> Total accounts <div class="h2 text-success font-bold">3,421,100</div> </div> </div> <div class="b-t b-light p-progress" style=" margin-top: 70px; "> Composite <div class="progress progress-striped progress-sm r m-v-sm"> <div class="progress-bar green" style="width:30%">30%</div> <div class="progress-bar amber" style="width:20%">20%</div> </div> </div> </div>';
                return contentHtml
            } else if (widgetsName == 'taskInformationTable') {
                var contentHtml = '<button type="button" class="close" aria-label="Close" data-widget=' + '"' + widgetId + '"' + '> <span aria-hidden="true">&times;</span> </button><div class="panel panel-default"> <div class="panel-heading-task"> <span class="label bg-danger pull-right m-t-xs">4 left</span> Tasks </div> <table class="table table-striped m-b-none"> <thead> <tr> <th>Progress</th> <th>Item</th> </tr> </thead> <tbody> <tr> <td> <div class="progress progress-sm progress-striped active no-margin m-v-xs"> <div class="progress-bar bg-success" data-toggle="tooltip" data-original-title="80%" style="width: 80%"></div> </div> </td> <td>App prototype design</td> </tr> <tr> <td> <div class="progress progress-sm no-margin m-v-xs"> <div class="progress-bar bg-info" data-toggle="tooltip" data-original-title="40%" style="width: 40%"></div> </div> </td> <td>Design documents</td> </tr> <tr> <td> <div class="progress progress-sm no-margin m-v-xs"> <div class="progress-bar bg-warning" data-toggle="tooltip" data-original-title="20%" style="width: 20%"></div> </div> </td> <td>UI toolkit</td> </tr> <tr> <td> <div class="progress progress-sm no-margin m-v-xs"> <div class="progress-bar bg-danger" data-toggle="tooltip" data-original-title="15%" style="width: 15%"></div> </div> </td> <td>Testing</td> </tr> </tbody> </table> </div>'
                return contentHtml
            } else if (widgetsName == 'statusInformationTable') {
                var contentHtml = '<button type="button" class="close" aria-label="Close" data-widget=' + '"' + widgetId + '"' + '> <span aria-hidden="true">&times;</span> </button><div class="panel panel-default"> <div class="panel-heading">Stats</div> <table class="table table-striped m-b-none"> <thead> <tr> <th style="width:60px;" class="text-center">Graph</th> <th>Item</th> <th style="width:90px;"></th> </tr> </thead> <tbody> <tr> <td><i class="fa fa-area-chart"></i></td> <td>App downloads</td> <td class="text-success"> <i class="fa fa-level-up"></i> 40% </td> </tr> <tr> <td class="text-center"> <i class="fa fa-bar-chart"></i></td> <td>Social connection</td> <td class="text-success"> <i class="fa fa-level-up"></i> 20% </td> </tr> <tr> <td><i class="fa fa-line-chart"></i></td> <td>Revenue</td> <td class="text-warning"> <i class="fa fa-level-down"></i> 5% </td> </tr> <tr> <td><i class="fa fa-pie-chart"></i></td> <td>Customer increase</td> <td class="text-danger"> <i class="fa fa-level-down"></i> 20% </td> </tr> </tbody> </table> </div>'
                return contentHtml
            } else if (widgetsName == 'barChart') {
                var contentHtml = '<button type="button" class="close" aria-label="Close" data-widget=' + '"' + widgetId + '"' + '> <span aria-hidden="true">&times;</span> </button><h5 class="bar-chart-heading">Bar Chart</h5><div id="chart_div" style="height: 400px; margin-top: 10px"></div>';
                return contentHtml
            } else if (widgetsName == 'stackChart') {
                var contentHtml = '<button type="button" class="close" aria-label="Close" data-widget=' + '"' + widgetId + '"' + '> <span aria-hidden="true">&times;</span> </button><h5 class="bar-spack-heading">Stack Chart</h5><div id="stack_div" style="margin-top: 10px"></div>';
                return contentHtml
            } else if (widgetsName == 'largeBarChart') {
                var contentHtml = '<button type="button" class="close" aria-label="Close" data-widget=' + '"' + widgetId + '"' + '> <span aria-hidden="true">&times;</span> </button><h5 class="bar-spack-heading">Bar Chart</h5><div id="largeBarChart" style="margin-top: 10px"></div>';
                return contentHtml
            }
        }


        /**
         * Add user widget
         * @param {String} htmlContent
         * @param {String} data
         * @param {String} sizex
         * @param {String} sizey
         * @param {String} widgetsId
         * @return {Json} widgetPosition
         */
        function add_user_widget(htmlContent, data, widgetsId, width, height, widgetsName, widgetPosition) {

            this.grid = $('.grid-stack').data('gridstack');

            if (widgetPosition === '') {
                // Add Widgets Function
                this.grid.addWidget($('<div class="grid-stack-item"><div class="grid-stack-item-content" data-widget="' + widgetsId + '"' + '>' + htmlContent + '</div></div>'),
                    0, 0, width, height, true);

            } else {

                // Add Widgets Function
                this.grid.addWidget( $( '<div class="grid-stack-item"><div class="grid-stack-item-content" data-widget="' + widgetsId + '"' + '>' + htmlContent + '</div></div>' ), widgetPosition.row, widgetPosition.col, width, height);

            }

            if (widgetsName === 'easyPieChart') {
                //Get Widget Position.

                //var widgetPosition = gridster.serialize();

                setTimeout(function () {
                        $('.chart').easyPieChart({

                            easing: 'easeOutBounce',
                            lineWidth: 12,
                               trackColor: '#f1f2f3',
                              barColor: '#4caf50',
                              scaleColor: '#fff',
                               size: 167,
                               lineCap: 'butt',
                              color: '',
                               animate: 3000,
                                 rotate: 270,

                            onStep: function (from, to, percent) {
                                $(this.el).find('.percent').text(Math.round(percent));
                            }

                        });
                }, 500);


            } else if (widgetsName === 'informationTable' || widgetsName === 'showAmount' || widgetsName == 'showAmountOne' || widgetsName == 'showAmountTwo' || widgetsName == 'showAmountThree' || widgetsName === 'progressBar' || widgetsName == 'taskInformationTable' || widgetsName == 'statusInformationTable') {

            } else if (widgetsName == 'barChart') {

                google.charts.load('current', {packages: ['corechart', 'bar']});
                google.charts.setOnLoadCallback(drawBarChart);

            } else if (widgetsName == 'stackChart') {

                google.charts.load('current', {packages: ['corechart', 'bar']});
                google.charts.setOnLoadCallback(drawStackChart);

            } else if (widgetsName == 'largeBarChart') {
                google.charts.load('current', {packages: ['corechart', 'bar']});
                google.charts.setOnLoadCallback(largeBarChart);

            }
        }

        /**
         * Delete Widgets
         * @param {String} widgetsNumber
         * @return {String} None
         */
        function delete_widget(widgetsNumber) {
            frappe.call({
                method: 'sample_application.config.desk.delete_widgets',
                args: {
                    widgetNumber: widgetsNumber

                },
                callback: function (r) {

                    var htmlContent
                    htmlContent = '<li class="searchTerm"><a href="#" data-type="' + r.message[0][3] + '" data-x="' + r.message[0][1] + '" data-y="' + r.message[0][2] + '" data-widget="' + r.message[0][5] + '" data-functionName="' + r.message[0][4] + '" data-refresh="' + r.message[0][6] + '"' + ' >' + r.message[0][0] + '</a></li>'

                    // Append html content in dropdown.
                    $(".appendDropdown").prepend(htmlContent);

                }
            });
        }

        /**
         * Draw Stack Chart
         * @return {String} None
         */
        function drawStackChart() {
            // Create google visualization
            var data = google.visualization.arrayToDataTable([
                ['Genre', 'Fantasy & Sci Fi', 'Romance', 'Mystery/Crime', 'General',
                'Western', 'Literature', { role: 'annotation' } ],
                ['2010', 10, 24, 20, 32, 18, 5, ''],
                ['2020', 16, 22, 23, 30, 16, 9, ''],
                ['2030', 28, 19, 29, 30, 12, 13, '']
            ]);

            // Create material options
            var options = {
                width: 560,
                height: 275,
                chartArea:{left:20, right:0,width:"100%",height:"70%"},
                legend: { position: 'top', maxLines: 4 },
                bar: { groupWidth: '50%' },
                isStacked: true
            };

            // Initialize chart
            var chart = new google.charts.Bar(document.getElementById('stack_div'));
            chart.draw(data, google.charts.Bar.convertOptions(options));
        }

        /**
         * Delete Widgets
         * @param {String} widgetsNumber
         * @return {String} None
         */
        function largeBarChart () {

            // Create google visualization
            var data = google.visualization.arrayToDataTable([
                ['Galaxy', 'Distance', 'Brightness'],
                ['Canis Major Dwarf', 8000, 23.3],
                ['Sagittarius Dwarf', 24000, 4.5],
                ['Lg. Magellanic Cloud', 50000, 0.9],
                ['Bootes I', 60000, 13.1]
            ]);

            // Create material options
            var materialOptions = {
                width: 890,
                height: 450,
                chart: {
                    title: '',
                    subtitle: ''
                },
                series: {
                    0: {axis: 'distance'}, // Bind series 0 to an axis named 'distance'.
                    1: {axis: 'brightness'} // Bind series 1 to an axis named 'brightness'.
                },
                axes: {
                    y: {
                        distance: {label: 'parsecs'}, // Left y-axis.
                        brightness: {side: 'right', label: 'apparent magnitude'} // Right y-axis.
                    }
                }
            };

            // Initialize chart
            var chart = new google.charts.Bar(document.getElementById('largeBarChart'));
            chart.draw(data, google.charts.Bar.convertOptions(materialOptions));
       }


        /**
         * Draw Bar Chart
         * @return {String} None
         */
        function drawBarChart() {
            // Create google visualization
            var data = google.visualization.arrayToDataTable([
                ['Galaxy', 'Distance', 'Brightness'],
                ['Canis Major Dwarf', 8000, 23.3],
                ['Sagittarius Dwarf', 24000, 4.5],
                ['Ursa Major II Dwarf', 30000, 14.3],
                ['Lg. Magellanic Cloud', 50000, 0.9],
                ['Bootes I', 60000, 13.1]
            ]);

            // Create material options
            var materialOptions = {
                width: 590,
                height: 280,
                chart: {
                    title: '',
                    subtitle: ''
                },
                series: {
                    0: { axis: 'distance' }, // Bind series 0 to an axis named 'distance'.
                    1: { axis: 'brightness' } // Bind series 1 to an axis named 'brightness'.
                },
                axes: {
                    y: {
                        distance: {label: 'parsecs'}, // Left y-axis.
                        brightness: {side: 'right', label: 'apparent magnitude'} // Right y-axis.
                    }
                }
            };

            // Initialize chart
            var chart = new google.charts.Bar(document.getElementById('chart_div'));
            chart.draw(data, google.charts.Bar.convertOptions(materialOptions));
        }

        /**
         * Save Widget Size
         * @return {String} None
         */
        function saveWidgetSize () {

            this.serializedData = _.map($('.grid-stack > .grid-stack-item:visible'), function (el) {
                el = $(el);
                var widgetData = el.children('.grid-stack-item-content').attr("data-widget");
                var node = el.data('_gridstack_node');

                return {
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height,
                    widget: widgetData
                };
            }, this);

            var widgetData = JSON.stringify(this.serializedData, null, '    ');

            frappe.call({
                method: 'sample_application.config.desk.upate_all_widget_position',
                args: {
                    data: widgetData
                },
                callback: function (r) {


                }
            });
        }

        $('.grid-stack').on('dragstop', function(event, ui) {
                var element = $(event.target);
                var node = element.data('_gridstack_node');
                var widgetId = element.children('.grid-stack-item-content').attr("data-widget");

                var widgetData = {
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height,
                    widget: widgetId
                }
                console.log( widgetData );
                frappe.call({
                method: 'sample_application.config.desk.upate_single_widget_position',
                args: {
                    data: widgetData
                },
                callback: function (r) {


                }
            });

        });

    }



});