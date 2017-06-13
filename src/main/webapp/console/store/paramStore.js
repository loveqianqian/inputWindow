/*
 *
 *  *****************************************************************************
 *  * Copyright ( c ) 2016 Heren Tianjin Inc. All Rights Reserved.
 *  *
 *  * This software is the confidential and proprietary information of Heren Tianjin Inc
 *  * ("Confidential Information").  You shall not disclose such Confidential Information
 *  *  and shall use it only in accordance with the terms of the license agreement
 *  *  you entered into with Heren Tianjin or a Heren Tianjin authorized
 *  *  reseller (the "License Agreement").
 *  ****************************************************************************
 *  *
 */

/**
 * Created by luoxiaoming on 17-3-6.
 */
Ext.define("console.store.paramStore", {
    extend: 'Ext.data.Store',
    alias: 'widget.paramStore',
    autoLoad: true,
    fields: ['rwType', 'rwCode', 'alias', 'dataType', 'name', 'sort'],
    proxy: {
        type: 'ajax',
        url: 'param/find',
        method: 'POST',
        reader: {
            type: 'json',
            root: 'root',
            totalProperty: 'total'
        }
    }
});