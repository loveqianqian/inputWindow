/**
 * Created by luoxiaoming on 17-3-18.
 */
Ext.define("console.store.writerImplementsStore", {
    extend: 'Ext.data.Store',
    alias: 'widget.writerImplementsStore',
    autoLoad: true,
    fields: ['name'],
    data: [
        {name: 'com.heren.etl.support.ws.WsWriter'},
        {name: 'com.heren.etl.support.jdbc.JdbcWriter'}
    ]
});