/**
 * Created by zhiwei on 2016/11/21.
 */
Ext.define('console.action.extractWindows', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer',
        'console.store.extractStore',
        'console.store.statusStore'
    ],

    id: 'extractWindows',
    init: function () {
        this.launcher = {
            text: 'writer config',
            iconCls: 'icon-grid'
        };
    },

    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('extractWindows');
        if (!win) {
            win = desktop.createWindow({
                id: 'extractWindows',
                title: 'extract config',
                width: 900,
                height: 600,
                iconCls: 'icon-grid',
                animCollapse: false,
                constrainHeader: true,
                layout: "fit",
                items: [{
                    xtype: 'grid',
                    itemId: 'extractList',
                    store: Ext.createWidget('extractStore'),
                    columns: {
                        defaults: {
                            width: '15%'
                        },
                        items: [
                            new Ext.grid.RowNumberer(),
                            {
                                text: "extract code",
                                sortable: true,
                                dataIndex: 'code'
                            }, {
                                text: "extract name",
                                sortable: true,
                                dataIndex: 'name'
                            }, {
                                text: "distribute script",
                                sortable: true,
                                dataIndex: 'distributeScript'
                            }, {
                                text: "status",
                                sortable: true,
                                flex: 1,
                                dataIndex: 'status',
                                renderer: function (val) {
                                    if (val || val == "true") {
                                        return "enable";
                                    } else {
                                        return "disable";
                                    }
                                }
                            }
                        ]
                    }
                }],
                tbar: [{
                    text: 'add',
                    iconCls: 'add',
                    tooltip: 'add a new extract config',
                    handler: this.add
                }, '-', {
                    text: 'modify',
                    tooltip: 'modify options',
                    iconCls: 'option',
                    handler: this.option
                }, '-', {
                    text: 'remove',
                    tooltip: 'remove the selected item',
                    iconCls: 'remove',
                    handler: this.remove
                }, '-', {
                    text: 'refresh',
                    tooltip: 'refresh data list',
                    iconCls: 'refresh',
                    handler: this.refresh
                }]
            });
        }
        return win;
    },

    add: function () {
        Ext.create('Ext.window.Window', {
            modal: true,
            title: 'add extract config',
            items: [{
                xtype: 'form',
                width: 700,
                height: 500,
                autoScroll: true,
                defaults: {
                    labelAlign: 'top',
                    margin: '10 10 10 10',
                    xtype: 'textfield',
                    labelWidth: 200,
                    width: 650
                },
                items: [{
                    name: 'code',
                    fieldLabel: 'extract code',
                    allowBlank: false
                }, {
                    name: 'name',
                    fieldLabel: 'extract name',
                    allowBlank: false
                }, {
                    xtype: 'textarea',
                    name: 'distributeScript',
                    height: 280,
                    fieldLabel: 'distribute script',
                    allowBlank: false
                }],
                buttons: [{
                    text: 'reset',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                }, {
                    text: 'commit',
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                url: 'extract/add',
                                success: function (form, action) {
                                    Ext.Msg.alert('tips', 'add success', function () {
                                        form.owner.ownerCt.close();
                                        Ext.getCmp('extractWindows').child("#extractList").getStore().reload();
                                    }, this);
                                },
                                failure: function (form, action) {
                                    var res = Ext.decode(action.response.responseText);
                                    Ext.Msg.alert('tips', res.failure);
                                }
                            });
                        }
                    }
                }]
            }]
        }).show();
    },


    option: function () {
        var row = this.ownerCt.ownerCt.query('grid')[0].getSelectionModel().selected.items;
        if (row.length == 0) {
            Ext.Msg.alert('', 'need to select a line of records!');
            return;
        }
        var data = row[0].data;
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            title: 'modify extract config',
            items: [{
                xtype: 'form',
                width: 700,
                height: 550,
                autoScroll: true,
                defaults: {
                    labelAlign: 'top',
                    margin: '10 10 10 10',
                    xtype: 'textfield',
                    labelWidth: 200,
                    width: 650
                },
                items: [{
                    name: 'code',
                    fieldLabel: 'extract code',
                    allowBlank: false
                }, {
                    name: 'name',
                    fieldLabel: 'extract name',
                    allowBlank: false
                }, {
                    xtype: 'textarea',
                    name: 'distributeScript',
                    height: 280,
                    fieldLabel: 'distribute script',
                    allowBlank: false
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'status',
                    name: 'status',
                    editable: false,
                    store: Ext.createWidget("statusStore"),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    allowBlank: false
                }],
                buttons: [{
                    text: 'reset',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                }, {
                    text: 'commit',
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                url: 'extract/modify',
                                success: function (form, action) {
                                    Ext.Msg.alert('tips', 'option success', function () {
                                        form.owner.ownerCt.close();
                                        Ext.getCmp('extractWindows').child("#extractList").getStore().reload();
                                    }, this);
                                },
                                failure: function (form, action) {
                                    var res = Ext.decode(action.response.responseText);
                                    Ext.Msg.alert('tips', res.failure);
                                }
                            });
                        }
                    }
                }]
            }]
        });
        win.query('form')[0].getForm().setValues(data);
        win.show();
    },


    remove: function () {
        var row = this.ownerCt.ownerCt.query('grid')[0].getSelectionModel().selected.items;
        if (row.length == 0) {
            Ext.Msg.alert('', 'need to select a line of records!');
            return;
        }
        var data = row[0].data;
        Ext.MessageBox.confirm('', 'do you confirm delete?', function (opt) {
            if (opt == 'yes') {
                Ext.Ajax.request({
                    url: 'extract/delete',
                    async: true,
                    method: 'post',
                    params: data,
                    success: function (response) {
                        var res = Ext.decode(response.responseText);
                        if (res.success) {
                            Ext.Msg.alert('tips', 'remove success!', function () {
                                Ext.getCmp('extractWindows').child("#extractList").getStore().reload();
                            }, this);
                        } else {
                            Ext.Msg.alert('tips', res.failure);
                        }
                    },
                    failure: function (action) {
                        Ext.Msg.alert('tips', 'option failure!');
                    }
                })
            }
        });

    },

    refresh: function () {
        Ext.getCmp('extractWindows').child("#extractList").getStore().reload();
    }
});