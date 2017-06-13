/**
 * Created by luoxiaoming on 17-3-18.
 */
Ext.define("console.store.readerImplementsStore", {
    extend: 'Ext.data.Store',
    alias: 'widget.readerImplementsStore',
    autoLoad: true,
    fields: ['name'],
    data: [
        {name: 'com.heren.etl.support.ws.WsReader'},
        {name: 'com.heren.etl.support.jdbc.JdbcReader'}
    ]
});