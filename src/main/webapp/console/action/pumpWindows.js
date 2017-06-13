/**
 * Created by zhiwei on 2016/11/21.
 */
Ext.define('console.action.pumpWindows', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer',
        'console.store.pumpStore'
    ],

    id: 'pumpWindows',
    init: function () {
        this.launcher = {
            text: 'writer config',
            iconCls: 'icon-grid'
        };
    },

    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('pumpWindows');
        if (!win) {
            win = desktop.createWindow({
                id: 'pumpWindows',
                title: 'pump config',
                width: 650,
                height: 600,
                iconCls: 'icon-grid',
                animCollapse: false,
                constrainHeader: true,
                layout: "fit",
                items: [{
                    xtype: 'grid',
                    itemId: 'pumpList',
                    store: Ext.createWidget('pumpStore'),
                    columns: {
                        defaults: {
                            width: '40%'
                        },
                        items: [
                            new Ext.grid.RowNumberer(),
                            {
                                text: "pump code",
                                sortable: true,
                                dataIndex: 'code'
                            }, {
                                text: "pump name",
                                sortable: true,
                                dataIndex: 'name'
                            },
                            {
                                text: "status",
                                sortable: true,
                                dataIndex: 'status',
                                width: '15%',
                                renderer: function () {
                                    return "<img src='console/images/switch/on.png' style='width:60px;height:25px;cursor:pointer' onclick=method.start();>";
                                }
                            }
                        ]
                    }
                }]
            });
        }
        return win;
    }

});

var method = {
    start: function () {
        Ext.MessageBox.confirm('confirm', 'Are you sure?', function (opt) {
            if (opt == 'yes') {
                var row = Ext.getCmp('pumpWindows').child("#pumpList").getSelectionModel().selected.items;
                var data = row[0].data;
                var code = data.code;
                Ext.Ajax.request({
                    url: '/etl/pump/start/' + code,
                    method: 'PUT',
                    success: function (response, opts) {
                        Ext.Msg.alert('show result', "success!");
                    },
                    failure: function (response, opts) {
                        Ext.Msg.alert('show result', "fail");
                    }
                });
            }
        });
    }
};