export class BlueTooth{
    constructor(){
      getApp()['__app_blue'] = {
        devices:{},
        connected_uuid:'',
        connected_name:''
      }
    }
    /*
      监听蓝牙适配器状态变化事件
    */
    addEventListBle({success}){
      wx.onBluetoothAdapterStateChange((res)=> {
          console.log(`BLE Adapter State Changed: `, res)
          success && success(res);
      })
    }
    /*
       蓝牙初始化
    */
    initBlueTooth({success,fail}){
      //初始化蓝牙模块
      wx.openBluetoothAdapter({
        success:(result)=>{
          //获取本机蓝牙适配器状态。
          wx.getBluetoothAdapterState({
            success:(result)=>{
              success && success(result)
            },
            fail:(error)=>{
              fail && fail(error)
            }
          })
        },
        fail:(error)=>{
          console.log("BLE Init Fail")
        }
      })
    }
    /*
      监听发现蓝牙回调
    */ 
    blueFound({success}){
      let devices = getApp().__app_blue.devices;
      let device = {};
      wx.onBluetoothDeviceFound( res => {
          for (var k in res.devices) {
            device = res.devices[k];
            device['is_connected'] = false;
            device['is_showLoading'] = false;
            device['services'] = {};
            !devices[device.deviceId] && device.name.indexOf('QR-') == 0 && (devices[device.deviceId] = device)
          }
          success && success({data:devices});
          console.log("正在查找中",res)
        })
    }
    /*
      创建蓝牙
    */
    createBlueTooth(options){
      const { deviceId,devices,success } = options || {};
      wx.createBLEConnection({
          deviceId: deviceId,
          success: res =>{
            //获取服务列表 
            this.getBLEServiceId({
              deviceId:deviceId,
              devices:devices,
              success:res => {
                success && success(res);
                devices[deviceId].is_connected = true;
                devices[deviceId].is_showLoading = false;
              }
            })
          }
      })
    }
    /*
      获取服务列表
    */ 
    getBLEServiceId(options) {
      const { deviceId,devices,success } = options || {};
        wx.getBLEDeviceServices({
          deviceId: deviceId,
          success:(res)=>{
            // 更新服务列表
            for (var i = 0; i < res.services.length; i++) {
              devices[deviceId].services[res.services[i].uuid] = {uuid: res.services[i].uuid, characteristics: {}}
              this.getBLECharacteristics(deviceId, res.services[i].uuid,devices,success);// 获取服务的规格参数表
            }
          }
        })
    }

    /*
      获取服务的规格参数表
    */
    getBLECharacteristics(deviceId, serviceId,devices,cb) {
        wx.getBLEDeviceCharacteristics({
          deviceId: deviceId,
          serviceId: serviceId,
          success:(res)=>{
            // 更新到设备列表中去
            for (var i = 0; i < res.characteristics.length; i++) {
              devices[deviceId].services[serviceId].characteristics[res.characteristics[i].uuid] = res.characteristics[i]
              //this.setData({devices: devices})
            }

            cb && cb(res);

            // wx.hideLoading();
          }
        })
    }

    /*
      刷新
    */
    refresh(){
      wx.startBluetoothDevicesDiscovery({
        fail:(r)=>{
          wx.showModal({
              content:'请检查是否正确打开蓝牙',
              showCancel:false,
              confirmText:'知道了'
            })
        }
      })
      setTimeout(this.stopDiscovery, 3000);
    }
    /*
      停止搜寻附近的蓝牙外围设备
    */
    stopDiscovery(){
      wx.stopBluetoothDevicesDiscovery({})
    }
    /*
      断开蓝牙
    */ 
    disconnectDevice(options){
      console.log(options)
      const { deviceId,devices,success  } = options || {};
      wx.showLoading({title:'正在断开连接'});
       wx.closeBLEConnection({
          deviceId: deviceId,
          success:(res)=>{
            if(devices){
              devices[deviceId].is_connected = false
            }
            success && success(res);
            wx.hideLoading();
          }
        })
    }
    /*
      打印输出
    */ 
    onPrint(options){
      const { deviceId,serviceId,characteristicsId,buffs,loadingStatus } = options || {};
      console.log(this.base64_decode(buffs))
      const arrayBuffer = wx.base64ToArrayBuffer(buffs)
      for (var i = 0; i < arrayBuffer.byteLength; i += 480) {
        var tmpArrayBuffer = arrayBuffer.slice(i, i + 480);
        wx.writeBLECharacteristicValue({
          // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
          deviceId: deviceId,
          // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
          serviceId: serviceId,
          // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
          characteristicId: characteristicsId,
          // 这里的value是ArrayBuffer类型
          value: tmpArrayBuffer,
          success:(res)=>{

            switch (loadingStatus) {
              case 'signAll'://签收打印全部订单
                  wx.hideLoading();
              break;
              case 'currentSign'://签收打印当前订单
                  wx.hideLoading();
              break;
              case 'current'://打印当前订单
                  wx.hideLoading();
              break;
            
            }
            console.log('Write devid: ' + deviceId + ',serviceId:' + serviceId + ',characteristicId:' + characteristicsId)
          }
        })
      }
    }
    // 解码，配合decodeURIComponent使用
    base64_decode(input){ 
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
          enc1 = base64EncodeChars.indexOf(input.charAt(i++));
          enc2 = base64EncodeChars.indexOf(input.charAt(i++));
          enc3 = base64EncodeChars.indexOf(input.charAt(i++));
          enc4 = base64EncodeChars.indexOf(input.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
          }
        }
        return output;
    }
}
