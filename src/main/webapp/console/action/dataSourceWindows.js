/**
 * Created by zhiwei on 2016/11/21.
 */
Ext.define('console.action.dataSourceWindows', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer',
        'console.store.dataSourceStore',
        'console.store.dialectStore',
        'console.store.driverClassStore',
        'console.store.statusStore'
    ],

    id: 'dataSourceWindows',
    init: function () {
        this.launcher = {
            text: 'datasource config',
            iconCls: 'icon-grid'
        };
    },

    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('dataSourceWindows');
        if (!win) {
            win = desktop.createWindow({
                id: 'dataSourceWindows',
                title: 'datasource config',
                width: 1300,
                height: 600,
                iconCls: 'icon-grid',
                animCollapse: false,
                constrainHeader: true,
                layout: "fit",
                items: [{
                    xtype: 'grid',
                    itemId: 'dataSourceList',
                    store: Ext.createWidget('dataSourceStore'),
                    columns: {
                        defaults: {
                            width: '15%'
                        },
                        items: [
                            new Ext.grid.RowNumberer(),
                            {
                                text: "source code",
                                sortable: true,
                                dataIndex: 'sourceCode'
                            }, {
                                text: "source name",
                                sortable: true,
                                dataIndex: 'sourceName'
                            }, {
                                text: "type",
                                sortable: true,
                                dataIndex: 'sourceType'
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
                    menu: {
                        items: [{
                            text: 'add database source',
                            handler: this.addDatabaseSource
                        }
                        // , {
                        //     text: 'add ws source',
                        //     handler: function () {
                        //         alert("nothing");
                        //     }
                        // }, {
                        //     text: 'add tcp source',
                        //     handler: function () {
                        //         alert("nothing");
                        //     }
                        // }
                        ]
                    }
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

    addDatabaseSource: function () {
        Ext.create('Ext.window.Window', {
            modal: true,
            title: 'add database source config',
            items: [{
                xtype: 'form',
                width: 700,
                height: 500,
                autoScroll: true,
                defaults: {
                    margin: '10 10 10 10',
                    xtype: 'textfield',
                    labelWidth: 200,
                    width: 650
                },
                items: [{
                    name: 'sourceCode',
                    fieldLabel: 'source code',
                    allowBlank: false
                }, {
                    name: 'sourceName',
                    fieldLabel: 'source name',
                    allowBlank: false
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'dialect',
                    name: 'dialect',
                    editable: false,
                    store: Ext.createWidget("dialectStore"),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    allowBlank: false
                }, {
                    name: 'username',
                    fieldLabel: 'username',
                    allowBlank: false
                }, {
                    name: 'password',
                    fieldLabel: 'password',
                    allowBlank: false,
                    inputType: 'password'
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'driver class',
                    name: 'driverClass',
                    editable: false,
                    store: Ext.createWidget("driverClassStore"),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    allowBlank: false
                }, {
                    name: 'jdbcUrl',
                    fieldLabel: 'jdbc url',
                    allowBlank: false
                }, {
                    name: 'maxPoolSize',
                    fieldLabel: 'max pool size',
                    allowBlank: false,
                    regex: /^[0-9]*$/,
                    regexText: 'please enter the correct value!'
                }, {
                    name: 'minPoolSize',
                    fieldLabel: 'min pool size',
                    allowBlank: false,
                    regex: /^[0-9]*$/,
                    regexText: 'please enter the correct value!'
                }, {
                    name: 'initialPoolSize',
                    fieldLabel: 'initial pool size',
                    allowBlank: false,
                    regex: /^[0-9]*$/,
                    regexText: 'please enter the correct value!'
                }, {
                    name: 'maxIdleTime',
                    fieldLabel: 'max idle time',
                    allowBlank: false,
                    regex: /^[0-9]*$/,
                    regexText: 'please enter the correct value!'
                }, {
                    name: 'checkoutTimeOut',
                    fieldLabel: 'checkout time out',
                    allowBlank: false,
                    regex: /^[0-9]*$/,
                    regexText: 'please enter the correct value!'
                }, {
                    name: 'acquireIncrement',
                    fieldLabel: 'acquire increment',
                    allowBlank: false,
                    regex: /^[0-9]*$/,
                    regexText: 'please enter the correct value!'
                }, {
                    name: 'acquireRetryAttempts',
                    fieldLabel: 'acquire retry attempts',
                    allowBlank: false,
                    regex: /^[0-9]*$/,
                    regexText: 'please enter the correct value!'
                }, {
                    name: 'acquireRetryDelay',
                    fieldLabel: 'acquire retry delay',
                    allowBlank: false,
                    regex: /^[0-9]*$/,
                    regexText: 'please enter the correct value!'
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'auto commit on close',
                    name: 'autoCommitOnClose',
                    editable: false,
                    store: Ext.createWidget("statusStore"),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    allowBlank: false
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'break after acquire failure',
                    name: 'breakAfterAcquireFailure',
                    editable: false,
                    store: Ext.createWidget("statusStore"),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    allowBlank: false
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'test connection on check in',
                    name: 'testConnectionOnCheckIn',
                    editable: false,
                    store: Ext.createWidget("statusStore"),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    allowBlank: false
                }, {
                    name: 'idleConnectionTestPeriod',
                    fieldLabel: 'idle connection test period',
                    allowBlank: false,
                    regex: /^[0-9]*$/,
                    regexText: 'please enter the correct value!'
                }, {
                    name: 'maxStatements',
                    fieldLabel: 'max statements',
                    allowBlank: false,
                    regex: /^[0-9]*$/,
                    regexText: 'please enter the correct value!'
                }, {
                    name: 'maxStatementsPerConnection',
                    fieldLabel: 'max statements per connection',
                    allowBlank: false,
                    regex: /^[0-9]*$/,
                    regexText: 'please enter the correct value!'
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
                                url: 'datasource/addDataBaseSource',
                                success: function (form, action) {
                                    Ext.Msg.alert('tips', 'add success', function () {
                                        form.owner.ownerCt.close();
                                        Ext.getCmp('dataSourceWindows').child("#dataSourceList").getStore().reload();
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
        Ext.Ajax.request({
            url: 'datasource/findOne',
            async: true,
            method: 'post',
            params: data,
            success: function (response) {
                var datas = Ext.decode(response.responseText);
                var win = Ext.create('Ext.window.Window', {
                    modal: true,

                    title: 'add database source config',
                    items: [{
                        xtype: 'form',
                        width: 700,
                        height: 500,
                        autoScroll: true,
                        itemId: 'modifyForm',
                        defaults: {
                            margin: '10 10 10 10',
                            xtype: 'textfield',
                            labelWidth: 200,
                            width: 650
                        },
                        items: [{
                            name: 'sourceCode',
                            fieldLabel: 'source code',
                            readOnly: true,
                            allowBlank: false
                        }, {
                            name: 'sourceName',
                            fieldLabel: 'source name',
                            allowBlank: false
                        }, {
                            xtype: 'combobox',
                            fieldLabel: 'dialect',
                            name: 'dialect',
                            editable: false,
                            store: Ext.createWidget("dialectStore"),
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'name',
                            allowBlank: false
                        }, {
                            name: 'username',
                            fieldLabel: 'username',
                            allowBlank: false
                        }, {
                            name: 'password',
                            fieldLabel: 'password',
                            allowBlank: false,
                            inputType: 'password'
                        }, {
                            xtype: 'combobox',
                            fieldLabel: 'driver class',
                            name: 'driverClass',
                            editable: false,
                            store: Ext.createWidget("driverClassStore"),
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'name',
                            allowBlank: false
                        }, {
                            name: 'jdbcUrl',
                            fieldLabel: 'jdbc url',
                            allowBlank: false
                        }, {
                            name: 'maxPoolSize',
                            fieldLabel: 'max pool size',
                            allowBlank: false,
                            regex: /^[0-9]*$/,
                            regexText: 'please enter the correct value!'
                        }, {
                            name: 'minPoolSize',
                            fieldLabel: 'min pool size',
                            allowBlank: false,
                            regex: /^[0-9]*$/,
                            regexText: 'please enter the correct value!'
                        }, {
                            name: 'initialPoolSize',
                            fieldLabel: 'initial pool size',
                            allowBlank: false,
                            regex: /^[0-9]*$/,
                            regexText: 'please enter the correct value!'
                        }, {
                            name: 'maxIdleTime',
                            fieldLabel: 'max idle time',
                            allowBlank: false,
                            regex: /^[0-9]*$/,
                            regexText: 'please enter the correct value!'
                        }, {
                            name: 'checkoutTimeOut',
                            fieldLabel: 'checkout time out',
                            allowBlank: false,
                            regex: /^[0-9]*$/,
                            regexText: 'please enter the correct value!'
                        }, {
                            name: 'acquireIncrement',
                            fieldLabel: 'acquire increment',
                            allowBlank: false,
                            regex: /^[0-9]*$/,
                            regexText: 'please enter the correct value!'
                        }, {
                            name: 'acquireRetryAttempts',
                            fieldLabel: 'acquire retry attempts',
                            allowBlank: false,
                            regex: /^[0-9]*$/,
                            regexText: 'please enter the correct value!'
                        }, {
                            name: 'acquireRetryDelay',
                            fieldLabel: 'acquire retry delay',
                            allowBlank: false,
                            regex: /^[0-9]*$/,
                            regexText: 'please enter the correct value!'
                        }, {
                            xtype: 'combobox',
                            fieldLabel: 'auto commit on close',
                            name: 'autoCommitOnClose',
                            editable: false,
                            store: Ext.createWidget("statusStore"),
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'name',
                            allowBlank: false
                        }, {
                            xtype: 'combobox',
                            fieldLabel: 'break after acquire failure',
                            name: 'breakAfterAcquireFailure',
                            editable: false,
                            store: Ext.createWidget("statusStore"),
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'name',
                            allowBlank: false
                        }, {
                            xtype: 'combobox',
                            fieldLabel: 'test connection on check in',
                            name: 'testConnectionOnCheckIn',
                            editable: false,
                            store: Ext.createWidget("statusStore"),
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'name',
                            allowBlank: false
                        }, {
                            name: 'idleConnectionTestPeriod',
                            fieldLabel: 'idle connection test period',
                            allowBlank: false,
                            regex: /^[0-9]*$/,
                            regexText: 'please enter the correct value!'
                        }, {
                            name: 'maxStatements',
                            fieldLabel: 'max statements',
                            allowBlank: false,
                            regex: /^[0-9]*$/,
                            regexText: 'please enter the correct value!'
                        }, {
                            name: 'maxStatementsPerConnection',
                            fieldLabel: 'max statements per connection',
                            allowBlank: false,
                            regex: /^[0-9]*$/,
                            regexText: 'please enter the correct value!'
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
                                        url: 'datasource/modifyDataBaseSource',
                                        success: function (form, action) {
                                            Ext.Msg.alert('tips', 'option success', function () {
                                                form.owner.ownerCt.close();
                                                Ext.getCmp('dataSourceWindows').child("#dataSourceList").getStore().reload();
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
                win.query('form')[0].getForm().setValues(datas);
                win.show();
            }
        })
    },

    remove: function () {
        var row = this.ownerCt.ownerCt.query('grid')[0].getSelectionModel().selected.items;
        if (row.length == 0) {
            Ext.Msg.alert('', 'need to select a line of records!');
            return;
        }
        var data = row[0].data;
        Ext.MessageBox.confirm('', '您确定要删除吗?', function (opt) {
            if (opt == 'yes') {
                Ext.Ajax.request({
                    url: 'datasource/delete',
                    async: true,
                    method: 'post',
                    params: data,
                    success: function (response) {
                        var res = Ext.decode(response.responseText);
                        if (res.success) {
                            Ext.Msg.alert('tips', 'remove success!', function () {
                                Ext.getCmp('dataSourceWindows').child("#dataSourceList").getStore().reload();
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
        Ext.getCmp('dataSourceWindows').child("#dataSourceList").getStore().reload();
    }
});
