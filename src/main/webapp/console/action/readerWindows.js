/**
 * Created by zhiwei on 2016/11/21.
 */
Ext.define('console.action.readerWindows', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer',
        'console.store.readerStore',
        'console.store.dataSourceStore',
        'console.store.characterSetStore',
        'console.store.readerImplementsStore',
        'console.store.statusStore',
        'console.store.fieldStore',
        'console.store.paramStore'
    ],

    id: 'readerWindows',
    init: function () {
        this.launcher = {
            text: 'reader config',
            iconCls: 'icon-grid'
        };
    },

    createWindow: function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('readerWindows');
        if (!win) {
            win = desktop.createWindow({
                id: 'readerWindows',
                title: 'reader config',
                width: 1100,
                height: 600,
                iconCls: 'icon-grid',
                animCollapse: false,
                constrainHeader: true,
                layout: "fit",
                items: [{
                    xtype: 'grid',
                    itemId: 'readerList',
                    store: Ext.createWidget('readerStore'),
                    columns: {
                        defaults: {
                            width: '15%'
                        },
                        items: [
                            new Ext.grid.RowNumberer(),
                            {
                                text: "code",
                                sortable: true,
                                dataIndex: 'code',
                                width:'6%'
                            }, {
                                text: "name",
                                sortable: true,
                                dataIndex: 'name',
                                width:'35%'
                            }, {
                                text: "type",
                                sortable: true,
                                dataIndex: 'type'
                            }, {
                                text: "implementor",
                                sortable: true,
                                dataIndex: 'implementor'
                            }, {
                                text: "source code",
                                sortable: true,
                                dataIndex: 'sourceCode'
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
                            }, {
                                text: "execute script",
                                sortable: true,
                                hidden: true,
                                dataIndex: 'executeScript'
                            }
                        ]
                    }
                }],
                tbar: [{
                    text: 'add',
                    iconCls: 'add',
                    tooltip: 'add a new reader config',
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
                }, {
                    text: 'add field configs',
                    iconCls: 'add',
                    tooltip: 'add a field config to reader',
                    handler: this.addFieldConfigs
                }, {
                    text: 'add param configs',
                    iconCls: 'add',
                    tooltip: 'add a field config to reader',
                    handler: this.addParamMetaConfigs
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
            title: 'add reader config',
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
                    fieldLabel: 'code',
                    allowBlank: false
                }, {
                    name: 'name',
                    fieldLabel: 'name',
                    allowBlank: false
                }, {
                    name: 'type',
                    fieldLabel: 'type',
                    readOnly: true,
                    hidden: true,
                    allowBlank: false
                }, {
                    xtype: 'combobox',
                    name: 'implementor',
                    editable: false,
                    fieldLabel: 'implementor',
                    allowBlank: false, store: Ext.createWidget("readerImplementsStore"),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name'
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'source name',
                    name: 'sourceCode',
                    editable: true,
                    store: Ext.createWidget("dataSourceStore"),
                    queryMode: 'remote',
                    displayField: 'sourceName',
                    valueField: 'sourceCode',
                    allowBlank: true,
                    listeners: {
                        // ( Ext.form.field.ComboBox combo, Array records, Object eOpts )
                        select: function (c, r, e) {
                            var typeField = c.ownerCt.query("textfield[name='type']")[0];
                            typeField.setValue(r[0].data.sourceType);
                        }
                    }
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'source character set',
                    name: 'sourceCharacterSet',
                    editable: false,
                    store: Ext.createWidget("characterSetStore"),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    allowBlank: false
                }, {
                    xtype: 'textarea',
                    name: 'executeScript',
                    height: 200,
                    fieldLabel: 'execute script',
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
                                url: 'reader/add',
                                success: function (form, action) {
                                    Ext.Msg.alert('tips', 'add success', function () {
                                        form.owner.ownerCt.close();
                                        Ext.getCmp('readerWindows').child("#readerList").getStore().reload();
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
            title: 'modify reader config',
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
                    fieldLabel: 'code',
                    readOnly: true,
                    allowBlank: false
                }, {
                    name: 'name',
                    fieldLabel: 'name',
                    allowBlank: false
                }, {
                    name: 'type',
                    fieldLabel: 'type',
                    readOnly: true,
                    hidden: true,
                    allowBlank: false
                }, {
                    xtype: 'combobox',
                    name: 'implementor',
                    editable: false,
                    fieldLabel: 'implementor',
                    allowBlank: false, store: Ext.createWidget("readerImplementsStore"),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name'
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'source name',
                    name: 'sourceCode',
                    editable: true,
                    store: Ext.createWidget("dataSourceStore"),
                    queryMode: 'remote',
                    displayField: 'sourceName',
                    valueField: 'sourceCode',
                    allowBlank: true,
                    listeners: {
                        // ( Ext.form.field.ComboBox combo, Array records, Object eOpts )
                        select: function (c, r, e) {
                            var typeField = c.ownerCt.query("textfield[name='type']")[0];
                            typeField.setValue(r[0].data.sourceType);
                        }
                    }
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'source character set',
                    name: 'sourceCharacterSet',
                    editable: false,
                    store: Ext.createWidget("characterSetStore"),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    allowBlank: false
                }, {
                    xtype: 'textarea',
                    name: 'executeScript',
                    height: 160,
                    fieldLabel: 'execute script',
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
                                url: 'reader/modify',
                                success: function (form, action) {
                                    Ext.Msg.alert('tips', 'option success', function () {
                                        form.owner.ownerCt.close();
                                        Ext.getCmp('readerWindows').child("#readerList").getStore().reload();
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


    addParamMetaConfigs: function () {
        var row = this.ownerCt.ownerCt.query('grid')[0].getSelectionModel().selected.items;
        if (row.length == 0) {
            Ext.Msg.alert('', 'need to select a line of records!');
            return;
        }
        var data = row[0].data;
        Ext.create('Ext.window.Window', {
            modal: true,
            title: 'param meta configs',
            items: [{
                xtype: 'grid',
                width: 800,
                height: 560,
                itemId: 'paramList',
                selType: "rowmodel",
                plugins: [Ext.create("Ext.grid.plugin.RowEditing", { // 行编辑模式
                    clicksToMoveEditor: 2, // 双击编辑 整行修改
                    autoCancel: false,
                    saveBtnText: 'confirm',
                    cancelBtnText: 'cancel',
                    errorsText: 'error',
                    dirtyText: 'need confirm or cancel',
                    listeners: {
                        edit: function (e, d) { // d Object 有很多属性
                            d.record.data.rwCode = data.code;
                            d.record.data.rwType = 'reader';
                            Ext.Ajax.request({
                                url: 'param/addOrModify',
                                params: d.record.data, // 当前要编辑的记录
                                success: function (response) {
                                    var text = response.responseText;
                                    var res = Ext.decode(text);
                                    if (res.success) {
                                        d.record.commit();
                                        d.grid.store.reload();
                                    } else if (res.failure) {
                                        Ext.Msg.alert('tips', res.result);
                                    }
                                },
                                failure: function (response) {
                                    var text = response.responseText;
                                    var res = Ext.decode(text);
                                    if (res.failure) {
                                        Ext.Msg.alert('tips', res.result);
                                    }
                                }
                            });
                        }
                    }
                })],
                store: Ext.createWidget('paramStore', {
                    proxy: {
                        type: 'ajax',
                        url: 'param/find',
                        method: 'POST',
                        reader: {
                            type: 'json',
                            root: 'root',
                            totalProperty: 'total'
                        },
                        extraParams: {
                            rwCode: data.code,
                            rwType: 'reader'
                        }
                    }
                }),
                columns: {
                    defaults: {
                        width: '15%'
                    },
                    items: [
                        new Ext.grid.RowNumberer(),
                        {
                            text: "input position",
                            sortable: true,
                            dataIndex: 'sort',
                            editor: {
                                minValue: 1,
                                xtype: 'numberfield'
                            }
                        },
                        {
                            text: "rwCode",
                            sortable: true,
                            dataIndex: 'rwCode',
                            hidden: true,
                            editor: {
                                xtype: 'textfield'
                            }
                        }, {
                            text: "rwType",
                            sortable: true,
                            hidden: true,
                            dataIndex: 'rwType',
                            editor: {
                                xtype: 'textfield'
                            }
                        }, {
                            text: "alias",
                            sortable: true,
                            dataIndex: 'alias',
                            editor: {
                                xtype: 'textfield'
                            }
                        }, {
                            text: "data type",
                            sortable: true,
                            dataIndex: 'dataType',
                            editor: {
                                xtype: 'textfield'
                            }
                        }, {
                            text: "name",
                            sortable: true,
                            dataIndex: 'name',
                            flex: 1,
                            editor: {
                                xtype: 'textfield'
                            }
                        }
                    ]
                },
                tbar: [{
                    text: "add",
                    tooltip: 'add a new param config',
                    iconCls: "add",
                    handler: function () {
                        var p = new Object();
                        var store = this.ownerCt.ownerCt.store;
                        store.insert(store.getCount(), p); // 在最后一列后添加
                    }
                }, "-", {
                    text: 'remove',
                    tooltip: 'delete selected row',
                    iconCls: 'remove',
                    handler: function () {
                        var store = this.ownerCt.ownerCt.store;
                        var row = this.ownerCt.ownerCt.getSelectionModel().selected.items;
                        if (row.length == 0) {
                            Ext.Msg.alert('', 'need to select a line of records!');
                            return;
                        }
                        Ext.MessageBox.confirm('', 'do you confirm delete?',
                            function (opt) {
                                if (opt == 'yes') {
                                    Ext.Ajax.request({
                                        url: 'param/delete',
                                        params: row[0].data,
                                        success: function (response) {
                                            var text = response.responseText;
                                            var res = Ext.decode(text);
                                            if (res.failure) {
                                                Ext.Msg.alert('tips', res.result);
                                                return;
                                            }
                                            store.remove(row[0]);
                                        },
                                        failure: function (response) {
                                            var text = response.responseText;
                                            var res = Ext.decode(text);
                                            if (res.failure) {
                                                Ext.Msg.alert('tips', res.result);
                                            } else {
                                                Ext.Msg.alert('tips', text);
                                            }
                                        }
                                    });
                                }
                            });

                    }
                }, '-', {
                    text: 'refresh',
                    tooltip: 'refresh',
                    iconCls: 'refresh',
                    handler: function () {
                        this.ownerCt.ownerCt.store.reload();
                    }
                }]
            }]
        }).show();
    },

    addFieldConfigs: function () {
        var row = this.ownerCt.ownerCt.query('grid')[0].getSelectionModel().selected.items;
        if (row.length == 0) {
            Ext.Msg.alert('', 'need to select a line of records!');
            return;
        }
        var data = row[0].data;
        Ext.create('Ext.window.Window', {
            modal: true,
            title: 'field configs',
            items: [{
                xtype: 'grid',
                width: 800,
                height: 560,
                itemId: 'fieldList',
                selType: "rowmodel",
                plugins: [Ext.create("Ext.grid.plugin.RowEditing", { // 行编辑模式
                    clicksToMoveEditor: 2, // 双击编辑 整行修改
                    autoCancel: false,
                    saveBtnText: 'confirm',
                    cancelBtnText: 'cancel',
                    errorsText: 'error',
                    dirtyText: 'need confirm or cancel',
                    listeners: {
                        edit: function (e, d) { // d Object 有很多属性
                            d.record.data.readerConfigCode = data.code;
                            Ext.Ajax.request({
                                url: 'field/addOrUpdateField',
                                params: d.record.data, // 当前要编辑的记录
                                success: function (response) {
                                    var text = response.responseText;
                                    var res = Ext.decode(text);
                                    if (res.success) {
                                        d.record.commit();
                                        d.grid.store.reload();
                                    } else if (res.failure) {
                                        Ext.Msg.alert('tips', res.result);
                                    }
                                },
                                failure: function (response) {
                                    var text = response.responseText;
                                    var res = Ext.decode(text);
                                    if (res.failure) {
                                        Ext.Msg.alert('tips', res.result);
                                    }
                                }
                            });
                        }
                    }
                })],
                store: Ext.createWidget('fieldStore', {
                    proxy: {
                        type: 'ajax',
                        url: 'field/find',
                        method: 'POST',
                        reader: {
                            type: 'json',
                            root: 'root',
                            totalProperty: 'total'
                        },
                        extraParams: {
                            readerConfigCode: data.code
                        }
                    }
                }),
                columns: {
                    defaults: {
                        width: '15%'
                    },
                    defaults: {},
                    items: [
                        new Ext.grid.RowNumberer(),
                        {
                            text: "reader config code",
                            sortable: true,
                            dataIndex: 'readerConfigCode',
                            hidden: true,
                            editor: {
                                xtype: 'textfield'
                            }
                        }, {
                            text: "field code",
                            sortable: true,
                            dataIndex: 'fieldCode',
                            editor: {
                                xtype: 'textfield'
                            }
                        }, {
                            text: "field name",
                            sortable: true,
                            dataIndex: 'fieldName',
                            editor: {
                                xtype: 'textfield'
                            }
                        }, {
                            text: "global alias",
                            sortable: true,
                            dataIndex: 'globalAlias',
                            editor: {
                                xtype: 'textfield'
                            }
                        }, {
                            text: "alias",
                            sortable: true,
                            dataIndex: 'alias',
                            editor: {
                                xtype: 'textfield'
                            }
                        }, {
                            text: "data type",
                            sortable: true,
                            dataIndex: 'dataType',
                            editor: {
                                xtype: 'textfield'
                            }
                        }, {
                            text: "key index",
                            sortable: true,
                            dataIndex: 'keyIndex',
                            flex: 1,
                            editor: {
                                xtype: 'textfield'
                            },
                            renderer: function (val) {
                                if (val == '-1' || val == -1) {
                                    return "";
                                } else {
                                    return val;
                                }
                            }
                        }
                    ]
                },
                tbar: [{
                    text: "add",
                    tooltip: 'add a new field config',
                    iconCls: "add",
                    handler: function () {
                        var p = new Object();
                        var store = this.ownerCt.ownerCt.store;
                        store.insert(store.getCount(), p); // 在最后一列后添加
                    }
                }, "-", {
                    text: 'remove',
                    tooltip: 'delete selected row',
                    iconCls: 'remove',
                    handler: function () {
                        var store = this.ownerCt.ownerCt.store;
                        var row = this.ownerCt.ownerCt.getSelectionModel().selected.items;
                        if (row.length == 0) {
                            Ext.Msg.alert('', 'need to select a line of records!');
                            return;
                        }
                        Ext.MessageBox.confirm('', 'do you confirm delete?',
                            function (opt) {
                                if (opt == 'yes') {
                                    Ext.Ajax.request({
                                        url: 'field/delete',
                                        params: {
                                            fieldCode: row[0].data.fieldCode,
                                            readerConfigCode: row[0].data.readerConfigCode
                                        },
                                        success: function (response) {
                                            var text = response.responseText;
                                            var res = Ext.decode(text);
                                            if (res.failure) {
                                                Ext.Msg.alert('tips', res.result);
                                                return;
                                            }
                                            store.remove(row[0]);
                                        },
                                        failure: function (response) {
                                            var text = response.responseText;
                                            var res = Ext.decode(text);
                                            if (res.failure) {
                                                Ext.Msg.alert('tips', res.result);
                                            } else {
                                                Ext.Msg.alert('tips', text);
                                            }
                                        }
                                    });
                                }
                            });

                    }
                }, '-', {
                    text: 'refresh',
                    tooltip: 'refresh',
                    iconCls: 'refresh',
                    handler: function () {
                        this.ownerCt.ownerCt.store.reload();
                    }
                }]
            }]
        }).show();
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
                    url: 'reader/delete',
                    async: true,
                    method: 'post',
                    params: data,
                    success: function (response) {
                        var res = Ext.decode(response.responseText);
                        if (res.success) {
                            Ext.Msg.alert('tips', 'remove success!', function () {
                                Ext.getCmp('readerWindows').child("#readerList").getStore().reload();
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
        Ext.getCmp('readerWindows').child("#readerList").getStore().reload();
    }
});
