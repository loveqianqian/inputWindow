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
 * Created by zhiwei on 2017/1/4.
 */
/**
 * 获取channel endpoint connector 三个类别的数据信息
 */
$(function () {
    $.ajax({
        type: "GET",
        url: "/client/init/json/flow/findThreeElements",
        async: true,
        dataType: 'json',
        error: function () {
            alert("error");
        },
        success: function (data) {
            var resultJson = eval(data);
            var result = resultJson.result;
            if (result) {
                var connectorJson = resultJson.connector;
                var channelJson = resultJson.channel;
                var endpointJson = resultJson.endpoint;
                for (var i = 0; i < connectorJson.length; i++) {
                    var connectorDesc = connectorJson[i].connectionDescription;
                    var connectKey = connectorJson[i].connectKey;
                    $("#connector").append("<option value='" + connectKey + "'>" + connectorDesc + "</option>");
                }
                for (var j = 0; j < channelJson.length; j++) {
                    var channelName = channelJson[j].name;
                    var channelKey = channelJson[j].channelKey;
                    $("#channel").append("<option value='" + channelKey + "'>" + channelName + "</option>");
                }
                for (var m = 0; m < endpointJson.length; m++) {
                    var endpointName = endpointJson[m].endpointName;
                    var endpointKey = endpointJson[m].endpointKey;
                    $("#endpoint").append("<option value='" + endpointKey + "'>" + endpointName + "</option>");
                }
            } else {
                var msg = resultJson.resultMsg;
            }
            console.info(result);
        }
    });
});

/**
 * 数据模型的初始化数据
 * @type {{class: string, linkFromPortIdProperty: string, linkToPortIdProperty: string, modelData: {position: string}, nodeDataArray: *[]}}
 */
var data = {
    "class": "go.GraphLinksModel",
    "linkFromPortIdProperty": "fromPort",
    "linkToPortIdProperty": "toPort",
    "modelData": {"position": "-5 -5"},
    "nodeDataArray": [
        {"key": -1, "category": "Start", "loc": "50 200", "fill": "#4fba4f", "stepType": 1, "text": "Start"},
        {"key": -2, "category": "End", "loc": "810 200", "fill": "#CE0620", "stepType": 4, "text": "End"}
    ]
};

/**
 * 初始化数据模块的字典，测试用
 * @type {*[]}
 */
var myJson = [
    {key: 'T123', text: "开始", figure: "Block", fill: "#4fba4f", stepType: 1},
    {key: 'T456', text: "开始", figure: "Block", fill: "#4fba4f", stepType: 1},
    {key: 'T567', text: "开始", figure: "Block", fill: "#4fba4f", stepType: 1}
];

var myDesigner;

/**
 * 流程模块的展示框，每次点击change按钮，动态加载数据和流程模块
 */
$('#btnChangeId').click(function () {
    $('#sample').remove();
    $('#emptyDivId').after('<div id="sample" style="width:100%;height:100%;margin: 0">' +
        '<div style="width:100%;height:100%; white-space:nowrap;">' +
        '<span style="display: inline-block; vertical-align: top; padding: 5px; width:200px;">' +
        '<div id="myPaletteDiv" style="border: solid 1px gray; height: 380px;width:200px;" class="wrap"></div>' +
        '</span>' +
        '<span style="display: inline-block; vertical-align: top; padding: 5px; width:925px;margin-left: 5px;">' +
        '<div id="myFlowDesignerDiv" style="border: solid 1px darkgrey; height: 380px;width:925px;" class="wrap"></div>' +
        '</span>' +
        '</div>' +
        '</div>');
    myDesigner = new FlowDesigner('myFlowDesignerDiv');
    var connectorObject=$("#connector");
    var connectorText = connectorObject.find("option:selected").val();
    var connectorValue = connectorObject.find("option:selected").text();
    var connectorJson = {
        key: connectorText,
        text: connectorValue,
        figure: "Block",
        fill: "#61733B",
        stepType: "connector"
    };
    var channelObject = $("#channel");
    var channelText = channelObject.find("option:selected").val();
    var channelValue = channelObject.find("option:selected").text();
    var channelJson = {
        key: channelText,
        text: channelValue,
        figure: "Block",
        fill: "#735627",
        stepType: "channel"
    };
    var endpointObject=$("#endpoint");
    var endpointText = endpointObject.find("option:selected").val();
    var endpointValue = endpointObject.find("option:selected").text();
    var endpointJson = {
        key: endpointText,
        text: endpointValue,
        figure: "Block",
        fill: "#4fba4f",
        stepType: "endpoint"
    };
    var realJson = [];
    realJson.push(connectorJson);
    realJson.push(endpointJson);
    realJson.push(channelJson);
    myDesigner.initToolbar('myPaletteDiv', realJson);
    myDesigner.displayFlow(data);
});

/**
 * 回传数据到本地
 */
$('#btnSubmitId').click(function () {
    var myResult = {flowData: myDesigner.getFlowData()};
    $.ajax({
        type: "POST",
        url: "/client/init/json/flow/add",
        async: true,
        dataType: 'json',
        data: myResult,
        error: function () {
            alert("error");
        },
        success: function (data) {
            console.info(data);
        }
    });
});