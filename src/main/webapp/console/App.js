Ext.define('console.App', {
    extend: 'Ext.ux.desktop.App',

    requires: [
        'Ext.window.MessageBox',
        'Ext.ux.desktop.ShortcutModel',
        // 'console.action.permissionWindow',
        'console.action.dataSourceWindows',
        'console.action.readerWindows',
        'console.action.writerWindows',
        'console.action.extractWindows',
        'console.action.pumpWindows'
    ],

    init: function () {
        this.callParent();
    },

    getModules: function () {
        return [
            // new console.action.permissionWindow(),
            new console.action.dataSourceWindows(),
            new console.action.readerWindows(),
            new console.action.writerWindows(),
            new console.action.extractWindows(),
            new console.action.pumpWindows()
        ];
    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            //cls: 'ux-desktop-black',

            contextMenuItems: [
                {text: 'change background', handler: me.onSettings, scope: me}
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: [
                    {name: 'datasource', iconCls: 'grid-shortcut', module: 'dataSourceWindows'},
                    {name: 'reader', iconCls: 'grid-shortcut', module: 'readerWindows'},
                    {name: 'writer', iconCls: 'grid-shortcut', module: 'writerWindows'},
                    {name: 'extract', iconCls: 'grid-shortcut', module: 'extractWindows'},
                    {name: 'pump', iconCls: 'grid-shortcut', module: 'pumpWindows'}
                ]
            }),

            wallpaper: 'console/wallpapers/desktop2.jpg',
            wallpaperStretch: false
        });
    },
    // config for the start menu
    getStartConfig: function () {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            title: 'Don Griffin',
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 100,
                items: [
                    {
                        text: 'Settings',
                        iconCls: 'settings',
                        handler: me.onSettings,
                        scope: me
                    },
                    '-',
                    {
                        text: 'Logout',
                        iconCls: 'logout',
                        handler: me.onLogout,
                        scope: me
                    }
                ]
            }
        });
    },

    getTaskbarConfig: function () {
        var ret = this.callParent();

        return Ext.apply(ret, {
            quickStart: [
                {name: 'Accordion Window', iconCls: 'accordion', module: 'acc-win'},
                {name: 'Grid Window', iconCls: 'icon-grid', module: 'grid-win'}
            ],
            trayItems: [
                {xtype: 'trayclock', flex: 1}
            ]
        });
    },

    onLogout: function () {
        Ext.Msg.confirm('Logout', 'Are you sure you want to logout?');
    },

    onSettings: function () {
        var dlg = new console.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});